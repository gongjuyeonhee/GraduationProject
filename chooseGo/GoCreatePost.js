//게시물 생성 페이지

import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import RoundedButton from '../components/RoundedButton';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Checkbox from "expo-checkbox";
import SelectDropdown from 'react-native-select-dropdown' //<<--현재 이걸 사용하는 거임
import { getDatabase, ref, set, push } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import app from "../firebaseConfig";

export default function WithChoose() {
    const navigation = useNavigation();
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [isPassengerChecked, setPassengerChecked] = useState(false);
    const [isDriverChecked, setDriverChecked] = useState(false);
    const [userUid, setUserUid] = useState("");
    const [selectedDeparture, setSelectedDeparture] = useState("");
    const [selectedDestination, setSelectedDestination] = useState("");
    const DeparturesData = ["학교", "충주터미널", "충주역", "신촌"]; // 예시 데이터, 실제 데이터로 대체 필요
    const DestinationsData = ["학교", "충주터미널", "충주역", "신촌"]; // 예시 데이터, 실제 데이터로 대체 필요


    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUid(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    
    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker();
    };

    const handleButtonPress = (button) => {
        setSelectedButton(button);
        //카풀을 선택한 경우에만 탑승자와 운전자 체크박스를 활성화 << 고쳐야 함.
        if (button === '카풀') {
        setPassengerChecked(true); // 카풀 선택 시 체크박스가 선택된 상태
        setDriverChecked(false); // 카풀 선택 시 체크박스가 선택되지 않은 상태로 시작하도록 변경
        } else {
        setPassengerChecked(false);
        setDriverChecked(false)
        }
    };

    const handlePassengerCheck = () => {
        setPassengerChecked(true);
        setDriverChecked(false);
    };
    
    const handleDriverCheck = () => {
        setDriverChecked(true);
        setPassengerChecked(false);
    };

    const handlePrevious = () => {
        navigation.navigate('WithChoose');
    };

    const handleNext = () => {

        
        if (
            !selectedButton ||
            !selectedDate ||
            !selectedDeparture ||
            !selectedDestination ||
            (selectedButton === "카풀" && !isPassengerChecked && !isDriverChecked)
        ) {
            Alert.alert("알림", "모든 정보를 입력해주세요.");
            return;
        }
        
        try {

            let driveInfo = '';
    
        if (selectedButton === '카풀') {
            if (isPassengerChecked) {
                driveInfo = '탑승자';
            } else if (isDriverChecked) {
                driveInfo = '운전자';
            }
        }

        const inputData = {
                userUid,
                selectedButton,
                selectedDate: selectedDate.getTime(),
                selectedDeparture,
                selectedDestination,
                driveInfo: driveInfo,
                createdAt: Date.now(),
            };

            console.log(inputData)//inputData확인해보기
            
            navigation.navigate("CheckedGoPost", { inputData });
        } catch (error) {
            console.error("데이터 전달 중 오류가 발생했습니다:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.graycontainer}>
{/*--2번-- */}
                <Text style={styles.homeText}>02. 어떻게 갈까요?</Text>
                <View style={styles.buttonRow}>
                    <RoundedButton
                       title="택시"
                       style={[selectedButton === '택시' && styles.selectedButton]}
                       onPress={() => handleButtonPress("택시")}
                    />
                    <RoundedButton
                       title="카풀"
                       style={[selectedButton === '카풀' && styles.selectedButton]}
                       onPress={() => handleButtonPress("카풀")}
                    />
                </View>
                {selectedButton === '카풀' && (
                    <View style={styles.buttonRow}>
                        <Checkbox
                            style={styles.checkbox}
                            value={isPassengerChecked}
                            onValueChange={handlePassengerCheck}
                        />
                        <Text>탑승자</Text>

                        <Checkbox
                            style={styles.checkbox}
                            value={isDriverChecked}
                            onValueChange={handleDriverCheck}
                        />
                        <Text>운전자</Text>
                    </View>
                )}
{/*--3번-- */}
                <Text style={styles.homeText}>03. 몇시에 갈까요?</Text>
                <TouchableOpacity onPress={showDatePicker} style={styles.TimeButton}>
                <Text style={styles.buttonText}>시간 선택</Text>
                </TouchableOpacity>
                
                <DateTimePickerModal
                date={selectedDate}
                isVisible={datePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                />
                {selectedDate && (
                <Text style={styles.selectedTimeText}>
                    선택한 시간:{" "}
                    {selectedDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                    })}
                </Text>
                )} 
{/*--4번-- */}
                <Text style={styles.homeText}>04. 어디로 갈까요?</Text>
                {/* 어디로 가는 건지에 대해서 드롭다운으로 하려다, 지도로 할려고 했는데.. 일단 한눈에 정보를 보여줘야 하므로 드롭다운으로 하기로 결정함. */}
                <View style={styles.buttonRow}>
                    <Text style={styles.departureText}>출발 장소</Text>
                    <SelectDropdown
                        data={DeparturesData}
                        buttonStyle={{
                            backgroundColor: selectedDeparture ? "#AFD3E2" : "#FFFFFF",
                            borderRadius: 10,
                            borderWidth: 1.5,
                            borderColor: '#AFD3E2',
                        }}
                        dropdownOverlayColor="#00000080" // 배경 색상을 반투명한 검은색으로 설정
                        selectedRowStyle={{
                            backgroundColor: '#AFD3E2', // 선택된 항목의 배경 색상을 노랑으로 설정
                            color: 'white', // 선택된 항목의 글꼴 색상을 흰색으로 설정
                        }}
                        dropdownStyle={{
                            backgroundColor: '#F5F5F5',
                            borderWidth: 1.5,
                            borderColor: '#E0E0E0',
                            borderRadius: 10, // 드롭다운 목록의 테두리를 둥글게 만듦
                        }}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                            setSelectedDeparture(selectedItem); // 출발 장소 선택 시 true로 설정
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}
                    />
                </View>
                <View style={styles.buttonRow}>
                    <Text style={styles.departureText}>도착 장소</Text>
                    <SelectDropdown
                        data={DestinationsData}
                        buttonStyle={{
                            backgroundColor: selectedDestination ? "#AFD3E2" : "#FFFFFF",
                            borderRadius: 10,
                            borderWidth: 1.5,
                            borderColor: '#AFD3E2',
                        }}
                        dropdownOverlayColor="#00000080" // 배경 색상을 반투명한 검은색으로 설정
                        selectedRowStyle={{
                            backgroundColor: '#AFD3E2', // 선택된 항목의 배경 색상을 노랑으로 설정
                            color: 'white', // 선택된 항목의 글꼴 색상을 흰색으로 설정
                        }}
                        dropdownStyle={{
                            backgroundColor: '#F5F5F5',
                            borderWidth: 1.5,
                            borderColor: '#E0E0E0',
                            borderRadius: 10, // 드롭다운 목록의 테두리를 둥글게 만듦
                        }}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                            setSelectedDestination(selectedItem); // 도착 장소 선택 시 true로 설정
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}
                    />
                </View>
{/*--이전,다음 버튼 */}
            <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handlePrevious} style={styles.NextButtom}>
                <Text style={styles.buttonText}>이전</Text>
            </TouchableOpacity>
            {/*이전 삭제하기. 왜냐면 위에 가/티 화살표 있으니까. */}
            <TouchableOpacity
                onPress={handleNext}
                style={[styles.NextButtom, { opacity: selectedButton && selectedDate && selectedDeparture && selectedDestination && (selectedButton !== "카풀" || (isPassengerChecked || isDriverChecked)) ? 1 : 0.5 }]}
                disabled={
                    !selectedButton ||
                    !selectedDate ||
                    !selectedDeparture ||
                    !selectedDestination ||
                    (selectedButton === "카풀" && (!isPassengerChecked && !isDriverChecked))
                }
            >
                <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>

            </View>
        </View>  
    </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    graycontainer: {
        height: '95%',
        width: '90%',
        backgroundColor: '#EEEEEE',
        borderRadius: 20,
      },
    homeText: {
        fontSize: 25,
        textAlign: "center",
        marginTop: 35,
        fontWeight: 'bold',
    },
    nextButton: {
        backgroundColor: '#AFD3E2',
        padding: 25,
        marginTop: 20,
        width: "37%",
        height: "75%",
        alignSelf: "center",
        borderRadius: 50,
    },
    buttonText: {
        fontSize: 20,
        color: 'black',
        textAlign: "center",
        fontWeight: 'bold',
    },
    departureText: { //출발,도착 장소의 글자에 대한 스타일
        fontSize: 20,
        color: 'black',
        textAlign: "center",
        fontWeight: 'bold',
        padding: 15, //드롭 버튼과의 간격을 조절하기 위해
    },
    selectedButton: {
        backgroundColor: "#AFD3E2",
    },
    buttonRow: {
        flexDirection: 'row', // 버튼을 가로로 정렬하기 위해
        alignItems: 'center', // 버튼을 수직 가운데로 정렬하기 위해
        justifyContent: 'center', // 버튼을 수평 가운데로 정렬하기 위해
        marginTop: '4%'
      },
    scrollView: {
        marginHorizontal: 20,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    paragraph: {
        fontSize: 15,
    },
    checkbox: {
        margin: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    dropdownStyle: {
        backgroundColor: '#AFD3E2',
        borderColor: '#AFD3E2',
    },
    dropdownTextStyle: {
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 20,
    },
    selectedTimeText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
        fontWeight: 'bold',
    },
    NextButtom: {
        //버튼(상자)에 관한 스타일
        backgroundColor: '#F6F1F1',
        padding: 15,
        marginTop: "5%",
        width: "30%",
        alignSelf: "center",
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#AFD3E2',
      },
    TimeButton: {
        //버튼(상자)에 관한 스타일
        backgroundColor: '#fff',
        padding: 15,
        marginTop: "10%",
        width: "30%",
        alignSelf: "center",
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#AFD3E2',
      },
    });

  