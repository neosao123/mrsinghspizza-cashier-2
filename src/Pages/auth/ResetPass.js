import React from "react";
import bgImage from "../../assets/bg-img.jpg";

function ResetPass() {
  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center align-content-center vh-100"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          opacity: ".9",
        }}
      >
        <div
          className="p-5"
          style={{
            backgroundColor: "#f7f7f7",
            borderRadius: "1%",
            width: "40%",
            opacity: ".9",
            zIndex: "100",
          }}
        >
          <h4 className="mb-4 text-center">Reset password</h4>
          <form>
            <label class="form-label p-1">Email address</label>
            <input
              type="email"
              className="form-control m-1"
              placeholder="name@example.com"
            ></input>
          </form>
          <div className="d-flex justify-content-center w-100">
            <button
              type="submit"
              className="btn px-4 mt-3 w-100 text-center btn-rounded"
              style={{ backgroundColor: "#ff5555", color: "#f4f4f4" }}
            >
              <strong>Reset Password</strong>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPass;
