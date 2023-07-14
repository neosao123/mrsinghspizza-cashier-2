import React, { useState } from "react";
import Nav from "../../layout/Nav";
import "../../css/orders.css";

function Order() {
  const [orderType, setOrderType] = useState("store");
  return (
    <>
      <Nav />
      <div className="row">
        <div className="col-lg-3 p-0 vh-100 text-center main">
          <div className="card">
            <div className="selectDiv p-0">
              <select
                className="form-select px-4 py-2 orderType-selection"
                onChange={(e) => setOrderType(e.target.value)}
              >
                <option value="store" className="options py-2">
                  Store Order
                </option>
                <option value="online" className="options">
                  Online Order
                </option>
              </select>
            </div>
            {orderType === "store" ? (
              <>
                <h6 className="orderTitle mb-0 py-2 text-white">Store Order</h6>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item p-3 orderList">
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
                  </li>
                  <li className="list-group-item p-3 orderList">
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
                    </div>{" "}
                  </li>
                  <li className="list-group-item p-3 orderList">
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
                  </li>
                </ul>
              </>
            ) : (
              <>
                <h6 className="orderTitle mb-0 py-2 text-white">
                  Online Order
                </h6>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item p-3 orderList">
                    <div className="d-flex px-3 my-1 justify-content-between align-items-center">
                      <div>
                        <span>
                          <strong>#</strong>
                        </span>
                        <span className="mx-3">5666466797</span>
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
                  </li>
                  <li className="list-group-item p-3 orderList">
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
                    </div>{" "}
                  </li>
                  <li className="list-group-item p-3 orderList">
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
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;
