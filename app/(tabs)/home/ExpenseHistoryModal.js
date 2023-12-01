import { View, StyleSheet } from "react-native";
import { Link, useNavigation } from "expo-router";
import { Appbar, Card, Text, Button, useTheme } from "react-native-paper";
import { AuthStore } from "../../../store";
import { useStoreState } from "pullstate";


export default function Modal() {
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
          marginVertical: 5
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
    

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Appbar.Header style={styles.header} >
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Expense History"/> 
        </Appbar.Header>
        <View>
        {expenses.map((expense, index) => (
            <Card key={index} style={styles.card}>
            <Card.Title titleVariant="titleMedium" title={expense.title} titleStyle={styles.cardText} />
            <Card.Content>
                <Text style={styles.cardText}>Amount: ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                <Text style={styles.cardText}>Category:  {fetchCategory(expense?.category)}</Text>
            </Card.Content>
            </Card>
        ))}
        </View>
    </View>
  );
}
