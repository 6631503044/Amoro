// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCy6_N9bBemWAiT3774jE-YprlCwldDlrk",
  authDomain: "madproject-amoro.firebaseapp.com",
  projectId: "madproject-amoro",
  storageBucket: "madproject-amoro.firebasestorage.app",
  messagingSenderId: "378572137696",
  appId: "1:378572137696:web:67ccc6937834ebb1341c85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // Use AsyncStorage for persistence
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };