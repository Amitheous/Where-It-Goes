import { View, StyleSheet } from "react-native";
import { Link, useNavigation } from "expo-router";
import { Appbar, Card, Text, Button, useTheme, TextInput } from "react-native-paper";
import { AuthStore } from "../../../store";
import { useStoreState } from "pullstate";
import { appAddExpense } from "../../../store";
import { useState } from "react";
import { auth } from "../../../firebaseConfig";

export default function Modal() {
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
        },
        formContainer: {
            padding: 16,
        },
        input: {
            marginBottom: 16,
        },
        button: {
            marginTop: 16,
        },
    });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");

    const handleAddExpense = async () => {
        const expense = {
            title,
            description,
            amount,
            date,
            category,
            userId: auth.currentUser.uid,
        };
        console.log(expense)
        try {
            appAddExpense(expense);
            navigation.goBack();
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={styles.header} >
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="New Expense"/> 
            </Appbar.Header>
            <View style={styles.formContainer}>
                <TextInput
                    label="Title"
                    mode="outlined"
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    label="Description"
                    mode="outlined"
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput
                    label="Amount"
                    mode="outlined"
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                />
                <TextInput
                    label="Date"
                    mode="outlined"
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                />
                <TextInput
                    label="Category"
                    mode="outlined"
                    style={styles.input}
                    value={category}
                    onChangeText={setCategory}
                />
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={handleAddExpense}
                >
                    Add Expense
                </Button>
            </View>
        </View>
    );
}
