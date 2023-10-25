// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

export const requestToken = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./firebase-messaging-sw.js")
      .then(function (registration) {
        console.log("Registration successful, scope is:", registration.scope);
        getToken(messaging, {
          vapidKey:
            "BDLJUvZdBlpoKi5BMTZiLdyw0QRWPkrry6jDZk7CKm6-LnqAnSwI9S6ykgY58ntFHAFTS_DVDXsHz6v2hauTtjw",
          serviceWorkerRegistration: registration,
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log("current token for client: ", currentToken);
              localStorage.setItem("firebaseId", currentToken);
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
          });
      })
      .catch(function (err) {
        console.log("Service worker registration failed, error:", err);
      });
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
