import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import { getFirestore } from "firebase/firestore";
import "firebase/compat/firestore";

console.log(process.env.REACT_APP_APILEY)

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_APILEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
})

export const auth = app.auth()

export const database = app.firestore()

export default app