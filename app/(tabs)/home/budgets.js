import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "expo-router";
import { Appbar, useTheme, Card, Text, IconButton } from "react-native-paper";
import PrimaryButton from "../../components/primaryButton";
import { StatusBar } from "expo-status-bar";
import { auth } from "../../../firebaseConfig";
import { AuthStore, appAddBudget } from "../../../store";
import { useStoreState } from "pullstate";

export default function BudgetsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const budgets = useStoreState(AuthStore, (s) => s.budgets);


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

  const handleAddNewBudget = () => {
    navigation.navigate("subScreens/addNewBudgetScreen");
  };

  const loadMoreData = () => {
    const sortedBudgets = budgets
      .slice(0, page * 40)
      .sort((a, b) => b.date.toDate() - a.date.toDate()); // Sort by date, newest first
  
    setData(sortedBudgets);
    setPage(page + 1);
  };
  
  useEffect(() => {
    loadMoreData();
  }, [budgets]);

  const renderBudgetItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        titleVariant="titleMedium"
        title={item.title}
        titleStyle={styles.cardText}
        right={(props) => (
          <Button
            icon="pencil"
            onPress={() => handleOpenBudgetEditor(item.id) }
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
          style={{position: "absolute", right:0, bottom: 10}}
          textColor={theme.colors.error}
          onPress={{}}  
        />
      </Card.Content>
    </Card>
  );

  const renderEmptyCard = () => (
    <Card style={styles.emptyCard}>
      <Card.Content>
        <Text style={styles.emptyText}>You don't have any budgets yet. Click the + button to create your first budget.</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Appbar.Header style={styles.header} >
        <Appbar.Content title="Budgets" titleStyle={styles.headerContent}/>
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
      <IconButton mode="contained-tonal" style={styles.addButton}  icon="plus" iconColor={theme.colors.onPrimary} onPress={handleAddNewBudget} />
    </View>
  );
}