import { View, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Appbar, Text, useTheme } from "react-native-paper";

export default function TrendsScreen() {
  const theme = useTheme();
  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.colors.primary,
    },
    headerContent: {
      color: theme.colors.secondary,
    },
  });
  
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.header} >
        <Appbar.Content title="Trends"/>
      </Appbar.Header>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Trends Screen</Text>
      </View>
    </View>
  );
}
