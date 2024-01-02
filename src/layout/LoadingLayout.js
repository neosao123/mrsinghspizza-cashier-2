import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loadingImg from "../assets/loading.gif";

function LoadingLayout() {
  const [count, setCount] = useState(5);
  let navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 50);
    //redirect one count is equal to 0
    if (count === 0) {
      // navigate("/");
      //localStorage.removeItem("token");
    }
    //cleanup
    return () => clearInterval(interval);
  }, [count]);

  return (
    // <div className="" style={{ height: "100vh" }}>
    //   <div className="w-100 h-100 d-flex justify-content-center align-items-center align-content-center text-center">
    //     <h6>Loading....</h6>
    //   </div>
    // </div>

    <div className="d-flex w-100 vh-100 justify-content-center align-items-center">
      <img src={loadingImg} alt="" style={{ width: "2rem", height: "2rem" }} />
    </div>
  );
}

export default LoadingLayout;
