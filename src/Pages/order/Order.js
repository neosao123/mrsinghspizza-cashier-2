import React, { useEffect, useState } from "react";
import Nav from "../../layout/Nav";
import "../../css/orders.css";
import { orderListApi } from "../../API/order";

function Order() {
  const [listData, setListData] = useState();
  const [orderFrom, setOrderFrom] = useState("all");

  const orderList = async () => {
    let cashierCode = localStorage.getItem("cashierCode");
    orderListApi({ cashierCode: cashierCode, orderFrom: orderFrom })
      .then((res) => {
        setListData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Order List API : ", err);
      });
  };

  useEffect(() => {
    orderList();
  }, [orderFrom]);

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
                  onChange={(e) => setOrderFrom(e.target.value)}
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
                {orderFrom && (
                  <h6
                    className={
                      "orderTitle mb-0 py-1 text-white " +
                      (orderFrom === "store" ? "bg-info" : "bg-dark")
                    }
                  >
                    {orderFrom.toLocaleUpperCase()}
                  </h6>
                )}
                <ul className="list-group list-group-flush">
                  {listData?.map((data) => {
                    return (
                      <li
                        className="list-group-item p-1 orderList"
                        key={data.code}
                      >
                        <div className="d-flex px-3 my-1 justify-content-between align-items-center">
                          <div>
                            <span>
                              <strong>#</strong>
                            </span>
                            <span className="mx-3">{data.code}</span>
                          </div>
                          <div>
                            <span className="mx-3">$ {data.grandTotal}</span>
                          </div>
                          <div className="d-flex my-1 justify-content-end">
                            <span>
                              <i
                                class="fa fa-map-marker"
                                aria-hidden="true"
                              ></i>
                            </span>
                            <span className="mx-2 badge bg-info">Store</span>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="d-flex px-3 my-1 justify-content-start">
                            <span>
                              <i class="fa fa-user" aria-hidden="true"></i>
                            </span>
                            <span className="mx-3">{data.customerName}</span>
                          </div>
                          <div className="d-flex px-3 my-1 justify-content-end">
                            <span className="mx-2">
                              <i class="fa fa-phone" aria-hidden="true"></i>
                            </span>
                            <span className="mx-2">{data.mobileNumber}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
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
