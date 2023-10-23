import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { KeyboardAvoidingView, TextInput, Button, Keyboard, TouchableOpacity, BackHandler, Platform} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import app from "../firebaseConfig";


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
 
  const handleSignin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      console.log("로그인 성공:", user);
      navigation.navigate("Home", { screen: 'Home' });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("로그인 실패:", errorCode, errorMessage);
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
                <Text >  </Text>
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
    width: '70%', 
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
  }
})