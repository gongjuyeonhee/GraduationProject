import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  db,
  doc,
  getDoc,
} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; // Firebase Storage 관련 함수를 import합니다.
import app from '../firebaseConfig';

export default function Home() {
  const navigation = useNavigation();
  
  return (
    <View style={Styles.container}>
      <Pressable onPress={() => navigation.navigate("WithGo",{screen:'WithGo'})} style={Btn.NextBottom}>
        <View style={Btn.iconContainer}>
          <FontAwesome name="car" size={30} color='#146C94' />
          <Text style={Btn.BottomText}>같이 가요</Text>
        </View>
      </Pressable>

     
    </View>
  );
}

// 나머지 스타일 및 컴포넌트 정의는 그대로 사용합니다.
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white', 
  },
})

const Btn = StyleSheet.create({
  NextBottom: {
    //버튼(상자)에 관한 스타일
    backgroundColor: '#F6F1F1',
    padding: 20,
    marginTop: "25%",
    width: "80%",
    height: "20%",
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
    marginBottom: 100,
  },
  iconContainer: {
    //아이콘과 글자 배열에 관한 스타일
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: "12%",
  },
  selectedImage: {
    width: 80,
    height: 80,
    marginTop: 15,
    alignSelf: "center",
    borderRadius: 40,
  },
})
