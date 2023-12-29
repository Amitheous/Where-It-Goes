import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "expo-router";
import { Appbar, Button, useTheme, Portal, Modal as RNPModal, Checkbox } from "react-native-paper";
import PrimaryTextInput from "../../../components/primaryTextInput"
import { AuthStore, appAddBudget, appAddCategory } from "../../../../store";
import { useStoreState } from "pullstate";
import { useState, useRef } from "react";
import { auth } from "../../../../firebaseConfig";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Timestamp } from "firebase/firestore"

// Future features:
// The user will be able to set up a notification for when they are close to reaching their budget limit
// Or a recurring notification of their current budget usage


export default function AddNewBudgetScreen() {
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
    const [startDate, setStartDate] = useState(new Date());
    const [endDateSelected, setEndDateSelected] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [newCategoryModalVisible, setNewCategoryModalVisible] = useState(false);
    const [createdCategory, setCreatedCategory] = useState({ value: "Select Budget Category", key: "1" }); // This is the default option for the SelectList component, which is the first option in the data array [see below
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [startDateSelected, setStartDateSelected] = useState(false);

    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState(""); // For recurring budgets
    const [endDate, setEndDate] = useState(new Date()); // For one-time budgets


    const showNewCategoryModal = () => setNewCategoryModalVisible(true);
    const hideNewCategoryModal = () => setNewCategoryModalVisible(false);

    const data = [{ value: "Create A New Category", key: "new_category" }, ...categories.map((category) => ({ value: category.name, key: category.id }))];

    const handleAddBudget = async () => {
        // Budget object structure
        const budget = {
            title,
            description,
            amount: parseFloat(amount.replace(/[^0-9.]/g, '')) || 0.00,
            category: selectedCategory,
            userId: auth.currentUser.uid,
            isRecurring,
            frequency: isRecurring ? frequency : null,
            startDate: isRecurring ? null : Timestamp.fromDate(startDate.setHours(0, 0, 0, 0)),
            endDate: isRecurring ? null : Timestamp.fromDate(endDate.setHours(23, 59, 59, 999)),
        };

        try {
            // Function to add budget to the database
            await appAddBudget(budget);
            navigation.goBack();
        } catch (error) {
            console.error(error.message);
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
                const newCategoryData = { value: newCategory.name, key: addedCategory.id };
                data.push(newCategoryData); // Update the SelectList data source

                // Set this new category as the selected category
                setCreatedCategory(newCategoryData);

                setCategoryName(''); // Reset category name
                setCategoryDescription(''); // Reset category description
                hideNewCategoryModal();

            } else {
                console.log(addedCategory.error);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

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

    const formatDate = (date) => {
        // Example format: Jan 1, 2023
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };





    const categoryInputRef = useRef();
    const descriptionInputRef = useRef();
    const amountInputRef = useRef();
    const dateInputRef = useRef();

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="New Budget" />
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

                {/* Title, Description, Amount inputs */}
                {/* Category SelectList */}
                {/* Date Picker for Start Date */}

                {/* Toggle between Recurring and One-Time Budget */}

                <Checkbox.Item
                    label="Recurring"
                    status={isRecurring ? 'checked' : 'unchecked'}
                    onPress={() => setIsRecurring(!isRecurring)}
                />
                <PrimaryTextInput
                    ref={amountInputRef}
                    label="Amount"
                    value={"$" + amount}
                    keyboardType="numeric"
                    onChangeText={(value) => setAmount(formatCurrencyInput(value))}
                    onSubmitEditing={() => dateInputRef.current && dateInputRef.current.focus()}
                    returnKeyType="next"
                />


                {/* <Button
                    mode="outlined"
                    style={{ marginTop: 10 }}
                    onPress={() => setIsRecurring(!isRecurring)}
                >
                    {isRecurring ? "Set to One-Time Budget" : "Set to Recurring Budget"}
                </Button> */}

                {/* Conditionally render frequency or end date selection based on isRecurring */}
                {isRecurring ? (
                    // Dropdown to select frequency (daily, weekly, monthly, yearly)
                    <SelectList
                        boxStyles={{ paddingHorizontal: 15, borderRadius: 5, backgroundColor: theme.colors.background, borderColor: theme.colors.outline, height: 48, color: "white", marginTop: 10 }}
                        inputStyles={{ color: theme.colors.onSurfaceVariant, fontSize: 16 }}
                        dropdownStyles={{ backgroundColor: theme.colors.background, borderColor: theme.colors.secondaryContainer, color: "white" }}
                        dropdownItemStyles={{ backgroundColor: theme.colors.background, borderColor: theme.colors.secondaryContainer, color: "white" }}
                        dropdownTextStyles={{ color: theme.colors.onTertiaryContainer }}
                        search={false}
                        placeholder="Select Recurring Frequency"
                        defaultOption={{ value: "Select Recurring Frequency", key: "1" }}
                        data={[{ value: "Daily", key: "daily" }, { value: "Weekly", key: "weekly" }, { value: "Monthly", key: "monthly" }, { value: "Yearly", key: "yearly" }]}
                        // SelectList properties for frequency
                        setSelected={setFrequency}
                    // Other SelectList properties
                    />
                ) : (
                    <View>
                        <Button
                            mode="outlined"
                            style={{ backgroundColor: theme.colors.tertiary, color: theme.colors.onTertiaryContainer, marginTop: 10 }}
                            textColor="black"
                            onPress={() => setShowStartDatePicker(true)}

                            icon="calendar"
                        >
                            {startDateSelected ? "Start Date: " + formatDate(startDate) : "Select Start Date"}
                        </Button>
                        <Button
                            mode="outlined"
                            style={{ backgroundColor: theme.colors.tertiary, color: theme.colors.onTertiaryContainer, marginTop: 10 }}
                            textColor="black"
                            onPress={() => setShowEndDatePicker(true)}

                            icon="calendar"
                        >
                            {endDateSelected ? "End Date: " + formatDate(endDate) : "Select End Date"}
                        </Button>
                    </View>
                )}
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowStartDatePicker(false);
                            const currentDate = selectedDate || date;
                            setStartDate(currentDate);
                            setStartDateSelected(true);
                            // Hide the DateTimePicker after selecting a date
                        }}
                    />
                )}
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowEndDatePicker(false);
                            const currentDate = selectedDate || date;
                            setEndDate(currentDate);
                            setEndDateSelected(true);
                            // Hide the DateTimePicker after selecting a date
                        }}
                    />
                )}
                <SelectList
                    defaultOption={createdCategory}
                    setSelected={(val) => {
                        if (val === "new_category") {
                            showNewCategoryModal();
                        } else {
                            // Find the corresponding key for the selected value
                            const selectedCategoryKey = val;
                            setSelectedCategory(selectedCategoryKey);
                        }
                    }}
                    data={data}
                    save="key"
                    boxStyles={{ paddingHorizontal: 15, borderRadius: 5, backgroundColor: theme.colors.background, borderColor: theme.colors.outline, height: 48, color: "white", marginTop: 10 }}
                    inputStyles={{ color: theme.colors.onSurfaceVariant, fontSize: 16 }}
                    dropdownStyles={{ backgroundColor: theme.colors.background, borderColor: theme.colors.secondaryContainer, color: "white" }}
                    dropdownItemStyles={{ backgroundColor: theme.colors.background, borderColor: theme.colors.secondaryContainer, color: "white" }}
                    placeholder="Select Budget Category"
                    dropdownTextStyles={{ color: theme.colors.onTertiaryContainer }}
                    searchPlaceholderTextStyle={{ color: "white" }}
                    searchPlaceholder=""
                    searchicon={<MaterialIcons name="search" size={20} color={theme.colors.onSecondaryContainer} style={{ marginRight: 5 }} />}
                />

                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={handleAddBudget}
                >
                    Add Budget
                </Button>
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => {
                        console.log("Title: " + title)
                        console.log("Description: " + description)
                        console.log("Amount: " + amount)
                        console.log("Category: " + selectedCategory)
                        console.log("Frequency: " + frequency)
                        console.log("Start Date: " + startDate)
                        console.log("End Date: " + endDate)

                    }}
                >
                    Log States
                </Button>
            </View>
            {/* New Category Modal */}
        </View>
    );
}