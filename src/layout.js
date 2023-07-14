import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function layout() {
  const navigate = useNavigate();
  const state = useSelector((state) => ({ ...state.user }));
  const token = state.data.token;

  useEffect(() => {
    if (token) {
      navigate("/ongoing-orders");
    } else {
      navigate("/");
    }
  }, [token]);

  
}

export default layout;
