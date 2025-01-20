// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCogbzh9Q_R6nVcrG4oCghCmb3TzHiZ0mY",
  authDomain: "brim-burgers-pk.firebaseapp.com",
  projectId: "brim-burgers-pk",
  storageBucket: "brim-burgers-pk.firebasestorage.app",
  messagingSenderId: "196647649660",
  appId: "1:196647649660:web:52c42e588afd79603a64f9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Firebase Authentication
export const storage = getStorage(app); // Firebase Storage
export const db = getFirestore(app); // Firestore Database
export default app;
