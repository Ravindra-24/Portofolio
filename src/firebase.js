
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyBGHJrPUJeMxNCejSQagClvt1zNtHyqNTw",
  authDomain: "assignment-6e254.firebaseapp.com",
  projectId: "assignment-6e254",
  storageBucket: "assignment-6e254.appspot.com",
  messagingSenderId: "330312586399",
  appId: "1:330312586399:web:193fe08f57c50f5cab3eaa"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);


export const signInWithGoogle = () => signInWithPopup(auth, provider);