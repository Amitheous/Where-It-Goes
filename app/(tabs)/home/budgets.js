import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "expo-router";
import { Appbar, useTheme, Card, Text, IconButton, Button, Divider, Portal, Modal as RNPModal } from "react-native-paper";
import { SelectList } from "react-native-dropdown-select-list";
import PrimaryTextInput from "../../components/primaryTextInput";
import PrimaryButton from "../../components/primaryButton";
import { StatusBar } from "expo-status-bar";
import { auth } from "../../../firebaseConfig";
import { AuthStore, appDeleteBudget, appUpdateBudget } from "../../../store";
import { useStoreState } from "pullstate";
import { MaterialIcons } from '@expo/vector-icons';

export default function BudgetsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const budgets = useStoreState(AuthStore, (s) => s.budgets);
  const categories = useStoreState(AuthStore, (s) => s.categories);
  const expenses = useStoreState(AuthStore, (s) => s.expenses);


  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [editBudgetModalVisible, setEditBudgetModalVisible] = useState(false);
  const [currentBudgetId, setCurrentBudgetId] = useState(null);
  const [currentBudgetTitle, setCurrentBudgetTitle] = useState("");
  const [currentBudgetAmount, setCurrentBudgetAmount] = useState("");
  const [currentBudgetCategory, setCurrentBudgetCategory] = useState(null);
  const [currentBudgetDate, setCurrentBudgetDate] = useState(null);
  const [currentBudgetDescription, setCurrentBudgetDescription] = useState("");
  const [selectedUpdateCategory, setSelectedUpdateCategory] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);

  const dataForUpdate = [{ value: "Create A New Category", key: "new_category" }, ...categories.map((category) => ({ value: category.name, key: category.id }))];




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
    modalContainer: {
      backgroundColor:
        theme.colors.background,
      borderRadius: 10,
      marginHorizontal: 10,
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
    button: {
      marginTop: 16,
      backgroundColor: theme.colors.primary,
    },
    cancelButton: {
      marginTop: 16,
      backgroundColor: theme.colors.error
    },
    categoryForm: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20
    },
  });

  const formatDate = (date) => {
    // Example format: Jan 1, 2023
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleAddNewBudget = () => {
    navigation.navigate("subScreens/addNewBudgetScreen");
  };

  const hideEditBudgetModal = () => {
    setEditBudgetModalVisible(false);
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

  function formatCurrencyInput(value) {
    let formatted = value.replace(/[^0-9.]/g, '');
    if (formatted.includes('.')) {
      let parts = formatted.split('.');

      if (parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
      }

      formatted = parts[0] + '.' + parts[1];
    }
    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return formatted;
  }


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

  handleOpenBudgetEditor = (budgetId) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (budget) {
      setCurrentBudgetId(budgetId);
      setCurrentBudgetTitle(budget.title);
      setCurrentBudgetDescription(budget.description);
      setCurrentBudgetAmount(budget.amount.toString());
      setCurrentBudgetCategory({ key: budget.category, value: fetchCategory(budget.category) });
      setEditBudgetModalVisible(true);
    }

    const categoryObject = categories.find(cat => cat.id === budget.category);
    if (categoryObject) {
      setCurrentBudgetCategory({ key: categoryObject.id, value: categoryObject.name });
    } else {
      setCurrentBudgetCategory(null);
    }

    setEditBudgetModalVisible(true);
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

  const handleUpdateBudget = async () => {
    try {
      const updatedBudget = {
        title: currentBudgetTitle,
        amount: parseFloat(currentBudgetAmount),
        category: selectedUpdateCategory,
        description: currentBudgetDescription,
      };

      const success = await appUpdateBudget(currentBudgetId, updatedBudget);
      if (success) {
        AuthStore.update((store) => {
          const updatedBudgets = store.budgets.map((budget) => {
            if (budget.id === currentBudgetId) {
              return { ...budget, ...updatedBudget };
            }
            return budget;
          });
          return { ...store, budgets: updatedBudgets };
        });

        setData((prevData) => prevData.map((budget) => {
          if (budget.id === currentBudgetId) {
            return { ...budget, ...updatedBudget };
          }
          return budget;
        }));

        hideEditBudgetModal();
      }
    } catch (error) {
      console.log(error.message);
    }
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
      <Portal>
        <RNPModal style={{ backgroundColor: theme.colors.backdrop }} visible={editBudgetModalVisible} onDismiss={hideEditBudgetModal} contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalForm}>
            <PrimaryTextInput
              label="Budget Title"
              value={currentBudgetTitle}
              onChangeText={setCurrentBudgetTitle}
              style={styles.modalEntries}
            />
            <PrimaryTextInput
              label="Budget Description"
              value={currentBudgetDescription}
              onChangeText={setCurrentBudgetDescription}
              style={styles.modalEntries}
            />
            <PrimaryTextInput
              label="Budget Amount"
              value={"$" + currentBudgetAmount}
              onChangeText={(value) => setCurrentBudgetAmount(formatCurrencyInput(value))}
              style={styles.modalEntries}
              keyboardType="numeric"
            />
            {showDatePicker && (
              <DateTimePicker
                value={currentBudgetDate || new Date()}

                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false); // Hide the picker in both cases
                  if (selectedDate) {
                    setCurrentBudgetDate(selectedDate);
                    setDateChanged(true); // Set the flag when date is changed
                  }
                }}
              />
            )}

            <SelectList
              defaultOption={currentBudgetCategory}
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
              onPress={() => handleUpdateBudget()}
            >
              Update Expense
            </Button>
            <Button
              mode="contained"
              style={styles.cancelButton}
              onPress={() => hideEditBudgetModal()}
            >
              Cancel
            </Button>
          </View>
        </RNPModal>
      </Portal>
    </View>
  );
}