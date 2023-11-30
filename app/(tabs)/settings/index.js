import { Redirect, Stack, useRouter } from "expo-router";
import { Button, Pressable, Text, TouchableOpacity, View } from "react-native";
import { AuthStore } from "../../../store";

const Tab2Index = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings</Text>
    </View>
  );
};
export default Tab2Index;
