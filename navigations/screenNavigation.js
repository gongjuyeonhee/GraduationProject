import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { getAuth, signOut } from "firebase/auth";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    db,
  } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage 관련 함수를 import합니다.
import app from '../firebaseConfig';

import Splash from '../screen/Splash'; //스플래시
import Home from '../screen/Home'; //메인 홈
import Detail from '../screen/Details'; //디테일(테스트용)
import SignIn from '../screen/Signin'; //로그인
import SignUp from '../screen/Signup'; //회원가입
import MyPage from '../mainhome/myPage'; //마이페이지
import WithGo from '../mainhome/withGo'; //같이가요
import WithBuy from '../mainhome/withBuy'; //같이사요
import WithWatch from '../mainhome/withWatch'; //같이봐요
import WithChoose from '../mainhome/withChoose'; //pluse button
import Hi from '../Hi';
import GoCreatePost from '../chooseGo/GoCreatePost';//[같이가요]게시물 생성 페이지
import CheckedGoPost from '../chooseGo/CheckedGoPost';
import GoPostDetail from '../chooseGo/GoPostDetail';
import chat from '../chooseGo/chat';


const Stack = createStackNavigator();

function StackScreen() {
    const navigation = useNavigation();
    return (
        <Stack.Navigator> 
            <Stack.Screen initialRouteName="SignIn" name="SignIn" component={SignIn} options={{headerShown: false}}/>
            <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: false}}/>
        
            <Stack.Screen name="Home" component={Home} //메인화면
                options={{
                headerTintColor: 'white', 
                headerStyle: {backgroundColor: '#146C94', height: 100 }, 
                headerTitle: '5gaso', 
                headerTintColor: 'beige',
                headerLeft: null,
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("MyPage", { screen: 'MyPage' })}>
                    <View style={{ marginRight: 20 }}>
                        <FontAwesome name="user" size={30} color="beige" />
                    </View>
                    </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name="WithChoose" component={WithChoose}  //게시물 생성화면
                options={{
                    headerTintColor: 'white', 
                    headerStyle: {backgroundColor: '#146C94', height: 100 },  
                    headerTintColor: 'beige',
                    headerTitleStyle: { display: 'none' }, //화면에서 숨김
                 }}
            />
            
            <Stack.Screen name="MyPage" component={MyPage} //마이페이지 화면
                options={{
                    headerTintColor: 'white', 
                    headerStyle: {backgroundColor: '#146C94', height: 100 },  
                    headerTintColor: 'beige',
                    headerTitle: '마이페이지',
                }}
            />

            <Stack.Screen name="WithGo" component={WithGo}  //같이가요 화면
                options={{
                    headerTintColor: 'white', 
                    headerStyle: {backgroundColor: '#146C94', height: 100 },  
                    headerTintColor: 'beige',
                    headerTitle: '같이 가요',
                    
                }}
            />

            {/* 
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("MyPage", { screen: 'MyPage' })}>
                        <View style={{ marginRight: 20 }}>
                            <FontAwesome name="filter" size={24} color="black" />
                        </View>
                        </TouchableOpacity>
                        ),
                        
                        */}

            <Stack.Screen name="WithBuy" component={WithBuy} //같이시켜요 화면
                options={{
                    headerTintColor: 'white', 
                    headerStyle: {backgroundColor: '#146C94', height: 100 },  
                    headerTintColor: 'beige',
                    headerTitle: '같이 시켜요',
                }}
            />

            <Stack.Screen name="WithWatch" component={WithWatch} //같이봐요 화면
                options={{
                    headerTintColor: 'white', 
                    headerStyle: {backgroundColor: '#146C94', height: 100 },  
                    headerTintColor: 'beige',
                    headerTitle: '같이 봐요',
                }}
            />

            <Stack.Screen name="GoCreatePost" component={GoCreatePost} //같이가요 게시물 생성 화면
                options={{
                    headerTintColor: 'white', 
                    headerStyle: {backgroundColor: '#146C94', height: 100 },  
                    headerTintColor: 'beige',
                    headerTitle: '같이 가요',
                }}
            />

            <Stack.Screen name="CheckedGoPost" component={CheckedGoPost} //같이가요 게시물 데이터 확인 화면
                options={{
                    headerTintColor: 'white', 
                    headerStyle: {backgroundColor: '#146C94', height: 100 },  
                    headerTintColor: 'beige',
                    headerTitle: '같이 봐요',
                }}
            />

            <Stack.Screen name="GoPostDetail" component={GoPostDetail} /*테스트용 화면 */ 
            options={{
                headerTintColor: 'white', 
                headerStyle: {backgroundColor: '#146C94', height: 100 },  
                headerTintColor: 'beige',
                headerTitle: '같이 가요',
            }}
            />
            <Stack.Screen name="chat" component={chat}
            options={{
                headerTintColor: 'white', 
                headerStyle: {backgroundColor: '#146C94', height: 100 },  
                headerTintColor: 'beige',
                headerTitle: '채팅',
            }}
            />

            <Stack.Screen name="Detail" component={Detail} /*테스트용 화면 */ />
        </Stack.Navigator>
    );
}

function Navigation() {
    return (
        <NavigationContainer>
            <StackScreen />
        </NavigationContainer>
    );
}

export default Navigation;