import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Link, useNavigation } from "expo-router";
import { Appbar, Card, Text, Button, useTheme, Divider, Portal, Modal as RNPModal } from "react-native-paper";
import PrimaryTextInput from "../../components/primaryTextInput";
import { AuthStore, appDeleteExpense, appUpdateExpense } from "../../../store";
import { useStoreState } from "pullstate";

export default function Modal() {
  const expenses = useStoreState(AuthStore, (s) => s.expenses);
  const categories = useStoreState(AuthStore, (s) => s.categories);
  const navigation = useNavigation();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [EditExpenseModalVisible, setEditExpenseModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");

  const [currentExpenseId, setCurrentExpenseId] = useState("");
  const [currentExpenseTitle, setCurrentExpenseTitle] = useState("");
  const [currentExpenseDescription, setCurrentExpenseDescription] = useState("");
  const [currentExpenseAmount, setCurrentExpenseAmount] = useState("");
  const [currentExpenseDate, setCurrentExpenseDate] = useState("");
  const [currentExpenseCategory, setCurrentExpenseCategory] = useState("");

  const showEditExpenseModal = () => setEditExpenseModalVisible(true);
  const hideEditExpenseModal = () => setEditExpenseModalVisible(false);


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
    modalContainer: {
      backgroundColor: 
      theme.colors.background, 
      borderRadius:10, 
      marginHorizontal:10, 
    },
    modalEntries: {
      width: "90%",
      marginBottom: 16,
    },
    modalForm: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20
    },
    cancelButton: {
      marginTop: 16,
      backgroundColor: theme.colors.error
    }
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
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpenExpenseEditor = (expenseId) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
      setCurrentExpenseId(expenseId);
      setCurrentExpenseTitle(expense.title);
      setCurrentExpenseDescription(expense.description);
      setCurrentExpenseAmount(expense.amount.toString());
      setCurrentExpenseDate(expense.date);
      setCurrentExpenseCategory(expense.category);
      setEditExpenseModalVisible(true);
    }
  };

  const handleUpdateExpense = async () => {
    const updatedExpense = {
      title: currentExpenseTitle,
      description: currentExpenseDescription,
      amount: parseFloat(currentExpenseAmount), // Convert to number if needed
      date: currentExpenseDate,
      category: currentExpenseCategory
    };
    console.log("Expense to update frontend: ", updatedExpense);
  
    try {
      const success = await appUpdateExpense(currentExpenseId, updatedExpense);
      if (success) {
        const newData = data.map(item => {
          if (item.id === currentExpenseId) {
            return { ...item, ...updatedExpense };
          }
          return item;
        });
        setData(newData);
        setEditExpenseModalVisible(false);
      }
    } catch (error) {
      console.log(error.message);
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
            icon="pencil"
            onPress={() => handleOpenExpenseEditor(item.id)}
            {...props}
          />
        )}
      />
      <Card.Content >
        <Text style={styles.cardText}>
          Amount: ${item.amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <Text style={styles.cardText}>
          Category: {fetchCategory(item?.category)}
        </Text>
        <Button 
          icon="delete" 
          style={{position: "absolute", right:0, bottom: 10}}
          textColor={theme.colors.error}
          onPress={() => handleDeleteExpense(item.id)}  
        />
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
      <Portal>
        <RNPModal style={{backgroundColor:theme.colors.backdrop}} visible={EditExpenseModalVisible} onDismiss={hideEditExpenseModal} contentContainerStyle={styles.modalContainer}>
            <View style={styles.modalForm}>
                <PrimaryTextInput
                    label="Expense Title"
                    value={currentExpenseTitle}
                    onChangeText={setCurrentExpenseTitle}
                    style={styles.modalEntries}
                />
                <PrimaryTextInput
                    label="Expense Description"
                    value={currentExpenseDescription}
                    onChangeText={setCurrentExpenseDescription}
                    style={styles.modalEntries}
                />
                <PrimaryTextInput
                    label="Expense Amount"
                    value={currentExpenseAmount}
                    onChangeText={setCurrentExpenseAmount}
                    style={styles.modalEntries}
                />
                <PrimaryTextInput
                    label="Expense Date"
                    value={currentExpenseDate}
                    onChangeText={setCurrentExpenseDate}
                    style={styles.modalEntries}
                />
                <PrimaryTextInput
                    label="Expense Category"
                    value={currentExpenseCategory}
                    onChangeText={setCurrentExpenseCategory}
                    style={styles.modalEntries}
                />
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => handleUpdateExpense()}
                >
                    Update Expense
                </Button>
                <Button
                    mode="contained"
                    style={styles.cancelButton}
                    onPress={() => hideEditExpenseModal()}
                >
                    Cancel
                </Button>
            </View>
        </RNPModal>
      </Portal>
    </View>
  );
}
