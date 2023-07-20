import React, { useState } from "react";
import Nav from "../../layout/Nav";
import "../../css/orders.css";

function Order() {
  const [orderType, setOrderType] = useState("store");
  return (
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 p-0 vh-100 text-center main">
            <div className="card">
              <div className="selectDiv p-0">
                <select
                  className="form-select px-4 py-2 orderType-selection"
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="">--Choose --</option>
                  <option value="store" className="options">
                    Store Order
                  </option>
                  <option value="online" className="options">
                    Online Order
                  </option>
                </select>
              </div>
              <div>
                {orderType && (
                  <h6
                    className={
                      "orderTitle mb-0 py-1 text-white " +
                      (orderType === "store" ? "bg-info" : "bg-dark")
                    }
                  >
                    {orderType.toLocaleUpperCase()}
                  </h6>
                )}
                <ul className="list-group list-group-flush">
                  <li className="list-group-item p-1 orderList">
                    <div className="d-flex px-3 my-1 justify-content-between align-items-center">
                      <div>
                        <span>
                          <strong>#</strong>
                        </span>
                        <span className="mx-3">9877676543</span>
                      </div>
                      <div>
                        <span className="mx-2">$21.56</span>
                      </div>
                    </div>
                    <div className="d-flex px-3 my-1 justify-content-start">
                      <span>
                        <i class="fa fa-user" aria-hidden="true"></i>
                      </span>
                      <span className="mx-3">ABC PQR</span>
                    </div>
                    <div className="d-flex px-3 my-1 justify-content-start">
                      <span>
                        <i class="fa fa-phone" aria-hidden="true"></i>
                      </span>
                      <span className="mx-3">9767656546</span>
                    </div>
                    <div className="d-flex px-3 my-1 justify-content-start">
                      <span>
                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                      </span>
                      <span className="mx-3 badge bg-dark">Online</span>
                    </div>
                  </li>
                  <li className="list-group-item p-1 orderList">
                    <div className="d-flex px-3 my-1 justify-content-between align-items-center">
                      <div>
                        <span>
                          <strong>#</strong>
                        </span>
                        <span className="mx-3">9877676543</span>
                      </div>
                      <div>
                        <span className="mx-2">$21.56</span>
                      </div>
                    </div>
                    <div className="d-flex px-3 my-1 justify-content-start">
                      <span>
                        <i class="fa fa-user" aria-hidden="true"></i>
                      </span>
                      <span className="mx-3">ABC PQR</span>
                    </div>
                    <div className="d-flex px-3 my-1 justify-content-start">
                      <span>
                        <i class="fa fa-phone" aria-hidden="true"></i>
                      </span>
                      <span className="mx-3">9767656546</span>
                    </div>
                    <div className="d-flex px-3 my-1 justify-content-start">
                      <span>
                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                      </span>
                      <span className="mx-3 badge bg-info">Store</span>
                    </div>
                  </li>
                  <li className="list-group-item p-1 orderList">
                    <div className="d-flex px-3 my-1 justify-content-between align-items-center">
                      <div>
                        <span>
                          <strong>#</strong>
                        </span>
                        <span className="mx-3">9877676543</span>
                      </div>
                      <div>
                        <span className="mx-2">$21.56</span>
                      </div>
                    </div>
                    <div className="d-flex px-3 my-1 justify-content-start">
                      <span>
                        <i class="fa fa-user" aria-hidden="true"></i>
                      </span>
                      <span className="mx-3">ABC PQR</span>
                    </div>
                    <div className="d-flex px-3 my-1 justify-content-start">
                      <span>
                        <i class="fa fa-phone" aria-hidden="true"></i>
                      </span>
                      <span className="mx-3">9767656546</span>
                    </div>
                    <div className="d-flex px-3 my-1 justify-content-start">
                      <span>
                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                      </span>
                      <span className="mx-3 badge bg-info">Store</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;
