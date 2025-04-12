import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import { initializeApp } from "firebase/app"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCy6_N9bBemWAiT3774jE-YprlCwldDlrk",
  authDomain: "madproject-amoro.firebaseapp.com",
  projectId: "madproject-amoro",
  storageBucket: "madproject-amoro.firebasestorage.app",
  messagingSenderId: "378572137696",
  appId: "1:378572137696:web:67ccc6937834ebb1341c85",
}

// Initialize Firebase

const app = initializeApp(firebaseConfig)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})
export const db = getFirestore(app)

// Google Sign-In configuration
// const useGoogleSignIn = () => {
//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     clientId: '434400818906-70p9t0e397gsfd8hrhb7jl5g3jbhvssp.apps.googleusercontent.com', // Replace with your Google client ID
//     redirectUri: Platform.select({
//       ios: 'yourapp://',  // For iOS
//       android: 'yourapp://', // For Android
//       default: 'https://auth.expo.io/@ProjectAmoro/ProjectAmoro', // For Expo
//     }),
//   });
// }
// export { useGoogleSignIn };
