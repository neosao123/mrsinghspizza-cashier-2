import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Pages/auth/Login";
import ForgetPass from "./Pages/auth/ForgetPass";
import ResetPass from "./Pages/auth/ResetPass";
import Invoices from "./Pages/invoices/Invoices";
import Report from "./Pages/report/Report";
import RestrictedPage from "./Pages/RestrictedPage";
import { useEffect } from "react";
import OngoingOrder from "./Pages/ongoingOrders/OngoingOrder";
import { useDispatch } from "react-redux";
import { checkLogin } from "./store/userStore";
import Order from "./Pages/order/Order";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("resize", restrictedPage);
    checkLogin(dispatch); //Store user data in redux after reload
  }, []);

  // Restricted Page Funtion
  const restrictedPage = () => {
    const updatedWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    if (updatedWidth <= 767) {
      navigate("/restricted-page");
    } else {
      navigate("/");
    }
  };

  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/forget-password" element={<ForgetPass />} />
      <Route path="/reset-password" element={<ResetPass />} />

      {/* Pages */}
      <Route path="/ongoing-orders" element={<OngoingOrder />} />
      <Route path="/orders" element={<Order />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/reports" element={<Report />} />

      {/* Page For Restricted condition */}
      <Route path="/restricted-page" element={<RestrictedPage />} />
    </Routes>
  );
}

export default App;
