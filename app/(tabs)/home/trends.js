import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Appbar, Text, useTheme, Card, IconButton, Modal, Button, Portal } from "react-native-paper";
import { useStoreState } from "pullstate";
import { AuthStore } from "../../../store";
import { Timestamp } from "firebase/firestore";
import { VictoryPie, VictoryContainer } from "victory-native";
import format from '@testing-library/react-native/build/helpers/format';
import { SelectList } from 'react-native-dropdown-select-list';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function TrendsScreen() {
  const theme = useTheme();
  const expenses = useStoreState(AuthStore, (s) => s.expenses);
  const categories = useStoreState(AuthStore, (s) => s.categories);
  const screenWidth = Dimensions.get("window").width;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // getMonth() returns 0-11
  const currentYear = currentDate.getFullYear();

  const [selectedSlice, setSelectedSlice] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [pickerVisible, setPickerVisible] = useState(false);

  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = expense.date.toDate(); // Convert Firestore Timestamp to JS Date
    const expenseMonth = expenseDate.getMonth();
    const expenseYear = expenseDate.getFullYear();

    return expenseMonth === currentMonth && expenseYear === currentYear;
  });

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = expense.date.toDate();
    const expenseMonth = expenseDate.getMonth();
    const expenseYear = expenseDate.getFullYear();

    return expenseMonth === selectedMonth && expenseYear === selectedYear;
  });

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
      marginTop: 5,
      backgroundColor: theme.colors.surface,
      fontFamily: 'Montserrat_400Regular',
      width: "100%",
      alignContent: "center",
    },
    pickerStyle: {
      height: 50,
      width: "80%",
      color: theme.colors.onPrimaryContainer,
      fontFamily: 'Montserrat_400Regular',
    },
    pickerButton: {
      backgroundColor: theme.colors.primary,
      fontFamily: 'Montserrat_400Regular',
      width: "40%",
      margin: 10,
    }
  });

  const expensesByCategory = {};

  filteredExpenses.forEach(expense => {
    const category = categories.find(cat => cat.id === expense.category);
    if (!category) {
      // console.warn("Category not found for expense:", expense);
      return;
    }

    const categoryName = category.name;
    const expenseAmount = parseFloat(expense.amount); // Ensure it's a number

    if (!expensesByCategory[categoryName]) {
      expensesByCategory[categoryName] = 0;
    }

    expensesByCategory[categoryName] += expenseAmount;
  });

  const colors = [theme.colors.primary, theme.colors.errorContainer, theme.colors.tertiary, theme.colors.onPrimary, theme.colors.error, theme.colors.onError, theme.colors.onBackground, "#800080", "#008000", "#000080"];

  //format currency to handle commas and decimals
  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }


  const chartData = Object.keys(expensesByCategory).map((category, index) => ({
    x: category,
    y: expensesByCategory[category],
    color: colors[index % colors.length],
    ratio: expensesByCategory[category] / filteredExpenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0),
  }));

  const months = [
    { value: "January", key: 0 },
    { value: "February", key: 1 },
    { value: "March", key: 2 },
    { value: "April", key: 3 },
    { value: "May", key: 4 },
    { value: "June", key: 5 },
    { value: "July", key: 6 },
    { value: "August", key: 7 },
    { value: "September", key: 8 },
    { value: "October", key: 9 },
    { value: "November", key: 10 },
    { value: "December", key: 11 },
  ]

  const pickerYears = Array.from({ length: 17 }, (_, index) => currentYear - 15 + index);

  return (
    <View style={{ flex: 1 }}>
      <Portal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={pickerVisible}
          onDismiss={() => setPickerVisible(false)}


        >

          <View style={{ margin: 20, paddingBottom: 20, paddingTop: 10, backgroundColor: theme.colors.primaryContainer, borderRadius: 10, padding: 0, alignItems: 'center' }}>
            <Picker
              selectedValue={selectedMonth}
              style={styles.pickerStyle}
              dropdownIconColor={theme.colors.onPrimaryContainer}
              onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}
            >
              {months.map(month => (
                <Picker.Item key={month.key} label={month.value} value={month.key} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedYear}
              style={styles.pickerStyle}
              dropdownIconColor={theme.colors.onPrimaryContainer}
              selectionColor={theme.colors.onPrimaryContainer}
              onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
            >
              {pickerYears.map(year => (
                <Picker.Item key={year} label={`${year}`} value={year} />
              ))}
            </Picker>
            <Button
              onPress={() => setPickerVisible(false)}
              style={styles.pickerButton}
            >
              <Text style={{ color: theme.colors.onPrimary, fontFamily: "Montserrat_700Bold" }}>Done</Text>
            </Button>
          </View>

        </Modal>
      </Portal>
      <Appbar.Header style={styles.header} >
        <Appbar.Content titleStyle={styles.headerContent} title="Trends" />
      </Appbar.Header>

      <Card style={styles.card}>
        <View>
          <Card.Title
            title={`${months.find(month => month.key === selectedMonth).value} ${selectedYear} Expenses`}
            subtitle={`Total: ${formatCurrency(filteredExpenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0))}`}
            titleStyle={{ textAlign: "left", fontSize: 16, fontFamily: "Montserrat_400Regular", width: "100%" }}
            subtitleStyle={{ textAlign: "left" }}
            right={(props) => <IconButton {...props} icon="menu-down" onPress={() => setPickerVisible(true)} />}
            rightStyle={{ right: "100%" }}
          />
        </View>

        <VictoryPie
          data={chartData}
          colorScale={colors}
          containerComponent={<VictoryContainer responsive={true} />}
          style={{
            data: {
              fill: ({ datum }) => {
                if (selectedSlice === null || datum.x === selectedSlice) {
                  return datum.color;
                }
                return "gray"; // Color for non-selected slices
              },
              stroke: theme.colors.surface,
              strokeWidth: 5,
            },
            labels: {
              fill: ({ datum }) => selectedSlice === null || datum.x === selectedSlice ? "white" : "gray",
              fontSize: 12,
            }
          }}
          events={[{
            target: "data",
            eventHandlers: {
              onPressIn: () => {
                return [
                  {
                    mutation: (props) => {
                      const slice = props.datum.x;
                      setSelectedSlice(slice === selectedSlice ? null : slice);
                      return {};
                    }
                  }
                ];
              }
            }
          }]}
          height={screenWidth / 1.2}
          labels={({ datum }) => {
            const minSize = .01;
            if (datum.ratio > minSize) {
              return `${datum.x}\n${formatCurrency(datum.y)}`
            }
            return
          }}
          innerRadius={screenWidth / 7}

        />
      </Card>

    </View >
  );
}
