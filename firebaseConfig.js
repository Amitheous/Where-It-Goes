import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence} from "firebase/auth/react-native";
import {getFirestore, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from './firebaseKeys';


const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized: ", app.name);
const db = getFirestore(app);
console.log("Firestore initialized: ", db);
export const auth = initializeAuth(app, {
    persistence : getReactNativePersistence(AsyncStorage)
}) 
console.log("Auth initialized: ", auth);

// const fetchExpenses = async () => {
//     const querySnapshot = await getDocs(collection(db, "expenses"));
//     const expenses = [];
//     querySnapshot.forEach((doc) => {
//         expenses.push(doc.data());
//     });
//     return expenses;
// }
// console.log(fetchExpenses())

export default app;