import React, { useEffect, useState } from "react";
import LoadingLayout from "./LoadingLayout";
import { useSelector } from "react-redux";

function AuthLayout({ children }) {
  const [ok, setOk] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token !== undefined && token !== "") {
      if (!user?.data?.token && user === null) {
        setOk(false);
      } else {
        setOk(true);
      }
    }
  }, [user?.data?.token, token]);

  //return ok ? <>{children}</> : <LoadingLayout />;
  return <>{children}</>;
}

export default AuthLayout;
