import React, { useState, useRef } from 'react';
import { View, Alert, StatusBar } from "react-native";
import { Stack, useRouter } from "expo-router";
import { appSignUp } from "../../store.js";
import PrimaryButton from "../components/primaryButton.js";
import PrimaryTextInput from "../components/primaryTextInput.js";
import { useTheme } from "react-native-paper";

export default function CreateAccount() {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState([]);
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSignUp = async () => {
  
    try {
      const result = await appSignUp(email, password, name);
      if (result.user) {
        router.replace("/(tabs)/home");
      } else {
        console.log(result.error)
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor:theme.colors.background }}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{ title: "Create Account" }}
      />

      <PrimaryTextInput
        ref={emailRef}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={() => nameRef.current && nameRef.current.focus()}
        returnKeyType="next"
      />

      <PrimaryTextInput
        ref={nameRef}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()} 
        returnKeyType="next"
      />

      <PrimaryTextInput
        ref={passwordRef}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleSignUp}
        returnKeyType="done"
      />

      <PrimaryButton 
        text="Sign Up"
        onPress={handleSignUp}
      />

      <PrimaryButton 
        text="Back"
        onPress={() => router.back()}
      />
    </View>
  );
}

