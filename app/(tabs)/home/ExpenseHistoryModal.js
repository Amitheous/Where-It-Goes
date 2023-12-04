import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Link, useNavigation } from "expo-router";
import { Appbar, Card, Text, Button, useTheme, Divider } from "react-native-paper";
import { AuthStore, appDeleteExpense } from "../../../store";
import { useStoreState } from "pullstate";

export default function Modal() {
  const expenses = useStoreState(AuthStore, (s) => s.expenses);
  const categories = useStoreState(AuthStore, (s) => s.categories);
  const navigation = useNavigation();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.colors.secondaryContainer,
    },
    headerContent: {
      color: theme.colors.secondary,
    },
    card: {
      backgroundColor: theme.colors.tertiaryContainer,
      fontFamily: "Montserrat_400Regular",
      marginVertical: 1,
    },
    cardText: {
      color: theme.colors.onTertiaryContainer,
      fontFamily: "Montserrat_400Regular",
    },
  });

  const fetchCategory = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "No Category";
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const success = await appDeleteExpense(expenseId);
      if (success) {
        setData(prevData => prevData.filter(item => item.id !== expenseId));
        console.log("Expense deleted successfully");
      }
    } catch (error) {
      console.log(error.message);
      // Show an error message to the user
    }
  };

  const loadMoreData = () => {
    const newData = expenses.slice(0, page * 40);
    setData(newData);
    setPage(page + 1);
  };

  useEffect(() => {
    loadMoreData();
  }, []);


  const renderExpenseItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        titleVariant="titleMedium"
        title={item.title}
        titleStyle={styles.cardText}
        right={(props) => (
          <Button
            icon="delete"
            onPress={() => handleDeleteExpense(item.id)}
            {...props}
          />
        )}
      />
      <Card.Content>
        <Text style={styles.cardText}>
          Amount: ${item.amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <Text style={styles.cardText}>
          Category: {fetchCategory(item?.category)}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Expense History" />
      </Appbar.Header>
      <Divider style={{marginVertical: 1, height: 0}} />
      <FlatList
        data={data}
        renderItem={renderExpenseItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
