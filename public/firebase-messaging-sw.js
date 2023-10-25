// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBOl8DQcuDxoqD66sEj2KZ1xPDatCOUP3A",
  authDomain: "mrsinghspizza-707f6.firebaseapp.com",
  projectId: "mrsinghspizza-707f6",
  storageBucket: "mrsinghspizza-707f6.appspot.com",
  messagingSenderId: "1081957693712",
  appId: "1:1081957693712:web:c8cb96f6e10e32bd1ecd95",
  measurementId: "G-23FZ38ZM7Q",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
