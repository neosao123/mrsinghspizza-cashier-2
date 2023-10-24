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
import { messaging, onMessageListener, requestToken } from "./firebase";
import { toast } from "react-toastify";
import { getToken } from "firebase/messaging";
import bellSound from "./bell-sound.wav";
import useSound from "use-sound";

function App() {
  const dispatch = useDispatch();
  const [hasToken, setHasToken] = useState(false);

  const [play] = useSound(bellSound);
  const [notification, setNotification] = useState({ title: "", body: "" });

  requestToken();

  onMessageListener()
    .then((payload) => {
      console.log(payload);
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
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
    })
    .catch((err) => console.log("failed: ", err));

  const firebaseNotify = async () => {
    const fb_token = localStorage.getItem("firebaseId");
    await sendNotification({
      fb_token: fb_token,
    })
      .then((res) => {
        messaging.onMessage((payload) => {
          console.log("Message received:", payload);
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
