import { View, Alert, StatusBar } from "react-native";
import React, { useState, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { appSignIn } from "../../store.js";
import PrimaryButton from "../components/primaryButton.js";
import PrimaryTextInput from "../components/primaryTextInput.js";
import { useTheme } from "react-native-paper";


export default function LogIn() {
  const theme= useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSignIn = async () => {
    const result = await appSignIn(email, password);
    if (result.user) {
      router.replace("/(tabs)/home");
    } else {
      // handle error, maybe show an alert or a message
      Alert.alert("Error", result.error.message);
      console.error(result.error);
    }
  }

  const pressCreateAccount = () => {
    router.push("/createAccount");
  }


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen 
        options={{ title: "Login" }} 
      />
      <PrimaryTextInput 
        ref={emailRef}
        label="Email" 
        value={email}
        onChangeText={setEmail}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()}
      />
      <PrimaryTextInput 
        ref={passwordRef}
        label="Password" 
        value={password}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleSignIn}
        onChangeText={setPassword} 
        style={{ marginTop: 5 }}
      />
      <PrimaryButton 
        text="Login"
        buttonIcon="login"
        onPress={handleSignIn}
        style={{ backgroundColor: theme.colors.primary }}
      />
      <PrimaryButton 
        text="Create Account"
        
        onPress={pressCreateAccount}
      />
    </View>
  );
}