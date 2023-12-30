import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Appbar, Text, useTheme, Card } from "react-native-paper";
import { useStoreState } from "pullstate";
import { AuthStore } from "../../../store";
import { Timestamp } from "firebase/firestore";
import { VictoryPie, VictoryContainer } from "victory-native";
import format from '@testing-library/react-native/build/helpers/format';


export default function TrendsScreen() {
  const theme = useTheme();
  const expenses = useStoreState(AuthStore, (s) => s.expenses);
  const categories = useStoreState(AuthStore, (s) => s.categories);
  const screenWidth = Dimensions.get("window").width;

  const [selectedSlice, setSelectedSlice] = useState(null)

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // getMonth() returns 0-11
  const currentYear = currentDate.getFullYear();


  //get current month expenses after expenses and categories are loaded
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = expense.date.toDate(); // Convert Firestore Timestamp to JS Date
    const expenseMonth = expenseDate.getMonth();
    const expenseYear = expenseDate.getFullYear();

    return expenseMonth === currentMonth && expenseYear === currentYear;
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
    },
  });

  const expensesByCategory = {};

  currentMonthExpenses.forEach(expense => {
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
    ratio: expensesByCategory[category] / currentMonthExpenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0),
  }));


  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.header} >
        <Appbar.Content titleStyle={styles.headerContent} title="Trends" />
      </Appbar.Header>

      <Card style={styles.card}>
        <Card.Title title="Month to Date Expenses by Category" titleStyle={{ textAlign: "center", fontSize: 18, fontFamily: "Montserrat_400Regular" }} />
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

    </View>
  );
}
