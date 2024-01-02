import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import ForgetPass from "./Pages/auth/ForgetPass";
import Login from "./Pages/auth/Login";
import ResetPass from "./Pages/auth/ResetPass";
import Invoices from "./Pages/invoices/Invoices";
import Report from "./Pages/report/Report";
import RestrictedPage from "./Pages/RestrictedPage";
import OngoingOrder from "./Pages/ongoingOrders/NewOrder";
import { useDispatch, useSelector } from "react-redux";
import Order from "./Pages/order/Order";
import AuthLayout from "./layout/AuthLayout";
import {
  cashierDetails,
  sendNotification,
  updateFirebaseId,
} from "./API/ongoingOrder";
import { GlobalProvider } from "./context/GlobalContext";
import { setNotification, setPrintRef } from "./reducer/cartReducer";
import Profile from "./Pages/dashboard/Profile";
import PasswordChange from "./Pages/dashboard/PasswordChange";
import HelmetHeader from "./components/order/HelmetHeader";
import { messaging, onMessageListener, requestToken } from "./firebase";
import { toast } from "react-toastify";
import { getToken } from "firebase/messaging";
import bellSound from "./bell-sound.wav";
import useSound from "use-sound";

function App() {
  const dispatch = useDispatch();
  const [hasToken, setHasToken] = useState(false);

  const [play] = useSound(bellSound);

  let notificationData = useSelector(
    (state) => state.cart.setnotificationcount
  );

  const user = useSelector((state) => state?.user?.userData);

  const requestToken = () => {
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
                const firebasePayload = {
                  cashierCode: user?.code,
                  firebaseId: localStorage.getItem("firebaseId"),
                };
                updateFirebaseId(firebasePayload)
                  .then((response) => {})
                  .catch((err) => {
                    toast.error(err);
                  });
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

  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    requestToken();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        requestToken();
      }
    });
  }

  onMessageListener()
    .then((payload) => {
      play();
      toast.success(payload.notification.title, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      const notifyData = {
        messageId: payload?.messageId,
        title: payload.notification.title,
        body: payload.notification.body,
      };
      dispatch(setNotification([notifyData, ...notificationData]));
    })
    .catch((err) => console.log("failed: ", err));

  return (
    <>
      <HelmetHeader />
      <GlobalProvider>
        <Routes>
          <Route path="/" index exact element={<Login />} />
          <Route path="/forget-password" exact element={<ForgetPass />} />
          <Route path="/reset-password" exact element={<ResetPass />} />
          <Route
            path="/ongoing-orders"
            element={
              <AuthLayout>
                <OngoingOrder />
              </AuthLayout>
            }
          />
          <Route path="/orders" element={<Order />} />
          <Route path="/invoices" element={<Invoices />} />
          {/* <Route path='/reports' element={<Report />} /> */}
          <Route
            path="/profile-update"
            element={
              <AuthLayout>
                <Profile />
              </AuthLayout>
            }
          />
          <Route
            path="/password-change"
            element={
              <AuthLayout>
                <PasswordChange />
              </AuthLayout>
            }
          />
          {/* Page For Restricted condition */}
          <Route path="/restricted-page" element={<RestrictedPage />} />
        </Routes>
      </GlobalProvider>
    </>
  );
}

export default App;
