import React, { useEffect, useState } from "react";
import Nav from "../../layout/Nav";
import "../../css/orders.css";
import { orderDetails, orderListApi } from "../../API/order";

function Order() {
  const [listData, setListData] = useState();
  const [orderFrom, setOrderFrom] = useState("all");
  const [orderDetail, setOrderDetail] = useState();
  const [orderId, setOrderId] = useState();

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
  const getOrderDetailsApi = async () => {
    await orderDetails({ orderCode: orderId }).then((res) => {
      setOrderDetail(res.data.data);
    });
  };
  useEffect(() => {
    console.log(orderDetail, "orderDetail");
  }, [orderDetail]);

  useEffect(() => {
    if (orderId !== undefined) {
      getOrderDetailsApi();
    }
  }, [orderId]);

  useEffect(() => {
    orderList();
    setOrderDetail();
  }, [orderFrom]);

  return (
    <>
      <Nav />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-3 p-0 vh-100 text-center main'>
            <div className='card'>
              <div className='selectDiv p-0'>
                <select
                  className='form-select px-4 py-2 orderType-selection'
                  onChange={(e) => setOrderFrom(e.target.value)}
                >
                  <option value=''>--Choose --</option>
                  <option value='store' className='options'>
                    Store Order
                  </option>
                  <option value='online' className='options'>
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
                <ul className='list-group list-group-flush'>
                  {listData?.map((data) => {
                    return (
                      <li
                        className='list-group-item p-1 orderList'
                        key={data.code}
                        onClick={() => setOrderId(data.code)}
                      >
                        <div className='d-flex px-3 my-1 justify-content-between align-items-center'>
                          <div>
                            <span>
                              <strong>#</strong>
                            </span>
                            <span className='mx-3'>{data.code}</span>
                          </div>
                          <div>
                            <span className='mx-3'>$ {data.grandTotal}</span>
                          </div>
                          <div className='d-flex my-1 justify-content-end '>
                            <span>
                              <i
                                class='fa fa-map-marker'
                                aria-hidden='true'
                              ></i>
                            </span>
                            <span className='mx-2 badge bg-info'>Store</span>
                          </div>
                          <div className='d-flex my-1 justify-content-end'>
                            <span>
                              <i class='fa fa-check' aria-hidden='true'></i>
                            </span>
                            <span className='mx-2 badge bg-warning'>
                              Picked Up
                            </span>
                          </div>
                          <div className='d-flex my-1 justify-content-end'>
                            <span>
                              <i class='fa fa-trash' aria-hidden='true'></i>
                            </span>
                            <span className='mx-2 badge bg-danger'>Cancel</span>
                          </div>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <div className='d-flex px-3 my-1 justify-content-start'>
                            <span>
                              <i class='fa fa-user' aria-hidden='true'></i>
                            </span>
                            <span className='mx-3'>{data.customerName}</span>
                          </div>
                          <div className='d-flex px-3 my-1 justify-content-end'>
                            <span className='mx-2'>
                              <i class='fa fa-phone' aria-hidden='true'></i>
                            </span>
                            <span className='mx-2'>{data.mobileNumber}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          {orderDetail && (
            <div className='col-lg-9'>
              <div
                className='col-11  m-5 px-5 py-1 rounded vh-100'
                style={{ backgroundColor: "#ff8c0021" }}
              >
                <div className='col-12 d-flex justify-content-between my-3'>
                  <div className='col-6 h5'>Order Details</div>
                  <div className='col-6 d-flex justify-content-end pe-4'>
                    <div
                      className='btn text-white'
                      style={{ backgroundColor: "#ff8c00" }}
                    >
                      Print
                    </div>
                  </div>
                </div>
                <div className='col-12 d-flex '>
                  <div className='col-4'>
                    <h6 className='py-2'>Order No : {orderDetail?.code}</h6>
                    <h6 className='py-2'>
                      Phone No : {orderDetail?.mobileNumber}
                    </h6>
                    <h6 className='py-2'>Address : {orderDetail?.address}</h6>
                    <h6 className='py-2'>Zip Code : {orderDetail?.code}</h6>
                    <h6 className='py-2'>
                      Delivery Type : {orderDetail?.deliveryType}
                    </h6>
                  </div>
                  <div className='col-4 text-left'>
                    <h6 className='py-2'>
                      Date :{" "}
                      {new Date(orderDetail?.created_at)
                        .toISOString()
                        .replace(/T/, " ")
                        .replace(/\.\d+Z$/, "")}
                    </h6>
                    <h6 className='py-2'>Name : {orderDetail?.customerName}</h6>
                    <h6 className='py-2'>
                      Store Location : {orderDetail?.storeLocation}
                    </h6>
                    <h6 className='py-2'>
                      Delivery Executive : {orderDetail?.deliveryExecutiveName}
                    </h6>
                  </div>
                  <div className='col-4'>
                    <h6 className='py-2'>Type :</h6>
                  </div>
                </div>
                <div className='col-12 d-flex justify-content-end'>
                  <div
                    className='btn text-white  m-2'
                    style={{ backgroundColor: "#ff8c00" }}
                  >
                    Change Delivery Person
                  </div>
                </div>
                <div className='col-12'>
                  <h5>Product Detail :</h5>
                </div>

                <table class='table'>
                  <tbody>
                    <tr>
                      <th scope='row'>Sr No</th>
                      <th>Product </th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Amount</th>
                    </tr>
                    {orderDetail?.orderItems?.map((order, index) => {
                      console.log(order, "order");
                      const keyNames = Object.keys(order?.config);
                      const objectToArray = Object.entries(order?.config).map(
                        ([key, value]) => ({ key, value })
                      );

                      console.log(objectToArray, "keyNames");

                      return (
                        <tr key={index + order?.productName}>
                          <td scope='row'>{index + 1}</td>
                          <td>
                            {order.productName}{" "}
                            {/* {order?.config?.map((item) => {
                              return;
                            })}{" "} */}
                            {objectToArray?.map((item, index) => {
                              console.log(item, "keyNames");
                              if (item?.key === "pizza") {
                                return (
                                  <>
                                    <p>{item.key} :</p>
                                    {/* <span>
                                      {item?.value[0].map((child) => {})}
                                    </span> */}
                                  </>
                                );
                              }
                            })}
                          </td>
                          <td>{order.quantity}</td>
                          <td>$ {order.price}</td>
                          <td>$ {order.amount}</td>
                        </tr>
                      );
                    })}

                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Sub Total :</th>
                      <td> $ {orderDetail?.subTotal}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Discount :</th>
                      <td>$ {orderDetail?.discountmount}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Tax :</th>
                      <td>$ {orderDetail?.taxPer}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Delivery Charges:</th>
                      <td>$ 0</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Grand Total :</th>
                      <td>$ {orderDetail?.grandTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Order;
