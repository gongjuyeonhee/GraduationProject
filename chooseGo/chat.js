import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { View, Text, StyleSheet, Pressable, Image, InputToolbar, Actions, Composer, Send } from "react-native";
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


export default function ChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const [userNickname, setUserNickname] = useState(""); // 초기값을 빈 문자열로 설정
  const [userProfile, setUserProfile] = useState(null); // 사용자 프로필 이미지 URL 추가
  
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
            name: data.user.username,
            profileImage: data.user.profileImage, // 프로필 이미지 URL 추가
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
          setUserProfile(userData.profileImage || null); 
          setUserNickname(nickname || '로딩 중...');
          console.log("userNickname:", nickname);
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
          const newMessage = {
            text,
            createdAt: serverTimestamp(),
            user: {
              _id: currentUser.uid,
              name: userNickname,
              profileImage: userProfile, 
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
  }, [currentUser, db, messages, chatRoomId, userNickname, userProfile]);
  
  return (
    <GiftedChat
    messages={messages}
    onSend={(newMessages) => handleSend(newMessages)}
    user={{
      _id: currentUser ? currentUser.uid : 'guest', 
      name: userNickname || '로딩 중...',
    }}
    renderMessageText={renderMessageText} 
    renderAvatar={(props) => (
      <Image
        source={{ uri: props.currentMessage.user.profileImage }} // 이미지 Url
        style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1.1, borderColor: '#ACB1D6', }} 
      />
    )}
    renderBubble={renderBubble}
    renderTime={renderTime}
   
  />
  );
}


//채팅 속 텍스트 스타일
function renderMessageText(props) {
  return (
    <Text style={{ fontSize: 15, color: 'black',  fontWeight: 'bold', marginLeft: 3, marginBottom: 2,}}>{props.currentMessage.text}</Text>
  );
}

// 채팅 버블 스타일
function renderBubble(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#F8F6F4', 
          padding: 10, 
          //marginTop: 8,
          borderWidth: 1.1,
          borderColor: '#ACB1D6',
        },
        right: {
          backgroundColor: '#D2E9E9', 
          padding: 10, 
          borderWidth: 1,
          borderColor: '#A1CCD1',
        },
      }}
    />
  );
}


//채팅 속 시간 스타일
function renderTime(props) {
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // 24시간 형식
  };

  return (
    <Text style={{ fontSize: 10, color: 'gray', marginLeft: 3 }}>
      {props.currentMessage.createdAt.toLocaleTimeString('ko-KR', timeOptions)}
    </Text>
  );
}


