// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GithubAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIgW0Z9ycGPx9N_mQrZnBTDup6aMIJnYM",
  authDomain: "reclaim-protocol.firebaseapp.com",
  projectId: "reclaim-protocol",
  storageBucket: "reclaim-protocol.appspot.com",
  messagingSenderId: "755849041357",
  appId: "1:755849041357:web:357268ba657522bb996084",
  measurementId: "G-CKLRWRVXQE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GithubAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);