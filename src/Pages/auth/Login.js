import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../../API/auth/login";
import { useFormik } from "formik";
import bgImage from "../../assets/bg-img.jpg";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

// Validation Functions
const getCharacterValidationError = (str) => {
  return `Your password must have at least 1 ${str} character`;
};
const ValidateSchema = Yup.object({
  userName: Yup.string().required("Rquired"),
  password: Yup.string()
    .required("Required")
    .min(8, "Password must have at least 8 characters")
    .matches(/[0-9]/, getCharacterValidationError("digit")),
  // .matches(/[a-z]/, getCharacterValidationError("lowercase"))
  // .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
});

function Login() {
  const [loginObj, setLoginObj] = new useState({
    userName: "cashier",
    password: "12345678",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation;

  const { user } = useSelector((state) => ({ ...state }));

  const intended = location.state;
  useEffect(() => {
    console.log("intended", intended);
    if (intended) {
      return;
    } else {
      if (user?.data?.token) {
        navigate("/ongoing-orders");
      }
    }
  }, [intended, user?.data?.token, navigate]);

  const onSubmit = async (values) => {
    console.log(values);
    try {
      await loginApi(values)
        .then(async (res) => {
          // Store res in LocalStorage
          let parseToken = res.data.token;
          localStorage.setItem("token", parseToken);
          localStorage.setItem("cashierCode", res.data.data.code);
          dispatch({
            type: "LOGGD_IN_USER",
            payload: {
              token: res.data.token,
              code: res.data.data.code,
              userName: res.data.data.userName,
              firstName: res.data.data.firstName,
              lastName: res.data.data.lastName,
              mobileNumber: res.data.data.mobileNumber,
              email: res.data.data.email,
              isActive: res.data.data.isActive,
              firebaseId: res.data.data.firebaseId,
              profilePhoto: res.data.data.profilePhoto,
            },
          });

          setTimeout(() => {
            navigate("/ongoing-orders");
          }, 2000);
        })
        .catch((err) => {
          console.log("Error From LoginApi: ", err);
        });
    } catch (err) {
      console.log("Exception From LoginApi", err);
    }
  };

  // Use Formik
  const formik = useFormik({
    initialValues: loginObj,
    validateOnBlur: true,
    validationSchema: ValidateSchema,
    onSubmit,
    enableReinitialize: true,
  });

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
          <h4 className="mb-4 text-center">Login</h4>
          <form onSubmit={formik.handleSubmit}>
            <label className="form-label">Username</label>
            <input
              type="text"
              name="userName"
              className="form-control"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.userName && formik.errors.userName ? (
              <div className="text-danger mt-2">{formik.errors.userName}</div>
            ) : null}
            <label className="form-label mt-2">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger mt-2">{formik.errors.password}</div>
            ) : null}
            <div className="d-flex justify-content-end w-100">
              <Link to="/forget-password" className="my-2">
                Forget Password
              </Link>
            </div>
            <div className="d-flex justify-content-center w-100">
              <button
                type="submit"
                className="btn px-4 mt-1 w-100 text-center btn-rounded"
                style={{ backgroundColor: "#ff8c00", color: "#f4f4f4" }}
              >
                <strong>Login</strong>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
