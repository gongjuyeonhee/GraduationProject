import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';

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
    marginBottom: 100,
  },
  iconContainer: {
    //아이콘과 글자 배열에 관한 스타일
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})