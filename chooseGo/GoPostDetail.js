import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formatTimeFromTimestamp } from "../utils/timeUtils";
import { getDatabase, ref, onValue, remove, get } from "firebase/database";
import { getAuth } from "firebase/auth";
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
  getDocs,
  updateDoc,
  db,
} from 'firebase/firestore'; 
import app from "../firebaseConfig";
import { Bubble } from "react-native-gifted-chat";
import { AntDesign } from '@expo/vector-icons';


function PostDetailScreen({ route }) {
  const navigation = useNavigation();
  const { postId } = route.params; // 전달받은 데이터를 사용
  const [postData, setPostData] = useState(null);
  const [authorUID, setAuthorUID] = useState(null); // 작성자 UID 추가
  const auth = getAuth();
  const currentUserUID = auth.currentUser ? auth.currentUser.uid : null;
  const [chatRoomSnapshot, setChatRoomSnapshot] = useState();
  
  async function fetchChatRoomData() {
    try {
      const db = getFirestore(app); // Firestore 인스턴스 초기화
      const chatRoomRef = collection(db, 'chatRooms');
      const chatRoomQuery = query(chatRoomRef, where('postId', '==', postId.toString()));
      const snapshot = await getDocs(chatRoomQuery);
      setChatRoomSnapshot(snapshot); // Update chat room data in component's state
    } catch (error) {
      console.error('Error fetching chat room data:', error);
      setChatRoomSnapshot([]); // 오류 발생 시 빈 배열로 초기화
    }
  }
  
  useEffect(() => {
    fetchChatRoomData();
  }, [postId]);
  

  // postId를 사용하여 게시물 정보를 가져오고 렌더링합
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const postRef = ref(db, `posts/withGo/${postId}`);
      
        // 게시물 데이터를 실시간으로 가져옴
        const listener = onValue(postRef, (snapshot) => {
          const data = snapshot.val();
          setPostData(data);
          setAuthorUID(data ? data.userId : null); // 작성자 UID 설정
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); // fetchData 함수를 호출
  }, [postId]);


  //삭제 버튼
  const handleDelete = async () => {
    try {
      const auth = getAuth();
      const currentUserUID = auth.currentUser ? auth.currentUser.uid : null;
      const db = getDatabase();
      const postRef = ref(db, `posts/withGo/${postId}`);
           
      // 게시물 정보 가져오기 (작성자 UID 포함)
      const snapshot = await get(postRef);
  
      if (snapshot.exists()) {
        const postData = snapshot.val();
        const authorUID = postData ? postData.userId : null;

        if (currentUserUID === authorUID) {
          // 작성자인 경우에만 데이터 삭제 요청
          await remove(postRef);
          console.log("게시물이 삭제되었습니다.");
          navigation.navigate("WithGo", { screen: "WithGo" });
        } else {
          console.error("작성자만 해당 게시물을 삭제할 수 있습니다.");
          console.log(currentUserUID);
          console.log(authorUID);
        }
      } else {
        console.error("게시물을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("게시물 삭제 중 오류 발생:", error);
    }
  };

  const handleChatButtonClick = async () => {
    try {
      // postId를 사용하여 채팅방을 생성하고 이동
      const db = getDatabase();
      const postRef = ref(db, `posts/withGo/${postId}/postId`);
      const snapshot = await get(postRef);

      if (snapshot.exists()) {
        const postId = snapshot.val(); // postId 값 가져오기
        createChatRoom(postId); // 가져온 postId를 createChatRoom 함수에 전달
      } else {
        console.error('postId가 존재하지 않습니다.');
      }
  } catch (error) {
    console.error('Realtime Database 오류:', error);
  }
  };
  

  // 채팅방 생성 함수
  const createChatRoom = async (postId) => {
    try {
      // Firestore의 chatRooms 컬렉션에 대한 참조
      const db = getFirestore(app);
      const chatRoomRef = collection(db, 'chatRooms');
  
      // 게시물에 대한 채팅 룸이 이미 존재하는지 확인
      const existingChatRoomQuery = query(
        chatRoomRef,
        where('postId', '==', postId.toString())
      );
  
      const existingChatRooms = await getDocs(existingChatRoomQuery);
  
      if (existingChatRooms.docs.length > 0) {
        // 이미 있는 채팅 룸에 참가자 추가
        const existingChatRoom = existingChatRooms.docs[0];
        const chatRoomId = existingChatRoom.id;
        const participants = existingChatRoom.data().participants || [];
        if (!participants.includes(currentUserUID)) {
          participants.push(currentUserUID);
          // 참가자 목록을 업데이트
          await updateDoc(doc(chatRoomRef, chatRoomId), { participants });
        }
        navigation.navigate('chat', { chatRoomId, postId: postId.toString() });
      } else {
        // 채팅 룸이 존재하지 않는 경우, 새로운 채팅 룸 생성 및 사용자 추가
        const newChatRoom = {
          postId: postId.toString(),
          participants: [currentUserUID], // 현재 사용자를 첫 번째 참가자로 추가
          createdAt: serverTimestamp(),
        };
        const newChatRoomRef = await addDoc(chatRoomRef, newChatRoom);
        const newChatRoomId = newChatRoomRef.id;
        navigation.navigate('chat', { chatRoomId: newChatRoomId, postId: postId.toString() });
      }
    } catch (error) {
      console.error('Firestore 오류:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.graycontainer}>
        <Text style={styles.homeText}>같이 가요</Text>
        {/* 게시물 정보를 렌더링하는 나머지 부분 */}
        {postData && (
          <>
            <Text style={styles.TextTransportation}>우리 <Text style={styles.TransportationStyle}>{postData.transportation}</Text>
            {postData.transportation === '카풀' && (
              <Text style={styles.TextDriveInfo}>({postData.driveInfo})</Text>
            )}
            {' '}로 같이 가요!</Text>
            
            <Text style={styles.departureText}><Text style={styles.TransportationStyle}>{postData.departure}</Text>에서 출발해요!</Text>
            <Text style={styles.departureText}><Text style={styles.TransportationStyle}>{postData.destination}</Text>으로 같이 가요!</Text>
            <Text style={styles.timeText}>{formatTimeFromTimestamp(postData.selectedTime)}에 출발해요!</Text>
            <Text style={styles.participantsText}>
              참가자 수: {chatRoomSnapshot && chatRoomSnapshot.docs.length > 0 ? chatRoomSnapshot.docs[0].data().participants.length : 0}
            </Text>



            {currentUserUID === authorUID && (
              <TouchableOpacity onPress={handleDelete}>
                <AntDesign name="delete" size={35} color="black" style={{left: 270, marginTop: 50}}/>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleChatButtonClick} style={styles.Gobutton}>
                <Text style={styles.buttonText}>채팅참가</Text>
              </TouchableOpacity>
              
          </>
        )}
        {!postData && (
        <Text style={styles.loadingText}>게시물을 로드하는 중입니다...</Text>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graycontainer: {
    height: '95%',
    width: '90%',
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
  },
  homeText: { //아래와 같은 정보가 맞나요? 부분의 텍스트
    fontSize: 30,
    textAlign: "center",
    fontWeight: 'bold',
    marginTop: 50,
    color: '#146C94',
  },
  TextTransportation: {
    textAlign: "center",
    fontSize: 25,
    marginTop: "10%",
    fontWeight: 'bold',
  },
  TextDriveInfo: {
    textAlign: "center",
    fontSize: 20,
    marginTop: "10%",
  },
  departureText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: "center",
  },
  timeText: {
    marginTop: 20, 
    textAlign: "center",
    fontSize: 25,
    fontWeight: 'bold',
  },
  deletebutton: {
    borderRadius: 20,
    backgroundColor: '#AFD3E2',
    padding: 15,
    marginTop: "20%",
    width: 70,
    marginLeft: 250,
  },
  Gobutton: {
    borderRadius: 20,
    backgroundColor: '#AFD3E2',
    padding: 15,
    marginTop: 10,
    width: 100,
    left: 120,
    alignItems: 'center',
  },
  buttonText: {
    textAlign: "center",
    fontWeight: 'bold',
  },
  TransportationStyle: {
    fontSize: 25,
    color: '#146C94',
    fontWeight: 'bold',
  },
  participantsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: "center",
  }
});

export default PostDetailScreen;