import React, { useState } from "react";
import { KeyboardAvoidingView, View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

/* 회원가입을 누르면 발생하는 화면 */

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // 닉네임 입력 필드 추가
  const [profileImage, setProfileImage] = useState(''); // 프로필 사진 입력 필드 추가


  //const navigation = useNavigation();

  const handleSignUp = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      console.log('user created:', user.email);
      navigation.navigate("SignIn",{screen:'SignIn'})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  return (
    <KeyboardAvoidingView style={Styles.pcontainer} behavior="padding">
                  
            <View style={Styles.inputContainer}>
                <TextInput placeholder="email"
                 value={email}
                 onChangeText={text => setEmail(text)}
                 style={Styles.input} />
                <TextInput placeholder="Password"
                 value={password}
                 onChangeText={text => setPassword(text)}
                style={Styles.input} 
                secureTextEntry 
                />
            </View>
            <View style={Styles.alignItems}>
            
            <TouchableOpacity 
              onPress={handleSignUp}
              style={Styles.LoginBtn}>
                  <Text style={Styles.BottomText}>SignUp</Text>
            </TouchableOpacity>
              <View>
                <Text /*어쩔 수 없었다...각 버튼 사이를 떨어뜨려놓으려면..공백 두번 넣은 상태임*/>  </Text>
              </View>
              
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