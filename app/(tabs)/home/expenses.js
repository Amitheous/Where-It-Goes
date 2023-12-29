import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Link, useNavigation } from "expo-router";
import { Appbar, useTheme, Card, Text, IconButton, Button, Portal, Modal as RNPModal } from "react-native-paper";
import PrimaryButton from "../../components/primaryButton";
import { StatusBar } from "expo-status-bar";
import PrimaryTextInput from "../../components/primaryTextInput";
import { AuthStore, appDeleteExpense, appUpdateExpense, appAddCategory, updateNewExpenses } from "../../../store";
import { useStoreState } from "pullstate";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from "../../../firebaseConfig";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Timestamp } from "firebase/firestore"

export default function ExpensesScreen() {
  const expenses = useStoreState(AuthStore, (s) => s.expenses);
  const categories = useStoreState(AuthStore, (s) => s.categories);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [editExpenseModalVisible, setEditExpenseModalVisible] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState("");
  const [currentExpenseTitle, setCurrentExpenseTitle] = useState("");
  const [currentExpenseDescription, setCurrentExpenseDescription] = useState("");
  const [currentExpenseAmount, setCurrentExpenseAmount] = useState("");
  const [currentExpenseDate, setCurrentExpenseDate] = useState("");
  const [currentExpenseCategory, setCurrentExpenseCategory] = useState("");
  const [currentExpenseCategoryName, setCurrentExpenseCategoryName] = useState("");
  const [selectedUpdateCategory, setSelectedUpdateCategory] = useState("");

  const [newCategoryModalVisible, setNewCategoryModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const showNewCategoryModal = () => setNewCategoryModalVisible(true);
  const hideNewCategoryModal = () => setNewCategoryModalVisible(false);

  const showEditExpenseModal = () => setEditExpenseModalVisible(true);
  const hideEditExpenseModal = () => setEditExpenseModalVisible(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);

  //TODO: Render expense history here, as well as having a welcome card similar to the one existing in the budgets screen to prompt the user to create their first expense
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
  const dataForUpdate = [{ value: "Create A New Category", key: "new_category" }, ...categories.map((category) => ({ value: category.name, key: category.id }))];


  function formatCurrencyInput(value) {
    // Remove all non-digit characters except the decimal point
    let formatted = value.replace(/[^0-9.]/g, '');
    if (formatted.includes('.')) {
      let parts = formatted.split('.');

      if (parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
      }

      formatted = parts[0] + '.' + parts[1];
    }
    // Add commas every 3 digits before the decimal point
    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');



    return formatted;
  }

  function formatCurrencyInput(value) {
    // Remove all non-digit characters except the decimal point
    let formatted = value.replace(/[^0-9.]/g, '');
    if (formatted.includes('.')) {
      let parts = formatted.split('.');

      if (parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
      }

      formatted = parts[0] + '.' + parts[1];
    }
    // Add commas every 3 digits before the decimal point
    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');



    return formatted;
  }

  const handleViewExpenseHistory = () => {
    updateNewExpenses(auth.currentUser);
    navigation.navigate("subScreens/expenseHistoryScreen");
  };

  const loadMoreData = () => {
    const sortedExpenses = expenses
      .slice(0, page * 40)
      .sort((a, b) => b.date.toDate() - a.date.toDate()); // Sort by date, newest first

    setData(sortedExpenses);
    setPage(page + 1);
  };

  useEffect(() => {
    loadMoreData();
  }, [expenses]); // Add expenses as a dependency


  const handleAddNewExpense = () => {
    navigation.navigate("subScreens/addNewExpenseScreen");
  };

  const handleUpdateExpense = async () => {
    const cleanedAmount = parseFloat(currentExpenseAmount.replace(/[^0-9.]/g, '')) || 0.00;
    const updatedExpense = {
      title: currentExpenseTitle,
      description: currentExpenseDescription,
      amount: cleanedAmount, // Convert to number if needed
      date: Timestamp.fromDate(currentExpenseDate),
      category: selectedUpdateCategory,
    };


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

  const handleDeleteExpense = async (expenseId) => {
    try {
      const success = await appDeleteExpense(expenseId);
      if (success) {
        AuthStore.update(s => {
          const updatedExpenses = s.expenses.filter(item => item.id !== expenseId);
          return { ...s, expenses: updatedExpenses };
        });
        setData(prevData => prevData.filter(item => item.id !== expenseId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCreateCategory = async () => {
    const newCategory = {
      name: categoryName,
      description: categoryDescription,
      userId: auth.currentUser.uid, // Assuming you have the user's UID
    };

    try {
      const addedCategory = await appAddCategory(newCategory);
      if (addedCategory && !addedCategory.error) {
        dataForUpdate.push({ value: addedCategory.name, key: addedCategory.id });
        setCategoryName('');
        setCategoryDescription('');
        setCurrentExpenseCategory({ key: addedCategory.id, value: newCategory.name });
        hideNewCategoryModal();

      } else {
        console.log(addedCategory.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const fetchCategory = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "No Category";
  };

  const formatDate = (date) => {
    // Example format: Jan 1, 2023
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };


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
        <Text style={styles.cardText}>Date: {formatDate(item.date.toDate())}</Text>
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
          style={{ position: "absolute", right: 0, bottom: 10 }}
          textColor={theme.colors.error}
          onPress={() => handleDeleteExpense(item.id)}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Appbar.Header style={styles.header} >
        <Appbar.Content title="Expenses" titleStyle={styles.headerContent} />
      </Appbar.Header>
      {/* Add in expense history here */}
      <FlatList
        data={data}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
      />
      <Portal>
        <RNPModal style={{ backgroundColor: theme.colors.backdrop }} visible={editExpenseModalVisible} onDismiss={hideEditExpenseModal} contentContainerStyle={styles.modalContainer}>
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
              value={"$" + currentExpenseAmount}
              onChangeText={(value) => setCurrentExpenseAmount(formatCurrencyInput(value))}
              style={styles.modalEntries}
              keyboardType="numeric"
            />
            <Button
              mode="contained"
              style={{ "marginBottom": 16, width: "85%", backgroundColor: theme.colors.tertiary }}
              onPress={() => setShowDatePicker(true)}
              icon="calendar"
            >
              {dateChanged ? formatDate(currentExpenseDate) : (currentExpenseDate ? formatDate(currentExpenseDate) : "Select Date")}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={currentExpenseDate || new Date()}

                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false); // Hide the picker in both cases
                  if (selectedDate) {
                    setCurrentExpenseDate(selectedDate);
                    setDateChanged(true); // Set the flag when date is changed
                  }
                }}
              />
            )}

            <SelectList
              defaultOption={currentExpenseCategory}
              setSelected={(val) => {
                if (val === "new_category") {
                  showNewCategoryModal(); // Show the modal to create a new category
                } else {
                  setSelectedUpdateCategory(val); // Set the selected category for the expense
                }
              }}
              data={dataForUpdate}
              save="key"
              boxStyles={{ paddingHorizontal: 15, borderRadius: 5, backgroundColor: theme.colors.background, borderColor: theme.colors.outline, height: 48, color: "white", marginBottom: 16, width: "75%" }}
              inputStyles={{ color: theme.colors.onSurfaceVariant, fontSize: 16, width: "100%" }}
              dropdownStyles={{ backgroundColor: theme.colors.background, borderColor: theme.colors.secondaryContainer, color: "white" }}
              dropdownItemStyles={{ backgroundColor: theme.colors.background, borderColor: theme.colors.secondaryContainer, color: "white" }}
              placeholder="Select a category"
              dropdownTextStyles={{ color: theme.colors.onTertiaryContainer }}
              searchPlaceholderTextStyle={{ color: "white" }}
              searchPlaceholder=""
              searchicon={<MaterialIcons name="search" size={20} color={theme.colors.onSecondaryContainer} style={{ marginRight: 5 }} />}
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
      <Portal>
        <RNPModal
          style={{ backgroundColor: theme.colors.backdrop }}
          visible={newCategoryModalVisible}
          onDismiss={hideNewCategoryModal}
          contentContainerStyle={{ backgroundColor: theme.colors.background, borderRadius: 10, marginHorizontal: 10 }}
        >
          <View style={styles.categoryForm}>
            <PrimaryTextInput
              label="Category Title"
              value={categoryName}
              onChangeText={setCategoryName}
              style={{ width: "90%" }}
            />
            <PrimaryTextInput
              label="Category Description"
              value={categoryDescription}
              onChangeText={setCategoryDescription}
              style={{ width: "90%" }}
            />
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleCreateCategory}
            >
              Create Category
            </Button>
          </View>
        </RNPModal>
      </Portal>
      <IconButton mode="contained-tonal" style={styles.addButton} icon="plus" iconColor={theme.colors.onPrimary} onPress={handleAddNewExpense} />
    </View>
  );
}