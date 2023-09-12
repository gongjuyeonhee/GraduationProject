import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, BackHandler, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';

/*
  -<미적용 목록>-----------------------------------
  2. 적용한 아이콘/버튼 색상 바꾸기 (현재: 토마토/베이지/화이트 => "세련된/깔끔한 색조합" 으로 )
  3. 아이콘 더 깔끔한 걸로 바꾸기
  4. 배경색상 바꾸기
  5. 위 header 색상 바꾸기
  6. back 버튼 삭제 후, 마이페이지 추가해서 아이콘으로 넣기

  -<적용완료 목록>----------------------------------
  1. 디테일화면 없애기
  3. 같이 가요/같이시켜요/같이봐요 버튼의 위치, 색상
  4. 플러스버튼 아이콘으로 넣기
*/


export default function Home() {
  const navigation = useNavigation();
  
  useEffect(() => {
    const backHandler = Platform.OS === 'android'
      ? BackHandler.addEventListener("hardwareBackPress", () => {
          // 뒤로가기 버튼을 눌렀을 때 화면 전환을 막음
          return true; // 이벤트 처리를 막음
        })
      : navigation.addListener("beforeRemove", (e) => {
          // 뒤로가기 버튼을 눌렀을 때 화면 전환을 막음
          e.preventDefault();
        });

    return () => {
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, []);

  return (
    <View style={Styles.container}>
      <Pressable onPress={() => navigation.navigate("WithGo",{screen:'WithGo'})} style={Btn.NextBottom}>
        <View style={Btn.iconContainer}>
          <FontAwesome name="car" size={30} color='#146C94' />
          <Text style={Btn.BottomText}>같이 가요</Text>
        </View>
      </Pressable>

      {/* 
      <Pressable onPress={() => navigation.navigate("WithBuy",{screen:'WithBuy'})} style={Btn.NextBottom}>
       <View style={Btn.iconContainer}>
          <FontAwesome5 name="cookie-bite" size={30} color='#146C94' /> 
          <Text style={Btn.BottomText}>같이 시켜요</Text>
        </View>
      </Pressable>
      
      <Pressable onPress={() => navigation.navigate("WithWatch",{screen:'WithWatch'})} style={Btn.NextBottom}>
        <View style={Btn.iconContainer}>
          <Ionicons name="tv" size={30} color='#146C94' /> 
          <Text style={Btn.BottomText}>같이 봐요</Text>
        </View>
      </Pressable>
      */}
      
  
      <View style={Btn.Createbtn} /*밑으로 조정 안되서 view넣어서 처리함.*/ ></View> 

      <Pressable onPress={() => navigation.navigate("WithChoose",{screen:'WithChoose'})}>
        <Feather name="plus-circle" size={80} color='#146C94' alignSelf="center"/>
      </Pressable>
      
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white', //일단 색상 바꿈
  },
})

const Btn = StyleSheet.create({
  NextBottom: {
    //버튼(상자)에 관한 스타일
    backgroundColor: '#F6F1F1',
    padding: 20,
    marginTop: "20%",
    width: "80%",
    alignSelf: "center",
    borderRadius: 8,
    borderWidth: 3.5,
    borderColor: '#AFD3E2'
  },
  BottomText: {
    //버튼 안의 글자에 관한 스타일
    fontSize: 25,
    color: '#146C94',
    textAlign: "center",
    fontWeight: 'bold',
  },
  Createbtn: {
    //플러스 버튼 아래로 내리는 거 (중간에 공간을 삽입해서 작동하는 거임)
    marginBottom: 100,
  },
  iconContainer: {
    //아이콘과 글자 배열에 관한 스타일
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})