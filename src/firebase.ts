import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import "firebase/compat/firestore";

console.log(process.env.VITE_APP_FIREBASE_API_KEY)

const app = firebase.initializeApp({
    apiKey: process.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_APP_FIREBASE_SENDER_ID,
    appId: process.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VITE_APP_FIREBASE_MEASUREMENT_ID
})

export const auth = app.auth()

export const database = app.firestore()

export default app