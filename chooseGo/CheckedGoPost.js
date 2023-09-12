//게시물 생성 페이지에서 만들어진 데이터 확인하는 페이지

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"; // Pressable 제거
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDatabase, ref, push, set } from "firebase/database"; // remove, getAuth 등의 불필요한 import 제거
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebaseConfig";

export default function CheckedGoPost() { //이거 이름 수정하기
  const navigation = useNavigation();
  const route = useRoute();
  const { inputData } = route.params; // 전달받은 데이터를 사용
  console.log(inputData) 
  //console.log(inputData.userUid)

  const [latestPost, setLatestPost] = useState(null);
  const [userUid, setUserUid] = useState(inputData.userUid || "");
  const [driveInfo, setdriveInfo] = useState(inputData.driveInfo || "");
  const [selectedButton, setSelectedButton] = useState(inputData.selectedButton || ""); 
  const [selectedDate, setSelectedDate] = useState(inputData.selectedDate || "");
  const [isPassengerChecked, setPassengerChecked] = useState(inputData.isPassengerChecked || false);
  const [isDriverChecked, setDriverChecked] = useState(inputData.isDriverChecked || false);
  const [selectedDeparture, setSelectedDeparture] = useState(inputData.selectedDeparture || "");//출발장소
  const [selectedDestination, setSelectedDestination] = useState(inputData.selectedDestination || "");//도착장소

  const formatTimeFromTimestamp = (timestamp) => {
    const dateObj = new Date(timestamp);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    let period = '오전';
    if (hours >= 12) {
      period = '오후';
    }
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${period} ${formattedHours}시 ${formattedMinutes}분`;
    return formattedTime;
  };

  

  const handleNext = async () => {
    const db = getDatabase();
    const postsRef = ref(db, 'posts/withGo');
    const newPostRef = push(postsRef);
    
    
    const newData = {
      userId: userUid,
      postId: newPostRef.key,
      transportation: selectedButton, // 수정된 부분: inputData.selectedButton 대신 selectedButton 사용
      selectedTime: selectedDate,
      departure: selectedDeparture,
      destination: selectedDestination,
      driveInfo: driveInfo,
      createdAt: Date.now(),
      // ... 나머지 데이터 저장
    };

    console.log(newData);

  
  await set(newPostRef, newData)
    .then(() => {
      console.log("데이터가 성공적으로 쓰여졌습니다.");
      navigation.navigate('WithGo');
    })
    .catch(error => {
      console.error("데이터 쓰기 중 오류가 발생했습니다:", error.message);
      console.error("오류 스택 트레이스:", error.stack);
      // 오류를 처리하는 코드 추가
    });
  };
  
    const handlePrevious = async () => { //이전 버튼을 누를 경우????????????????????????????????????????????????????????????????????????????????????????
      navigation.goBack(); // 뒤로 가기 동작 실행
      //navigation.navigate('GoCreatePost');        
    };    
  
    return (
      <View style={styles.container}>
        <View style={styles.graycontainer}>
          <Text style={styles.homeText}>아래와 같은 정보가 맞나요?</Text>
          
          {/* 가져온 데이터 나타내기*/}
          {inputData && (
            <View>
              <Text style={styles.dataText}>{inputData.selectedButton}로 가요. </Text>
              {inputData.selectedButton === '카풀' && (
                <>
                  <View style={styles.separator}/>
                  <Text style={styles.dataText}>{inputData.driveInfo} 입니다.</Text>
                </>
              )}
              <View style={styles.separator}/>
              <Text style={styles.dataText}>{formatTimeFromTimestamp(inputData.selectedDate)}에 출발해요.</Text>
              <View style={styles.separator}/>
              <Text style={styles.dataText}>{inputData.selectedDeparture}에서 출발해요.</Text>
              <View style={styles.separator}/>
              <Text style={styles.dataText}>{inputData.selectedDestination}에 같이 가요!</Text>
              
              {/* ... 나머지 데이터 필드 출력 */}
            </View>
          )}
  
          {/* 이전과 등록 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handlePrevious} style={styles.NextButtom}>
              <Text style={styles.buttonText}>이전</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={styles.NextButtom}>
              <Text style={styles.buttonText}>등록</Text>
            </TouchableOpacity>    
          </View>
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
    marginTop: "20%",
  },
  dataText: { //데이터들의 텍스트
    fontSize: 20,
    textAlign: "center",
    fontWeight: 'bold',
    marginTop: "10%",
  },
  NextBottom: {
    backgroundColor: "purple",
    padding: 10,
    marginTop: "20%",
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
  BottomText: {
    fontSize: 15,
    color: 'white',
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
},
  NextButtom: {
    //버튼(상자)에 관한 스타일
    backgroundColor: '#F6F1F1',
    padding: 15,
    marginTop: "5%",
    width: "30%",
    alignSelf: "center",
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#AFD3E2',
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
    textAlign: "center",
    fontWeight: 'bold',
},
separator: { //구분선에 대한 스타일
  borderBottomWidth: 1, // 하단 테두리 두께
  borderBottomColor: '#CCCCCC', // 테두리 색상
  marginVertical: 10, // 구분선 위아래 여백
  width: '80%', // 가로 넓이 지정
  alignSelf: 'center', // 가운데 정렬
},
})