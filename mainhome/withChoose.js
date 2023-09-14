import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RoundedButton from '../components/RoundedButton';
import { useNavigation } from '@react-navigation/native';


export default function WithChoose() {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null); // 선택한 옵션 상태
  const [selectedButton, setSelectedButton] = useState(null); // 선택한 버튼 상태


  const handleNextButtonPress = () => {
    if (selectedOption !== null) {
      // 선택한 옵션이 있는 경우에만 다음 페이지로 이동
      navigation.navigate(selectedOption);
    } else {
      // 선택한 옵션이 없는 경우에 대한 처리 (메시지 또는 경고 등)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.graycontainer}>
        <Text style={styles.homeText}>01. 무엇을 같이 할까요?</Text>

        <View style={styles.buttonRow}>
          <RoundedButton // '같이 가요' 버튼을 선택한 경우
            title=" 같이 가요" 
            style={[styles.button, selectedButton === '같이가요' && styles.selectedButton]}
            onPress={() => {
              setSelectedOption('GoCreatePost');
              setSelectedButton('같이가요'); }}
          />
          <RoundedButton // '같이 가요' 버튼을 선택한 경우
            title=" 같이 사요" 
            style={[styles.button, selectedButton === '같이사요' && styles.selectedButton]}
            onPress={() => {
              setSelectedOption('GoCreatePost');
              setSelectedButton('같이사요'); }}
          />
        </View>
        <View style={styles.buttonRow}>
          <RoundedButton // '같이 가요' 버튼을 선택한 경우
            title=" 같이 봐요" 
            style={[styles.button, selectedButton === '같이봐요' && styles.selectedButton]}
            onPress={() => {
              setSelectedOption('GoCreatePost');
              setSelectedButton('같이봐요'); }}
          />
          <RoundedButton // '같이 가요' 버튼을 선택한 경우
            title="같이시켜요" 
            style={[styles.button, selectedButton === '같이시켜요' && styles.selectedButton]}
            onPress={() => {
              setSelectedOption('GoCreatePost');
              setSelectedButton('같이시켜요'); }}
          />
        </View>
        
        <View style={styles.nextButtonRow}>
          <RoundedButton title="  다음 >" 
          onPress={handleNextButtonPress}
          style={{ opacity: selectedOption !== null ? 1 : 0.5 }} /*불투명도 조정*/ /> 
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '25%',
  },
  space: {
    height: 20, // 버튼과 뷰 사이의 공간 높이 조절
  },
  buttonRow: {
    flexDirection: 'row', // 버튼을 가로로 정렬하기 위해
    alignItems: 'center', // 버튼을 수직 가운데로 정렬하기 위해
    justifyContent: 'center', // 버튼을 수평 가운데로 정렬하기 위해
    marginTop: '15%'
  },
  nextButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // 오른쪽 정렬
    marginTop: '30%',
  },
  selectedButton: {
    backgroundColor: '#AFD3E2', // 선택한 버튼의 색깔
    // 추가적인 스타일을 적용할 수 있음
  },
});
