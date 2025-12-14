import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdSah4hR-fMh3S2wB71j9OnOOI949Y314",
  authDomain: "snusidea.firebaseapp.com",
  databaseURL: "https://snusidea-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "snusidea",
  storageBucket: "snusidea.firebasestorage.app",
  messagingSenderId: "850638357570",
  appId: "1:850638357570:web:c476c45c41cf58254e99db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;


