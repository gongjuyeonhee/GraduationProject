import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  where,
  getDoc,
} from 'firebase/firestore'; // Firestore 관련 함수를 import합니다.
import { getAuth } from 'firebase/auth';
import app from '../firebaseConfig';
import uuidRandom from 'uuid-random';
//import { renderInputToolbar, renderActions, renderComposer, renderSend } from '../InputToolbar';
//import {renderAvatar,renderBubble,renderSystemMessage,renderMessage,renderMessageText,renderCustomView,} from './MessageContainer';

export default function ChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]); // 참가자 목록 추가
  const [userNickname, setUserNickname] = useState(""); // 초기값을 빈 문자열로 설정
  //console.log("여기서부터 오류 잡아보자");
  //console.log(userNickname);

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getFirestore(app); // Firestore 인스턴스 가져오기

  const { chatRoomId, postId } = route.params;

  
  useEffect(() => {
    if (!currentUser || !postId) return;

    const chatRef = collection(db, 'chat');
    const q = query(
      chatRef,
      orderBy('createdAt', 'desc'),
      where('chatRoomId', '==', chatRoomId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt ? data.createdAt.toDate() : null;
        return {
          _id: doc.id, // Firestore 문서 ID를 사용
          createdAt,
          text: data.text,
          user: {
            _id: data.user._id,
            name: data.user.name,
          },
        };
      });

      //console.log(newMessages[0].user.name); <<이게 문제였음. 절대 ㄴㄴ
      // messages 배열을 Firestore에서 가져온 메시지와 새로운 메시지를 올바르게 합치는 부분
      const updatedMessages = GiftedChat.append(messages, newMessages);
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [currentUser, db, postId]);


  useEffect(() => {
    const fetchUserNickname = async () => {
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const nickname = userData.username;
          setUserNickname(nickname);

          //renderGiftedChat();
        }
      }
    };

    fetchUserNickname();
  }, []);


  const handleSend = useCallback(async (newMessages = []) => {
    if (!currentUser || !userNickname) {
      return; // 사용자가 로그인하지 않안거나 닉네임이 없을 경우 메시지를 보내지 않음
    }
  
    const chatRef = collection(db, 'chat'); // Firestore 인스턴스를 사용하여 컬렉션 참조
  
    try {
      await Promise.all(
        newMessages.map(async (message) => {
          const { text } = message;
          const nickname = userNickname; // 사용자 닉네임 가져오기
          //console.log(userNickname);
          const newMessage = {
            text,
            createdAt: serverTimestamp(),
            user: {
              _id: currentUser.uid,
              name: nickname, // 사용자 닉네임을 'name' 속성으로 저장
            },
            chatRoomId: chatRoomId,
          };
          await addDoc(chatRef, newMessage);
        })
      );
  
      // 메시지를 보낸 후에 메시지 배열을 업데이트
      const updatedMessages = GiftedChat.append(messages, newMessages);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Firestore 오류:', error);
    }
  }, [currentUser, db, messages, chatRoomId, userNickname]);
  
 

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => handleSend(newMessages)}
      user={{
        _id: currentUser ? currentUser.uid : 'guest', // currentUser가 없으면 'guest'로 설정 또는 다른 기본값을 사용
        name: userNickname || '로딩 중...', // 닉네임이 없을 때 'Loading...'을 표시하거나 다른 기본값 사용
      }}
      //renderSend={renderSend}
      
    />
  );
  
}
