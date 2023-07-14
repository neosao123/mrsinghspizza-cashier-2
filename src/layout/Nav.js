import React, { Profiler, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import navStylesheet from "../css/nav.css";
import logo from "../assets/logo.png";
import profileImg from "../assets/user.png";
import arrowKey from "../assets/arrow-key.png";
import { useDispatch } from "react-redux";

function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //logout
  const Logout = () => {
    console.log("logout");
    localStorage.removeItem("token");

    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    navigate("/");
  };

  return (
    <>
      <div className="position-sticky top-0 bg-white header">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-2 py-1 mx-2">
          <div style={{ width: "8%" }}>
            <img
              src={logo}
              width="40%"
              height="40%"
              alt=""
              className="mx-2"
            ></img>
          </div>

          <div className="">
            <span className="mb-0 brandName">
              <strong>Mr Singh's Pizza</strong>
            </span>
          </div>

          <div className="d-flex justify-content-around align-items-center align-content-center">
            {/* Notification */}
            <a
              className=""
              role="button"
              id="notify"
              href="#"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i
                className="fa fa-bell-o"
                aria-hidden="true"
                width="25%"
                height="25%"
              ></i>
              <sup>
                <span className="start-100 translate-middle badge rounded-pill bg-danger">
                  2
                </span>
              </sup>
            </a>
            <div
              className="dropdown-menu dropdown-menu-right notify-menu mt-2 m-0 p-0"
              aria-labelledby="notify"
            >
              <div className="d-flex py-2 px-4 flex-column notify-header text-white">
                <h6 className="mb-1">2 New</h6>
                <span>Notification</span>
              </div>
              <a className="dropdown-item border-bottom p-2 px-4" href="#">
                <div className="">
                  <span className="d-inline-block mb-1">Order No :</span>
                  <span className="mx-2">98876767</span>
                </div>
                <div>
                  <span className="d-inline-block mb-1">Price : </span>
                  <span className="mx-2">$12.92</span>
                </div>
              </a>
              <a className="dropdown-item border-bottom p-2 px-4" href="#">
                <div className="">
                  <span className="d-inline-block mb-1">Order No :</span>
                  <span className="mx-2">98876767</span>
                </div>
                <div>
                  <span className="d-inline-block mb-1">Price : </span>
                  <span className="mx-2">$12.92</span>
                </div>
              </a>
              <div
                className="d-flex py-2 px-5 justify-content-center"
                style={{ cursor: "pointer" }}
              >
                <span className="">
                  Check all notifications
                  <img className="mx-2" src={arrowKey} width="10px"></img>
                </span>
              </div>
            </div>
            {/* Profile Update */}
            <a
              className="bg-transparent text-center p-0 border-none"
              role="button"
              id="profile"
              href="#"
              data-bs-toggle="dropdown"
            >
              <img
                src={profileImg}
                width="30%"
                height="30%"
                alt=""
                className="rounded-circle"
              ></img>
            </a>
            <div
              className="dropdown-menu dropdown-menu-right mt-2 p-0 profile-menu"
              aria-labelledby="profile-update"
            >
              <div className="d-flex justify-content-left align-items-center p-3 profileDiv text-white">
                <div className="border rounded-circle border-2 border-white imgDiv mx-2">
                  <img
                    src={`${profileImg}`}
                    alt=""
                    className="rounded-circle w-100 h-100"
                  ></img>
                </div>
                <div className="d-flex justify-content-center flex-column align-items-left p-1">
                  <h6>ABC</h6>
                  <a style={{ fontSize: ".75rem" }}>abc@example.com</a>
                </div>
              </div>
              <a className="dropdown-item p-2 px-3" href="#">
                <i className="fa fa-user" aria-hidden="true"></i>
                <span className="mx-3">Profile Update</span>
              </a>
              <a className="dropdown-item p-2 px-3" href="#">
                <i className="fa fa-key" aria-hidden="true"></i>
                <span className="mx-3">Password Change</span>
              </a>
              <a className="dropdown-item p-2 px-3 mb-2">
                <i className="fa fa-sign-out" aria-hidden="true"></i>
                <span onClick={() => Logout} className="mx-3">
                  Logout
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <hr className="bg-secondary text-secondary mb-1 m-0 p-0 "></hr>
        <div className="mx-4">
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <NavLink
                to="/ongoing-orders"
                className="nav-link"
                activeClassName="active"
              >
                <strong className="nav-text">Ongoing Order</strong>
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <NavLink
                to="/orders"
                className="nav-link"
                activeClassName="active"
              >
                <strong className="nav-text">Order</strong>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/invoices"
                className="nav-link"
                activeClassName="active"
              >
                <strong className="nav-text">Invoices</strong>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/reports"
                className="nav-link"
                activeClassName="active"
              >
                <strong className="nav-text">Reports</strong>
              </NavLink>
            </li>
          </ul>
        </div>
        <hr className="bg-secondary text-secondary mt-1 m-0 p-0"></hr>
      </div>
    </>
  );
}

export default Nav;
