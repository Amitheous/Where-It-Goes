import dotenv from 'dotenv';
dotenv.config();

export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_AUTH_PROJECT_ID,
    storageBucket: process.env.FIREBASE_AUTH_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_AUTH_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_AUTH_APP_ID,
    measurementId: process.env.FIREBASE_AUTH_MEASUREMENT_ID
};
