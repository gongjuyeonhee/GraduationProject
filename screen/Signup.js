/* 회원가입을 누르면 발생하는 화면 */

import React, { useState } from "react";
import { KeyboardAvoidingView, View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import app from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc, getFirestore } from 'firebase/firestore';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // 닉네임 입력 필드
  
  const handleSignUp = () => {
    const auth = getAuth();
    const db = getFirestore(app);
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      console.log('user created:', user.email);

      const userDocRef = doc(db, 'users', user.uid);
      setDoc(userDocRef, {
        username,
      });

      navigation.navigate("SignIn",{screen:'SignIn'})
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  return (
    <KeyboardAvoidingView style={Styles.pcontainer} behavior="padding">
                  <Text style={Styles.signupText}>5gaso 회원가입</Text>
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
                <TextInput
                  placeholder="Username"
                  value={username}
                  onChangeText={text => setUsername(text)}
                  style={Styles.input}
                />
                
            </View>
            <View style={Styles.alignItems}>
            
            <TouchableOpacity 
              onPress={handleSignUp}
              style={Styles.LoginBtn}>
                  <Text style={Styles.BottomText}>SignUp</Text>
            </TouchableOpacity>
              <View>
                <Text >  </Text>
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
    marginTop: 50, 
    width: "35%",
    alignSelf: "center",
    borderRadius: 25,
  },
  SignupBtn: {
    backgroundColor: '#146C94',
    padding: 15,
    marginTop: 50, 
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
    width: '70%' 
  },
  input: {
    backgroundColor: 'white', 
    paddingHorizontal: 20, 
    paddingVertical: 19, 
    marginTop: 15, 
    borderRadius: 10, 
  },
  alignItems: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signupText: {
    fontSize: 30,
    color: 'black',
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 40,
  }
})