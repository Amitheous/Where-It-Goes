import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from './firebaseKeys';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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


// console.log("Category Test: ", getCategoryById("M26VrnFfhX00kyHlp2fj"));

export default app;