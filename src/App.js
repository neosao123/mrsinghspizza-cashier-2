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
import { cashierDetails } from "./API/ongoingOrder";
import { GlobalProvider } from "./context/GlobalContext";
import { setPrintRef } from "./reducer/cartReducer";
import Profile from "./Pages/dashboard/Profile";
import PasswordChange from "./Pages/dashboard/PasswordChange";
import HelmetHeader from "./components/order/HelmetHeader";
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { data } from "jquery";

function App() {
  const dispatch = useDispatch();
  const [hasToken, setHasToken] = useState(false);

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    console.log("data");
    if (permission === "granted") {
      // Generate Token
      getToken(messaging, {
        vapidKey:
          "BDLJUvZdBlpoKi5BMTZiLdyw0QRWPkrry6jDZk7CKm6-LnqAnSwI9S6ykgY58ntFHAFTS_DVDXsHz6v2hauTtjw",
      }).then((res) => {
        if (res) {
          console.log("current token", res);
        } else {
          alert();
        }
      });
    } else if (permission === "denied") {
      alert("You have ");
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

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
