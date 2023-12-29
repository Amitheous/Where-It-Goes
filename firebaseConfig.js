import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore, collection, doc, getDoc, getDocs, query, where, addDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from './firebaseKeys';

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });


export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const getUserExpenses = async (uid) => {
    try {
        const q = query(collection(db, "expenses"), where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        let expenses = [];
        querySnapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
        });
        return expenses;
    } catch (error) {
        console.log(error.message);
        return [];
    }
};

export const addExpense = async (expense) => {
    try {
        const docRef = await addDoc(collection(db, "expenses"), expense);
        return docRef.id;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

export const updateExpense = async (expenseId, expense) => {
    try {
        await updateDoc(doc(db, "expenses", expenseId), expense);
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const deleteExpense = async (expenseId) => {
    try {
        await deleteDoc(doc(db, "expenses", expenseId));
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
};

export const addCategory = async (category) => {
    try {
        const docRef = await addDoc(collection(db, "categories"), category);
        return docRef.id;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

export const getUserCategories = async (uid) => {
    try {
        const q = query(collection(db, "categories"), where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        let categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        return categories;
    } catch (error) {
        console.log(error.message);
        return [];
    }
};

export const addBudget = async (category) => {
    try {
        const docRef = await addDoc(collection(db, "budgets"), category);
        return docRef.id;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

export const getUserBudgets = async (uid) => {
    try {
        const q = query(collection(db, "budgets"), where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        let budgets = [];
        querySnapshot.forEach((doc) => {
            budgets.push({ id: doc.id, ...doc.data() });
        });
        return budgets;
    } catch (error) {
        console.log(error.message);
        return [];
    }
};

export const deleteBudget = async (budgetId) => {
    try {
        await deleteDoc(doc(db, "budgets", budgetId));
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
};

export const updateBudget = async (budgetId, budget) => {
    try {
        await updateDoc(doc(db, "budgets", budgetId), budget);
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}


export default app;