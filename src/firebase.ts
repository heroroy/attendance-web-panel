import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import "firebase/compat/firestore";

const env = import.meta.env

console.log(env.VITE_FIREBASE_API_KEY)

const app = firebase.initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
})

export const auth = app.auth()

export const database = app.firestore()

export default app