import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const PrimaryTextInput = forwardRef(({ label, value, onChangeText, secureTextEntry, style, returnKeyType, ...props }, ref) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    input: {
      width: "75%",
      marginTop: 10,
      paddingVertical: 10,
      backgroundColor: theme.colors.backdrop,
      fontFamily: 'Montserrat_400Regular',
      
    }
  });

  return (
    <TextInput
      ref={ref}
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={[styles.input, style]}
      mode="outlined"
      autoCapitalize='none'
      returnKeyType={returnKeyType}
      {...props}
      
    />
  );
});


export default PrimaryTextInput;
