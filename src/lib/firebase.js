import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-9d1af.firebaseapp.com",
  projectId: "reactchat-9d1af",
  storageBucket: "reactchat-9d1af.appspot.com",
  messagingSenderId: "89631941334",
  appId: "1:89631941334:web:c8c20fe38e4709e07adf77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
