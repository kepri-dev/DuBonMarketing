import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBq5Ye8Z5h4NpvxjrMBRNnrvaaJEdk6qPY",
  authDomain: "test-firebase-9badc.firebaseapp.com",
  projectId: "test-firebase-9badc",
  storageBucket: "test-firebase-9badc.appspot.com",
  messagingSenderId: "994015985110",
  appId: "1:994015985110:web:1af672b4beb36586907877",
  measurementId: "G-3SP6M4WLHP",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
