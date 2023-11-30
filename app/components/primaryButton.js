import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useTheme, Text } from 'react-native-paper';


const PrimaryButton = ({ text, onPress, buttonStyle, textStyle, buttonIcon }) => {


  const theme = useTheme();
  const styles = StyleSheet.create({
    button: {
      width: '55%',
      height: 50,
      marginTop: 10,
      borderRadius: 25,
      justifyContent: 'center',
      
    },
    text: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontFamily: 'Montserrat_600SemiBold'
    },
  });
  
  return (
    
    <Button
      mode="contained"
      icon={buttonIcon}
      style={[styles.button, buttonStyle]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </Button>
  );
};

export default PrimaryButton;
