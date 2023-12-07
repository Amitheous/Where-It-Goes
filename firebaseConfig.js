import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore, collection, doc, getDoc, getDocs, query, where, addDoc, deleteDoc } from 'firebase/firestore'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from './firebaseKeys';

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });


export const auth = initializeAuth(app, {
    persistence : getReactNativePersistence(AsyncStorage)
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

export const addExpense = async (expense) => {
    try {
        const docRef = await addDoc(collection(db, "expenses"), expense);
        return docRef;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

export const deleteExpense = async (expenseId) => {
    try {
        await deleteDoc(doc(db, "expenses", expenseId));
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
};


export default app;