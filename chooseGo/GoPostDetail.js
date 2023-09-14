import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formatTimeFromTimestamp } from "../utils/timeUtils";
import { getDatabase, ref, onValue, remove, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";

function PostDetailScreen({ route }) {
  const navigation = useNavigation();
  const { postId } = route.params; // 전달받은 데이터를 사용
  const [postData, setPostData] = useState(null);
  const [authorUID, setAuthorUID] = useState(null); // 작성자 UID 추가
  const auth = getAuth();
  const currentUserUID = auth.currentUser ? auth.currentUser.uid : null;

  // postId를 사용하여 게시물 정보를 가져오고 렌더링합니다.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const postRef = ref(db, `posts/withGo/${postId}`);
      
        // 게시물 데이터를 실시간으로 가져옵니다.
        const listener = onValue(postRef, (snapshot) => {
          const data = snapshot.val();
          setPostData(data);
          setAuthorUID(data ? data.userId : null); // 작성자 UID 설정
          console.log(authorUID);
          //console.log(currentUserUID);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); // fetchData 함수를 호출
  
    // 컴포넌트가 언마운트될 때 데이터베이스 리스너를 정리하려고 off함수를 사용하려 했지만, 오류나서 삭제. 잘 돌아감. 굳~
   
  }, [postId]);

  
  const handlePrevious = async () => {
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
  
  return (
    <View style={styles.container}>
      <View style={styles.graycontainer}>
        {/* <Text>게시물 ID: {postId}</Text>*/}
        <Text style={styles.homeText}>같이 가요</Text>
        {/* 게시물 정보를 렌더링하는 나머지 부분 */}
        {postData && (
          <>
            <Text style={styles.TextTransportation}>{postData.transportation}로 같이 가요!</Text>
            {postData.transportation === '카풀' && (
              <Text style={styles.TextDriveInfo}>{postData.driveInfo}</Text>
            )}
            <Text style={styles.departureText}>{postData.departure}에서 출발해요!</Text>
            <Text style={styles.departureText}>{postData.destination}으로 같이 가요!</Text>
            <Text style={styles.timeText}>{formatTimeFromTimestamp(postData.selectedTime)}에 출발해요~</Text>
            {currentUserUID === authorUID && (
              <TouchableOpacity onPress={handlePrevious}>
                <Text style={styles.buttonText}>삭제</Text>
              </TouchableOpacity>
            )}
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
    fontSize: 25,
    textAlign: "center",
    fontWeight: 'bold',
    marginTop: 50,
  },
  TextTransportation: {
    textAlign: "center",
    fontSize: 20,
    marginTop: "10%",
    fontWeight: 'bold',
  },
  TextDriveInfo: {
    textAlign: "center",
    fontSize: 10,
    marginTop: "10%",
  },
  departureText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: "center",
  },
  timeText: {
    marginTop: 10, 
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PostDetailScreen;
