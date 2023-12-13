import { View, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { Appbar, useTheme, Card, Text, IconButton } from "react-native-paper";
import PrimaryButton from "../../components/primaryButton";
import { StatusBar } from "expo-status-bar";
import { auth } from "../../../firebaseConfig";
import { updateNewExpenses } from "../../../store";
import { update } from "pullstate";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.colors.secondaryContainer,
      fontFamily: 'Montserrat_400Regular',
    },
    headerContent: {
      color: theme.colors.onSecondaryContainer,
      fontFamily: 'Montserrat_400Regular',
    },
    card: {
      backgroundColor: theme.colors.tertiaryContainer,
      fontFamily: 'Montserrat_400Regular',
    },
    cardText: {
      color: theme.colors.onTertiaryContainer,
      fontFamily: 'Montserrat_400Regular',
    },
    addButton: {
      position: 'absolute',
      bottom: "3%",
      right: "3%",
      backgroundColor: theme.colors.primary,
      borderRadius: 50,
      width: 70,
      height: 70,
    },
  });

  const handleViewExpenseHistory = () => {
    updateNewExpenses(auth.currentUser);
    navigation.navigate("expenseHistoryScreen");
  };

  const handleAddNewExpense = () => {
    navigation.navigate("addNewExpenseScreen");
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Appbar.Header style={styles.header} >
        <Appbar.Content title="Dashboard" titleStyle={styles.headerContent}/>
      </Appbar.Header>
      <Card>
        <PrimaryButton buttonStyle={{width: "100%"}} text="View Expense History" onPress={handleViewExpenseHistory} />
      </Card>
      <IconButton mode="contained-tonal" style={styles.addButton}  icon="plus" iconColor={theme.colors.onPrimary} onPress={handleAddNewExpense} />
    </View>
  );
}