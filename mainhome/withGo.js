//같이가요 피드

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from "react-native";
import { BackHandler } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formatTimeFromTimestamp } from "../utils/timeUtils"; // 이곳에 현재 시간 포맷 함수를 가져온다고 가정
import { getDatabase, ref, onValue } from "firebase/database";
import { MaterialIcons, Feather } from '@expo/vector-icons';
import app from "../firebaseConfig";

export default function WithGo() {
  const navigation = useNavigation();
  const [feedData, setFeedData] = useState([]); // 피드 데이터 배열
  const [scrollY, setScrollY] = useState(0); // 스크롤 Y 위치
  const [isButtonVisible, setIsButtonVisible] = useState(true); // 버튼 표시 여부
  const [selectedButton, setSelectedButton] = useState('all'); // 초기값 'all'
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const postsRef = ref(db, 'posts/withGo');

      onValue(postsRef, (snapshot) => {
        const dataFromDB = snapshot.val();
        if (dataFromDB) {
          const sortedData = Object.entries(dataFromDB)
            .map(([postId, postData]) => ({ postId, ...postData }))
            .sort((a, b) => b.createdAt - a.createdAt);
          setFeedData(sortedData);
        }
      });
    };
    fetchData();
  }, []);

  const filteredData = selectedButton === 'all'
  ? feedData
  : selectedButton === '임박'
  ? feedData
      .filter(item => item.selectedDueDate < Date.now()) // 마감 시간이 현재 시간보다 이전인 항목만 선택
      .sort((a, b) => a.selectedDueDate - b.selectedDueDate) // 마감 시간 오름차순 정렬
  : feedData
      .filter(item => item.transportation === selectedButton)
      .sort((a, b) => b.createdAt - a.createdAt); // 만들어진 순서대로 정렬



  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => {
        // 게시물 선택 시 동작
        navigation.navigate("GoPostDetail", { postId: item.postId });
      }}
    >
    <View style = {styles.alignAll}>
      <View style={styles.postTransportation}>
        <Text style={styles.TextTransportation}>{item.transportation}</Text>
        {item.transportation === '카풀' && (
          <Text style={styles.TextDriveInfo}>{item.driveInfo}</Text>
        )}
      </View>

      {/*출발 장소->도착 장소*/}
      <View style={styles.aligntext}> 
      <View style={styles.iconAndText}>  
        <Text style={styles.departureText}>{item.departure}</Text>
        <MaterialIcons name="arrow-right-alt" size={20} color="black" />
        <Text style={styles.departureText}>{item.destination}</Text>
      </View>

      {/*출발 시간 정렬*/}
      <View style={styles.iconAndText}>
      <MaterialIcons name="schedule" size={15} color="black" />
        <Text style={styles.departureText}>출발 시간: {formatTimeFromTimestamp(item.selectedTime)}</Text>
      </View>

      {/*도착 시간 정렬*/}
      <View style={styles.iconAndText}>
        <MaterialIcons name="schedule" size={15} color="black" />
        <Text style={styles.departureText}>마감 시간: {formatTimeFromTimestamp(item.selectedDueDate)}</Text>
      </View>
    </View>


      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );
  
  const handleButtonPress = (buttonType) => { //버튼을 누를 때 상태 변화
    setSelectedButton(buttonType);
  };
  
  const renderHeader = () => (
    <View style={styles.buttonRow}>
      <TouchableOpacity 
        style={[
          styles.roundedButton,
          selectedButton === '택시' ? styles.selectedButton : null
        ]} 
        onPress={() => handleButtonPress('택시')}>
        <Text style={styles.buttonText}>택시</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.roundedButton,
          selectedButton === '카풀' ? styles.selectedButton : null
        ]}
        onPress={() => handleButtonPress('카풀')}>
      <Text style={styles.buttonText}>카풀</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.roundedButton,
          selectedButton === '임박' ? styles.selectedButton : null
        ]}
        onPress={() => handleButtonPress('임박')}>
        <Text style={styles.buttonText}>임박</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
         data={filteredData}
         renderItem={renderPostItem}
         keyExtractor={(item) => item.postId.toString()}
         style={styles.flatList}
         ListHeaderComponent={renderHeader}
      />

    <TouchableOpacity              
        onPress={() => navigation.navigate("GoCreatePost",{screen:'GoCreatePost'})}
        style={styles.iconContainer}>
        <Feather name="plus-circle" size={60} color='#146C94' alignSelf="center"/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeText: {
    fontSize: 30,
    textAlign: "center",
    marginTop: "10%",
  },
  postItem: {
    marginBottom: 25,
    padding: 10,
    backgroundColor: '#f0f0f0',
    width: '90%',
    height: 80,
    borderRadius: 1,
    alignSelf: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, //ios의 그림자효과
    shadowOpacity: 0.3, //ios
    shadowRadius: 3,//ios
    elevation: 2, // Android에서의 그림자 효과
  },
  nextButton: {
    backgroundColor: "purple",
    padding: 10,
    marginTop: "10%",
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
  postTransportation:{
    height: 60,
    width: '20%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15, // 택시/카풀 영역과 다음 영역 사이의 간격을 조절
    marginLeft: 8,
    borderWidth: 2, // 테두리 두께를 조절 (원하는 크기로 수정)
    borderColor: '#AFD3E2', // 테두리 색상을 조절 (원하는 색상으로 수정)
  },
  TextTransportation: {
    textAlign: "center",
    fontSize: 20,
    marginTop: "30%",
    fontWeight: 'bold',
  },
  TextDriveInfo: {
    textAlign: "center",
    fontSize: 10,
    marginTop: "10%",
  },
  aligntext: {
    //flex: 1/3, // 텍스트를 세로로 가운데 정렬하기 위해
    textAlign: "center",
    //backgroundColor: "#fff",
    //padding: 1,
  },
  alignAll: {
    flexDirection: 'row', // 버튼을 가로로 정렬하기 위해
  },
  iconAndText: {
    flexDirection: 'row', // 가로로 정렬
    alignItems: 'center', // 수직 가운데 정렬
  },
  timeiconAndText: {
    flexDirection: 'row', // 가로로 정렬
    alignItems: 'center', // 수직 가운데 정렬
  },
  departureText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  timeText: {
    marginTop: 5, // 위 여백 추가
  },
  roundedButton: {
    backgroundColor: 'white',
    padding: 14,
    marginHorizontal: 15, // 버튼 사이 간격
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: '#AFD3E2',
    marginBottom: 13,
    marginTop: 10,
    width: 90,
    height: 50,
    marginRight: 1,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  
  buttonRow: {
    flexDirection: 'row', // 버튼을 가로로 정렬하기 위해 
    marginTop: 2,
  },
  selectedButton: {
    backgroundColor: '#AFD3E2', 
    borderColor: '#AFD3E2',
  }, 
  iconContainer: {
    position: 'absolute', // 아이콘 위치를 조정하기 위해 절대 위치로 설정
    bottom: 30, 
    right: 20, 
    backgroundColor: 'transparent', // 배경을 투명하게 설정
  },
  modalContainer: {
    flex: 6/7,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 투명한 배경 색상
    width: "80%",
    marginTop: 130,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%", 
  },
});