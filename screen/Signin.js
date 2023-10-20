import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { KeyboardAvoidingView, TextInput, Button, Keyboard, TouchableOpacity, BackHandler, Platform} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import app from "../firebaseConfig";

/*  이게 메인 화면임
-1) 버튼 안 텍스트 글자 볼드 처리
*/


const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  /*
  useEffect(() => {
    const backHandler = Platform.OS === 'android'
      ? BackHandler.addEventListener("hardwareBackPress", () => {
          if (!user) {
            return true; // 로그인 화면에서 뒤로가기 버튼을 막음
          }
          return false;
        })
      : null;

    return () => {
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, [user]);
  */
 
  const handleSignin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      console.log("로그인 성공:", user);
      // 로그인 성공 시 화면 전환
      navigation.navigate("Home", { screen: 'Home' });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("로그인 실패:", errorCode, errorMessage);
    });
  };

  const handleSignout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
        console.log("로그아웃 성공");
      })
      .catch((error) => {
        console.error("로그아웃 실패:", error);
      });
  };

  

  return (
    <KeyboardAvoidingView style={Styles.pcontainer} behavior="padding">
            <View>
              <Text style={Styles.topicText}>5gaso</Text>
            </View>         
            <View style={Styles.inputContainer}>
                <TextInput placeholder="ID" 
                value={email}
                onChangeText={text => setEmail(text)}
                style={Styles.input} />
                <TextInput placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)} 
                style={Styles.input} secureTextEntry />
            </View>
            <View style={Styles.alignItems}>
              <TouchableOpacity 
                onPress={handleSignin}
                style={Styles.LoginBtn}>
                    <Text style={Styles.BottomText}>로그인</Text>
              </TouchableOpacity>
              <View>
                <Text /*어쩔 수 없었다...각 버튼 사이를 떨어뜨려놓으려면..공백 두번 넣은 상태임*/>  </Text>
              </View>
              <Pressable onPress={() => navigation.navigate("SignUp",{screen:'SignUp'})} style={Styles.SignupBtn}>
                  <Text style={Styles.BottomText}>회원가입</Text>
              </Pressable>
            </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
  },
  topicText: {
    marginBottom: 20,
    fontSize: 30,
    fontWeight: 'bold',
  },
  homeText: {
    flex: 1/3,
    fontSize: 30,
    textAlign: "center",
  },
  LoginBtn: {
    backgroundColor: '#AFD3E2',
    padding: 15,
    marginTop: 50, //(원래는 퍼센트 값, 즉 "20%"로 했는데 너무 넓어서 일단은 그냥 숫자로 지정함)
    width: "35%",
    alignSelf: "center",
    borderRadius: 25,
  },
  SignupBtn: {
    backgroundColor: '#146C94',
    padding: 15,
    marginTop: 50, //(원래는 퍼센트 값, 즉 "20%"로 했는데 너무 넓어서 일단은 그냥 숫자로 지정함)
    width: "35%",
    alignSelf: "center",
    borderRadius: 25,
  },
  BottomText: {
    fontSize: 15,
    color: 'black',
    textAlign: "center",
  },
  pcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    width: '70%' //입력 칸의 길이
  },
  input: {
    backgroundColor: 'white', //입력 칸 색상
    paddingHorizontal: 20, //글자 위치 (숫자가 크면, 글자가 오른쪽으로 이동) 
    paddingVertical: 19, // 입력 칸의 수직 넓이 (위아래로 넓어지는 느낌) 
    marginTop: 15, //아이디와 패스워드의 틈
    borderRadius: 10, //모서리 둥글게
  },
  alignItems: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})