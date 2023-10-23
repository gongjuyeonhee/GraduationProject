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
} from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth';
import app from '../firebaseConfig';
import uuidRandom from 'uuid-random';
//import { renderInputToolbar, renderActions, renderComposer, renderSend } from '../InputToolbar';
//import {renderAvatar,renderBubble,renderSystemMessage,renderMessage,renderMessageText,renderCustomView,} from './MessageContainer';

export default function ChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const [userNickname, setUserNickname] = useState(""); // 초기값을 빈 문자열로 설정
  
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getFirestore(app); 
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
          _id: doc.id, 
          createdAt,
          text: data.text,
          user: {
            _id: data.user._id,
            name: data.user.name,
          },
        };
      });
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
        }
      }
    };

    fetchUserNickname();
  }, []);


  const handleSend = useCallback(async (newMessages = []) => {
    if (!currentUser || !userNickname) {
      return; // 사용자가 로그인하지 않았거나 닉네임이 없을 경우 메시지를 보내지 않음
    }
  
    const chatRef = collection(db, 'chat'); 

    try {
      await Promise.all(
        newMessages.map(async (message) => {
          const { text } = message;
          const nickname = userNickname; 
          const newMessage = {
            text,
            createdAt: serverTimestamp(),
            user: {
              _id: currentUser.uid,
              name: nickname, 
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
        _id: currentUser ? currentUser.uid : 'guest', 
        name: userNickname || '로딩 중...', 
      }}
      //renderSend={renderSend}
      
    />
  );
  
}
