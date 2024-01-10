import { View, Alert, StatusBar } from "react-native";
import React, { useState, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { appSignIn } from "../../store.js";
import PrimaryButton from "../components/primaryButton.js";
import AuthTextInput from "../components/authTextInput.js";
import { useTheme, Snackbar } from "react-native-paper";
import { auth } from "../../firebaseConfig.js"
import { sendPasswordResetEmail } from "firebase/auth/react-native";
import { set } from "lodash";

export default function LogIn() {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSignIn = async () => {
    try {
      const result = await appSignIn(email, password);
      if (result.user) {
        router.replace("/(tabs)/home");
      } else if (result.error) {
        console.log(result.error.message);
        // Directly handle the error without throwing a new error
        let errorMessage;
        switch (result.error.message) {
          case "Firebase: Error (auth/invalid-email).":
            errorMessage = "Please enter a valid email address";
            break;
          case "Firebase: Error (auth/missing-password).":
            errorMessage = "Please enter password";
            break;
          case "Firebase: Error (auth/invalid-login-credentials).":
            errorMessage = "Invalid login credentials, please try again";
            break;
          default:
            errorMessage = "An unexpected error occurred";
        }

        // Update the snackbar state
        setSnackbarMessage(errorMessage);
        setSnackbarVisible(true);
      }
    } catch (error) {
      // Handle unexpected errors
      setSnackbarMessage("An unexpected error occurred");
      setSnackbarVisible(true);
      console.error(error);
    }
  }



  const handlePasswordReset = async () => {
    try {
      if (!email) {
        throw new Error("Firebase: Error (auth/missing-email).");
      }
      await sendPasswordResetEmail(auth, email);
      setSnackbarMessage("Password reset email sent");
      setSnackbarVisible(true);
    } catch (e) {
      let errorMessage;
      switch (e.message) {
        case "Firebase: Error (auth/missing-email).":
          errorMessage = "Please enter an email address";
          break;
        case "Firebase: Error (auth/invalid-email).":
          errorMessage = "Please enter a valid email address";
          break;
        // Add more cases as needed
        default:
          errorMessage = "An unexpected error occurred";
      }
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
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
      <AuthTextInput
        ref={emailRef}
        label="Email"
        value={email}
        onChangeText={setEmail}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()}
      />
      <AuthTextInput
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
      <PrimaryButton
        text="Reset Password"

        onPress={handlePasswordReset}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => {
            // Optional: Handle 'OK' press
          },
        }}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}