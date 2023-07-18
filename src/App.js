import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Pages/auth/Login";
import ForgetPass from "./Pages/auth/ForgetPass";
import ResetPass from "./Pages/auth/ResetPass";
import Invoices from "./Pages/invoices/Invoices";
import Report from "./Pages/report/Report";
import RestrictedPage from "./Pages/RestrictedPage";
import { useEffect, useState } from "react";
import OngoingOrder from "./Pages/ongoingOrders/OngoingOrder";
import { useDispatch } from "react-redux";
import Order from "./Pages/order/Order";
import AuthLayout from "./layout/AuthLayout";
import { cashierDetails } from "./API/ongoingOrder";
import { Helmet } from "react-helmet";

function App() {
  const dispatch = useDispatch();

  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    // window.addEventListener("resize", restrictedPage);
    // Redux Data ReStore After Page Relaod using Token(localstorage)
    // let token = localStorage.getItem("token");
    // if (token !== null && token !== "") {
    //   setHasToken(true);
    //   cashierDetails(token)
    //     .then((res) => {
    //       dispatch({
    //         type: "LOGGD_IN_USER",
    //         payload: {
    //           token: token,
    //           code: res.data.data.code,
    //           userName: res.data.data.userName,
    //           firstName: res.data.data.firstName,
    //           lastName: res.data.data.lastName,
    //           mobileNumber: res.data.data.mobileNumber,
    //           email: res.data.data.email,
    //           isActive: res.data.data.isActive,
    //           firebaseId: res.data.data.firebaseId,
    //           profilePhoto: res.data.data.profilePhoto,
    //         },
    //       });
    //     })
    //     .catch((err) => {
    //       console.log("Cashier Details Error", err);
    //     });
    // }
  }, []);

  // Restricted Page Funtion
  // const restrictedPage = () => {
  //   const updatedWidth =
  //     window.innerWidth ||
  //     document.documentElement.clientWidth ||
  //     document.body.clientWidth;

  //   if (updatedWidth <= 767) {
  //     navigate("/restricted-page");
  //   }
  // };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Cashier | Mr. Singh's Pizza</title>
        <link rel="canonical" href="http://cashier.mrsinghspizza.com/" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/images/logo/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/images/logo/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/images/logo/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/images/logo/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/images/logo/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/images/logo/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/images/logo/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/images/logo/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/logo/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/images/logo/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/logo/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/images/logo/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/logo/favicon-16x16.png"
        />
      </Helmet>
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
        <Route path="/reports" element={<Report />} />

        {/* Page For Restricted condition */}
        <Route path="/restricted-page" element={<RestrictedPage />} />
      </Routes>
    </>
  );
}

export default App;
