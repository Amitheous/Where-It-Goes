import { View, Text, Button } from "react-native";
import { Stack, useRouter } from "expo-router";
import { auth } from "../../../firebaseConfig";

export default function SettingsScreen() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/(auth)/login");
    } catch (error) {
      console.log("Logout error: ", error);
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Logout" onPress={handleLogout}/>
    </View>
  );
}