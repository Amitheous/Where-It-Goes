import { View, StyleSheet } from "react-native";
import {  useNavigation } from "expo-router";
import { Appbar, Button, useTheme, Portal, Modal as RNPModal } from "react-native-paper";
import PrimaryTextInput from "../../components/primaryTextInput"
import { AuthStore, appAddExpense, appAddCategory } from "../../../store";
import { useStoreState } from "pullstate";
import { useState, useRef } from "react";
import { auth } from "../../../firebaseConfig";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialIcons } from '@expo/vector-icons';

export default function Modal() {
    const categories = useStoreState(AuthStore, (s) => s.categories);
    const navigation = useNavigation();
    const theme = useTheme();
    const styles = StyleSheet.create({
        header: {
            backgroundColor: theme.colors.secondaryContainer
        },
        headerContent: {
            color: theme.colors.secondary
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
        categoryForm: {
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20
        }
    });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [newCategoryModalVisible, setNewCategoryModalVisible] = useState(false);

    const showNewCategoryModal = () => setNewCategoryModalVisible(true);
    const hideNewCategoryModal = () => setNewCategoryModalVisible(false);

    const data = [{ value: "Create A New Category", key: "new_category" }, ...categories.map((category) => ({ value: category.name, key: category.id }))];

    const handleAddExpense = async () => {
        console.log("selectedCateogry: ", selectedCategory)
        const expense = {
            title,
            description,
            amount,
            date,
            category: selectedCategory, // use the ID directly
            userId: auth.currentUser.uid,
        };
        console.log("expense to add: ", expense)
        try {
            appAddExpense(expense);
            navigation.goBack();
        } catch (error) {
        }
    };

    const handleCreateCategory = async () => {
        console.log("data before add: ", data)
        const category = {
            name: categoryName,
            description: categoryDescription,
            userId: auth.currentUser.uid,
        };
        try {
            const newCategory = await appAddCategory(category);
            if (newCategory && !newCategory.error) {
                console.log("newCategory: ", newCategory)
                data.push({ value: categoryName, key: newCategory.id });
                console.log("data after add: ", data)
                hideNewCategoryModal();
                setCategoryName(''); // Reset category name
                setCategoryDescription(''); // Reset category description
            } else {
                console.log(newCategory.error);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    


    const categoryInputRef = useRef();
    const descriptionInputRef = useRef();
    const amountInputRef = useRef();
    const dateInputRef = useRef();
    
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={styles.header} >
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="New Expense"/> 
            </Appbar.Header>
            <View style={styles.formContainer}>
                <PrimaryTextInput
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                    onSubmitEditing={() => descriptionInputRef.current && descriptionInputRef.current.focus()}
                    returnKeyType="next"
                />
                <PrimaryTextInput
                    ref={descriptionInputRef}
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    onSubmitEditing={() => amountInputRef.current && amountInputRef.current.focus()}
                    returnKeyType="next"
                />
                <PrimaryTextInput
                    ref={amountInputRef}
                    label="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    onSubmitEditing={() => dateInputRef.current && dateInputRef.current.focus()}
                    returnKeyType="next"
                />
                <PrimaryTextInput
                    ref={dateInputRef}
                    label="Date"
                    value={date}
                    onChangeText={setDate}
                    onSubmitEditing={() => categoryInputRef.current && categoryInputRef.current.focus()}
                    returnKeyType="next"
                />
                <SelectList 
                    setSelected={(val) => {
                        console.log("val: ", val)
                        if (val === "new_category") {
                            showNewCategoryModal();
                        } else {
                            // Find the corresponding key for the selected value
                            const selectedCategoryKey = val;
                            console.log("selectedCategoryKey: ", selectedCategoryKey);
                            setSelectedCategory(selectedCategoryKey);
                        }
                    }} 
                    data={data} 
                    save="key"
                    boxStyles={{paddingHorizontal:15, borderRadius: 5, backgroundColor: theme.colors.background, borderColor: theme.colors.outline, height: 48, color: "white", marginTop:10}}
                    inputStyles={{color: theme.colors.onSurfaceVariant, fontSize:16 }}
                    dropdownStyles={{backgroundColor: theme.colors.background, borderColor: theme.colors.secondaryContainer, color: "white"}}
                    dropdownItemStyles={{backgroundColor: theme.colors.background, borderColor: theme.colors.secondaryContainer, color: "white"}}
                    placeholder="Select a category"
                    dropdownTextStyles={{color: theme.colors.onTertiaryContainer}}
                    searchPlaceholderTextStyle={{color: "white"}}
                    searchPlaceholder=""
                    searchicon={<MaterialIcons name="search" size={20} color={theme.colors.onSecondaryContainer} style={{marginRight:5}} />}
                />

                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={handleAddExpense}
                >
                    Add Expense
                </Button>
            </View>
            <Portal>
                <RNPModal style={{backgroundColor:theme.colors.backdrop}} visible={newCategoryModalVisible} onDismiss={hideNewCategoryModal} contentContainerStyle={{backgroundColor: theme.colors.background, borderRadius:10, marginHorizontal:10 }}>
                    <View style={styles.categoryForm}>
                        <PrimaryTextInput
                            label="Category Title"
                            value={categoryName}
                            onChangeText={setCategoryName}
                            style={{width:"90%"}}
                        />
                        <PrimaryTextInput
                            label="Category Description"
                            value={categoryDescription}
                            onChangeText={setCategoryDescription}
                            style={{width:"90%"}}
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
        </View>
    );
}
