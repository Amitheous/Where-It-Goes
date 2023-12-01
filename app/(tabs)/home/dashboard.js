import { View, StyleSheet } from "react-native"; // Import Button component
import { useNavigation } from "expo-router";
import { Appbar, useTheme, Card, Text, Button } from "react-native-paper";
import PrimaryButton from "../../components/primaryButton";
import { AuthStore } from "../../../store";
import { useStoreState } from "pullstate";

export default function DashboardScreen() {
  const expenses = useStoreState(AuthStore, s => s.expenses);
  const categories = useStoreState(AuthStore, s => s.categories);
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.colors.secondaryContainer
    },
    headerContent: {
      color: theme.colors.secondary
    },
    card: {
      backgroundColor: theme.colors.tertiaryContainer,
      fontFamily: 'Montserrat_400Regular',
    },
    cardText: {
      color: theme.colors.onTertiaryContainer,
      fontFamily: 'Montserrat_400Regular',
    }
  });

  const fetchCategory = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'No Category'
  }

  // Add a function to handle the button press and navigate to the modal
  const handleViewExpenseHistory = () => {
    navigation.navigate("ExpenseHistoryModal");
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.header} >
        <Appbar.Content title="Dashboard"/>
      </Appbar.Header>
        <Card>
          <PrimaryButton buttonStyle={{width: "100%"}}text="View Expense History"  onPress={handleViewExpenseHistory}  />
        </Card>
    </View>
  );
}