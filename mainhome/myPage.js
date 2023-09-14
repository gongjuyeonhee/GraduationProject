import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Button, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";

export default function MyPage() {
  const navigation = useNavigation();
  const auth = getAuth();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // 초기화면으로 이동
        navigation.navigate("SignIn",{screen:'SignIn'});
        console.log("로그아웃 성공");
      })
      .catch((error) => {
        console.error("로그아웃 오류", error);
      });
  };

  const pickImage = async () => {
    setIsLoading(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.homeText}>마이페이지</Text>
      <Pressable
        onPress={handleLogout} // 로그아웃 버튼을 누르면 handleLogout 함수 호출
        style={styles.nextButton}
      >
        <Text style={styles.buttonText}>로그아웃</Text>
      </Pressable>

      <TouchableOpacity
        onPress={pickImage}
        style={styles.selectImageBtn}
      >
        <Text style={styles.selectImageText}>이미지 선택</Text>
      </TouchableOpacity>

      {isLoading && <Text>Loading...</Text>}
      {image && <Image source={{ uri: image }} style={styles.selectedImage} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  homeText: {
    fontSize: 30,
    textAlign: "center",
    marginTop: "20%",
  },
  nextButton: {
    backgroundColor: "purple",
    padding: 10,
    marginTop: "20%",
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
  selectImageBtn: {
    backgroundColor: "#AFD3E2",
    padding: 15,
    marginTop: 15,
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
  selectImageText: {
    fontSize: 15,
    color: "black",
    textAlign: "center",
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginTop: 15,
    alignSelf: "center",
  },
});
