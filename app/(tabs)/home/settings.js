import { View, Text, Button, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Appbar, useTheme } from "react-native-paper";
import { auth } from "../../../firebaseConfig";

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.colors.secondaryContainer,
      fontFamily: 'Montserrat_400Regular',
    },
    headerContent: {
      color: theme.colors.onSecondaryContainer,
      fontFamily: 'Montserrat_400Regular',
    },
  });
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/(auth)/login");
    } catch (error) {
      console.log("Logout error: ", error);
    }
  }

  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Button title="Logout" onPress={handleLogout} />
  </View>
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.header} >
        <Appbar.Content titleStyle={styles.headerContent} title="Settings" />
      </Appbar.Header>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}