import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Appbar, useTheme } from "react-native-paper";
import React from "react";
import { StyleSheet } from "react-native";

export default function BudgetsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();


  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.colors.secondary
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.header} >
        <Appbar.Content title="Budgets" color={theme.colors.onSecondary} titleStyle={{fontWeight:"600"}}/>
      </Appbar.Header>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Budget Screen</Text>
      </View>
    </View>
  );


}
