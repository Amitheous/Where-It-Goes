import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const PrimaryTextInput = forwardRef(({ label, value, onChangeText, secureTextEntry, style, returnKeyType, keyboardType, ...props }, ref) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    input: {
      width: "100%",
      marginVertical: 5,
      fontFamily: 'Montserrat_400Regular',
      height: 48,
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
      dense={true}
      autoCapitalize='none'
      returnKeyType={returnKeyType}
      keyboardType={keyboardType}
      {...props}

      
    />
  );
});


export default PrimaryTextInput;
