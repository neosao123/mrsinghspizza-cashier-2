// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBOl8DQcuDxoqD66sEj2KZ1xPDatCOUP3A",
  authDomain: "mrsinghspizza-707f6.firebaseapp.com",
  projectId: "mrsinghspizza-707f6",
  storageBucket: "mrsinghspizza-707f6.appspot.com",
  messagingSenderId: "1081957693712",
  appId: "1:1081957693712:web:c8cb96f6e10e32bd1ecd95",
  measurementId: "G-23FZ38ZM7Q",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
