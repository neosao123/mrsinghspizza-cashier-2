import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ForgetPass from "./Pages/auth/ForgetPass";
import Login from "./Pages/auth/Login";
import ResetPass from "./Pages/auth/ResetPass";
import Invoices from "./Pages/invoices/Invoices";
import Report from "./Pages/report/Report";
import RestrictedPage from "./Pages/RestrictedPage";
import OngoingOrder from "./Pages/ongoingOrders/NewOrder";
import { useDispatch } from "react-redux";
import Order from "./Pages/order/Order";
import AuthLayout from "./layout/AuthLayout";
import { cashierDetails, sendNotification } from "./API/ongoingOrder";
import { GlobalProvider } from "./context/GlobalContext";
import { setPrintRef } from "./reducer/cartReducer";
import Profile from "./Pages/dashboard/Profile";
import PasswordChange from "./Pages/dashboard/PasswordChange";
import HelmetHeader from "./components/order/HelmetHeader";
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { data } from "jquery";
import { async } from "@firebase/util";
import { toast } from "react-toastify";

function App() {
  const dispatch = useDispatch();
  const [hasToken, setHasToken] = useState(false);

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

  const firebaseNotify = async () => {
    const fb_token = localStorage.getItem("firebaseId");
    await sendNotification({
      fb_token: fb_token,
    })
      .then((res) => {
        messaging.onMessage((payload) => {
          console.log("Message received:", payload);
          // You can process the message data here.
        });
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    firebaseNotify();
  });

  return (
    <>
      <HelmetHeader />
      <GlobalProvider>
        <Routes>
          <Route path="/" exact element={<Login />} />
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
