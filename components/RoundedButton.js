import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const RoundedButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.roundedButton, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roundedButton: {
    backgroundColor: 'white',
    padding: 25,
    marginHorizontal: 15, // 버튼 사이 간격
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: '#AFD3E2',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default RoundedButton;
