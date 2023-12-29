import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "expo-router";
import { Appbar, useTheme, Card, Text, IconButton, Button, Divider } from "react-native-paper";
import PrimaryButton from "../../components/primaryButton";
import { StatusBar } from "expo-status-bar";
import { auth } from "../../../firebaseConfig";
import { AuthStore, appDeleteBudget } from "../../../store";
import { useStoreState } from "pullstate";

export default function BudgetsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const budgets = useStoreState(AuthStore, (s) => s.budgets);
  const categories = useStoreState(AuthStore, (s) => s.categories);
  const expenses = useStoreState(AuthStore, (s) => s.expenses);


  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

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
      marginTop: 4
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
    emptyCard: {
      backgroundColor: theme.colors.tertiaryContainer,
      fontFamily: 'Montserrat_400Regular',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      margin: 16,
    },
    emptyText: {
      color: theme.colors.onTertiaryContainer,
      fontFamily: 'Montserrat_400Regular',
      textAlign: 'center',
    },
  });

  const formatDate = (date) => {
    // Example format: Jan 1, 2023
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleAddNewBudget = () => {
    navigation.navigate("subScreens/addNewBudgetScreen");
  };

  const loadMoreData = () => {
    const sortedBudgets = budgets
      .slice(0, page * 40)

    setData(sortedBudgets);
    setPage(page + 1);
  };

  useEffect(() => {
    loadMoreData();
  }, [budgets]);

  // use Effect to update the data when the budgets change
  useEffect(() => {
    const sortedBudgets = budgets
      .slice(0, page * 40)

    setData(sortedBudgets);
  }, [budgets]);

  const getCurrentMonthYear = () => {
    const today = new Date();
    return {
      month: today.getMonth() + 1,
      year: today.getFullYear()
    };
  };

  const calculateRemainingAmount = (budget) => {
    const { month, year } = getCurrentMonthYear();

    const monthlyExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date.seconds * 1000); // Assuming 'date' is a Timestamp
        return expense.category === budget.category
          && expenseDate.getMonth() + 1 === month
          && expenseDate.getFullYear() === year;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return budget.amount - monthlyExpenses;
  };


  const handleDeleteBudget = async (budgetId) => {
    try {
      const success = await appDeleteBudget(budgetId);
      if (success) {
        AuthStore.update(s => {
          const updatedBudgets = s.budgets.filter(item => item.id !== budgetId);
          return { ...s, budgets: updatedBudgets };
        });
        setData(prevData => prevData.filter(item => item.id !== budgetId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const renderBudgetItem = ({ item }) => {
    const remainingAmount = calculateRemainingAmount(item);
    return (

      <Card style={styles.card}>
        <Card.Title
          titleVariant="titleMedium"
          title={item.title}
          titleStyle={styles.cardText}
          right={(props) => (
            <Button
              icon="pencil"
              onPress={() => handleOpenBudgetEditor(item.id)}
              {...props}
            />
          )}
        />

        <Card.Content >
          <Text style={styles.cardText}>Category: {fetchCategory(item.category)}</Text>
          <Text style={styles.cardText}>
            Amount: ${item.amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.cardText}>
            Amount Remaining: ${remainingAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>

          <Button
            icon="delete"
            style={{ position: "absolute", right: 0, bottom: 10 }}
            textColor={theme.colors.error}
            onPress={() => handleDeleteBudget(item.id)}
          />
        </Card.Content>
      </Card>
    )
  };

  const renderEmptyCard = () => (
    <Card style={styles.emptyCard}>
      <Card.Content>
        <Text style={styles.emptyText}>You don't have any budgets yet. Click the + button to create your first budget.</Text>
      </Card.Content>
    </Card>
  );

  const fetchCategory = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "No Category";
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Appbar.Header style={styles.header} >
        <Appbar.Content title="Budgets" titleStyle={styles.headerContent} />
      </Appbar.Header>
      {budgets.length === 0 ? (
        renderEmptyCard()
      ) : (
        <FlatList
          data={data}
          renderItem={renderBudgetItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
        />
      )}
      <IconButton mode="contained-tonal" style={styles.addButton} icon="plus" iconColor={theme.colors.onPrimary} onPress={handleAddNewBudget} />
    </View>
  );
}