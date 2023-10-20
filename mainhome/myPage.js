import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Button, Image, TextInput } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../firebaseConfig';
import { decode } from 'base-64';
import { AntDesign } from '@expo/vector-icons';

export default function MyPage() {
  const navigation = useNavigation();
  const auth = getAuth();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userNickname, setUserNickname] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [editingNickname, setEditingNickname] = useState(false); // 닉네임 수정 모드 추가
  const [newNickname, setNewNickname] = useState(""); // 새로운 닉네임을 저장할 상태 변수 추가

  const db = getFirestore(app);
  const storage = getStorage(app);

  if (typeof atob === 'undefined') {
    global.atob = decode;
  }

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

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef)
        .then((userDocSnap) => {
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const imageUrl = userData.profileImage;
            setImage(imageUrl);
          }
        })
        .catch((error) => {
          console.error("Firestore에서 이미지 URL을 가져오는 동안 오류 발생:", error);
        });
    }
  }, []);

  const pickImage = async () => {
    setIsLoading(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }

    setIsLoading(false);
  };

  const uploadImage = async (imageUri) => {
    const user = auth.currentUser;

    if (user) {
      const imageName = `profile_image_${user.uid}.jpg`;
      const storageRef = ref(storage, `images/${userNickname}/${imageName}`);

      try {
        const imageBlob = await fetch(imageUri).then((response) => response.blob());
        await uploadBytes(storageRef, imageBlob);

        const imageUrl = await getDownloadURL(storageRef);

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { profileImage: imageUrl }, { merge: true });

        setDownloadURL(imageUrl);
      } catch (error) {
        console.error("이미지 업로드 중 오류 발생:", error);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("SignIn", { screen: "SignIn" });
        console.log("로그아웃 성공");
      })
      .catch((error) => {
        console.error("로그아웃 오류", error);
      });
  };

  const handleNicknameEdit = () => {
    setEditingNickname(true);
  };

  const handleNicknameSave = async () => {
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);

      try {
        await setDoc(userDocRef, { username: newNickname }, { merge: true });
        setUserNickname(newNickname); // 화면에 업데이트된 닉네임 표시
        setEditingNickname(false); // 수정 모드 종료
      } catch (error) {
        console.error("닉네임 업데이트 중 오류 발생:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.graycontainer}>
        <View style={styles.alignItems}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <View style={styles.defaultProfileIcon}>
                <AntDesign name="user" size={60} color="black" />
              </View>
            )}
          </TouchableOpacity>
          
          {editingNickname ? (
            <View style={styles.alignItemedit}>
              <TextInput
                placeholder="닉네임 수정"
                onChangeText={(text) => setNewNickname(text)}
                value={newNickname}
                style={styles.input}
              />
              <Pressable onPress={handleNicknameSave} style={{left: 25, marginTop: 18,}}>
                <Text style={styles.savebuttonText}>저장</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.alignItemedit}>
              <Text style={styles.userNicknameText}><Text style={{ fontWeight: 'bold' }}>{userNickname}</Text>님</Text>
              <Pressable onPress={handleNicknameEdit}>
                <AntDesign name="edit" size={20} color="black" style={{left: 20, marginTop: 8,}}/>
              </Pressable>
            </View>
          )}
        </View>

        

        <Pressable onPress={handleLogout} style={styles.nextButton}>
          <Text style={styles.logoutbuttonText}>로그아웃</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
  },
  graycontainer: {
    height: '95%',
    width: '90%',
    backgroundColor: '#EEEEEE',
    borderRadius: 15,
  },
  alignItems: {
    flexDirection: 'row', // 버튼을 가로로 정렬하기 위해
    alignItems: 'center',
    left: 40, // 아이콘을 오른쪽으로 조정
    marginTop: 15,
  },
  userNicknameText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    left: 15, // 아이콘을 오른쪽으로 조정
  },
  defaultProfileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#afafaf", // 원하는 색상으로 변경 가능
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#146C94",
    padding: 10,
    marginTop: 500, //이거 수정하고
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
  logoutbuttonText: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
  savebuttonText: {
    fontSize: 15,
    color: "black",
    textAlign: "center",
    fontWeight: 'bold',
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
    width: 80,
    height: 80,
    marginTop: 15,
    alignSelf: "center",
    borderRadius: 40,
  },
  downloadURLText: {
    fontSize: 15,
    color: "blue",
    textAlign: "center",
    marginTop: 10,
  },
  alignItemedit: {
    flexDirection: 'row', // 버튼을 가로로 정렬하기 위해
  },
  input: {
    backgroundColor: "#fff",
    height: 35,
    width: 130,
    marginTop: 10,
    left: 15, // 아이콘을 오른쪽으로 조정
    borderRadius: 5,
    padding: 5,
  },
  icon: {
    marginRight: 10, // 원하는 간격으로 조절
  },
});
