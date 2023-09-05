import React, { useEffect, useRef, useState } from "react";
import Nav from "../../layout/Nav";
import "../../css/orders.css";
import ReactToPrint from "react-to-print";
import {
  allDeliveryExecutiveApi,
  changeDeliveryExecutive,
  orderDetails,
  orderListApi,
  statusChange,
} from "../../API/order";
import { ToastContainer, toast } from "react-toastify";
import Print from "./Print";
import { useSelector } from "react-redux";

function Order() {
  const [listData, setListData] = useState();
  const [orderFrom, setOrderFrom] = useState("all");
  const [orderDetail, setOrderDetail] = useState();
  const [orderId, setOrderId] = useState();
  const [orderStatus, setOrderStatus] = useState();
  const [orderByStatus, setOrderByStatus] = useState("");
  const [allDeliveryExecutiveData, setAllDeliveryExecutiveData] = useState();
  const [updatedDeliveryExecutive, setUpdatedDeliveryExecutive] = useState();
  const printRef = useRef();
  // const printRef = useSelector((state) => state.cart.printRef);

  const orderList = async () => {
    let cashierCode = localStorage.getItem("cashierCode");
    orderListApi({
      cashierCode: cashierCode,
      orderFrom: orderFrom,
      orderStatus: orderByStatus,
    })
      .then((res) => {
        setListData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Order List API : ", err);
      });
  };
  const handleDeliveryExecutiveChange = (payload) => {
    if (payload !== "") {
      setUpdatedDeliveryExecutive(payload);
    }
  };
  const getOrderDetailsApi = async () => {
    await orderDetails({ orderCode: orderId }).then((res) => {
      setOrderDetail(res.data.data);
    });
  };
  const updateDeliveryExecutive = async () => {
    if (updatedDeliveryExecutive !== "") {
      await changeDeliveryExecutive({
        orderCode: orderId,
        deliveryExecutiveCode: updatedDeliveryExecutive,
      })
        .then((res) => {
          toast.success(res.data.message);
          getOrderDetailsApi();
          setUpdatedDeliveryExecutive();
        })
        .catch((err) => toast.error(err?.response?.data.message));
    } else {
      toast.error("select delivery executive");
    }
  };
  const handleStatusChange = async (payload) => {
    if (
      payload?.orderCurrentStatus === "placed" ||
      payload?.orderCurrentStatus === "shipping"
    ) {
      await statusChange({
        orderCode: payload.orderCode,
        orderStatus: payload.orderStatus,
      })
        .then((res) => {
          toast.success(res.data.message);
          orderList();
        })
        .catch((err) => toast.error(err?.response?.data.message));
    } else {
      toast.error("Order is already " + payload?.orderCurrentStatus);
    }
  };

  const getAllDeliveryExecutive = async () => {
    await allDeliveryExecutiveApi()
      .then((res) => {
        setAllDeliveryExecutiveData(res.data.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => { }, [orderDetail]);

  useEffect(() => {
    if (orderId !== undefined) {
      getOrderDetailsApi();
    }
  }, [orderId]);

  useEffect(() => {
    orderList();
    setOrderDetail();
    getAllDeliveryExecutive();
    // setOrderByStatus("");
  }, [orderFrom, orderByStatus]);

  return (
    <>
      <Nav />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-4 p-0   text-center main'>
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
                <select
                  className='form-select px-4 py-2 orderType-selection'
                  onChange={(e) => setOrderByStatus(e.target.value)}
                >
                  <option value=''>--Filter Orders By Status --</option>
                  <option value=''>All</option>
                  <option value='pickedup' className='options'>
                    Pickedup
                  </option>
                  <option value='delivered' className='options'>
                    Delivered
                  </option>
                  <option value='cancelled' className='options'>
                    Cancelled
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
                <div
                  className='overflow-scroll'
                  style={{ height: "calc(100vh - 147px)" }}
                >
                  <ul className='list-group list-group-flush'>
                    {listData?.map((data) => {
                      return (
                        <li
                          className='list-group-item p-1 orderList'
                          key={data.code}
                          onClick={() => setOrderId(data.code)}
                        >
                          <div className='d-flex my-1 justify-content-between align-items-center'>
                            <div>
                              <span>
                                <b>
                                  <span
                                    className='text-capitalize'
                                    style={{ fontSize: "12px" }}
                                  >
                                    {data?.orderFrom}
                                  </span>
                                </b>
                              </span>
                              <b className='mx-1'>Order #{data.orderCode}</b>
                            </div>
                            <div>
                              <b className='mx-3 text-dark'>
                                $ {data.grandTotal}
                              </b>
                            </div>
                            {data?.deliveryType === "pickup" ? (
                              <div className='d-flex flex-wrap'>
                                {" "}
                                {data?.orderStatus !== "cancelled" &&
                                  data?.orderStatus === "placed" ? (
                                  <div className='d-flex  my-1 justify-content-end '>
                                    <span
                                      className='mx-2 py-2 badge bg-secondary'
                                      style={{ fontSize: "12px" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange({
                                          orderCode: data.code,
                                          orderCurrentStatus: data.orderStatus,
                                          orderStatus: "pickedup",
                                        });
                                      }}
                                    >
                                      Pickedup
                                    </span>
                                  </div>
                                ) : null}
                                {data?.orderStatus !== "cancelled" &&
                                  data?.orderStatus !== "delivered" &&
                                  data?.orderStatus === "placed" ? (
                                  <div className='d-flex my-1 justify-content-end'>
                                    <span
                                      className='mx-2 py-2 badge bg-danger'
                                      style={{ fontSize: "12px" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange({
                                          orderCode: data.code,
                                          orderCurrentStatus: data.orderStatus,
                                          orderStatus: "cancelled",
                                        });
                                      }}
                                    >
                                      Cancel
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            ) : (
                              <div className='d-flex flex-wrap'>
                                {data.orderStatus === "placed" && (
                                  <div className='d-flex  my-1 justify-content-end '>
                                    <span
                                      className='mx-2 py-2 badge bg-secondary'
                                      style={{ fontSize: "12px" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange({
                                          orderCode: data.code,
                                          orderType: data.deliveryType,
                                          orderCurrentStatus: data.orderStatus,
                                          orderStatus: "shipping",
                                        });
                                      }}
                                    >
                                      Shipping
                                    </span>
                                  </div>
                                )}
                                {data.orderStatus === "shipping" && (
                                  <div className='d-flex my-1 justify-content-end'>
                                    <span
                                      className='mx-2 py-2 badge bg-success'
                                      style={{ fontSize: "12px" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange({
                                          orderCode: data.code,
                                          orderCurrentStatus: data.orderStatus,
                                          orderStatus: "delivered",
                                        });
                                      }}
                                    >
                                      Delivered
                                    </span>
                                  </div>
                                )}
                                {data.orderStatus === "placed" ? (
                                  <div className='d-flex my-1 justify-content-end'>
                                    <span
                                      className='mx-2  py-2 badge bg-danger'
                                      style={{ fontSize: "12px" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange({
                                          orderCode: data.code,
                                          orderCurrentStatus: data.orderStatus,
                                          orderStatus: "cancelled",
                                        });
                                      }}
                                    >
                                      Cancel
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                          <div className='d-flex justify-content-between'>
                            <div className='d-flex px-1 my-1 justify-content-start'>
                              <span>
                                <i class='fa fa-user' aria-hidden='true'></i>
                              </span>
                              <span className='mx-3'>{data.customerName}</span>
                            </div>
                            <div className='d-flex px-2 my-1 justify-content-between'>
                              <span className='px-3'>
                                <i
                                  class='fa fa-phone mx-2'
                                  aria-hidden='true'
                                  style={{ fontSize: "14px" }}
                                ></i>
                                <span className='' style={{ fontSize: "14px" }}>
                                  {data.mobileNumber}
                                </span>
                              </span>
                              <span className='px-3'>
                                <i class='' aria-hidden='true'></i>
                                <strong
                                  className='text-capitalize'
                                  style={{ fontSize: "14px" }}
                                >
                                  {data.orderStatus}
                                </strong>
                              </span>
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
          {orderDetail && (
            <div
              className='col-lg-8 overflow-scroll'
              style={{ height: "calc(100vh - 96px)" }}
            >
              <div
                className=' p-4 rounded '
                style={{ backgroundColor: "#ff8c0021" }}
              >
                <div className='col-12 d-flex justify-content-between my-3'>
                  <div className='col-6 h5'>Order Details</div>

                  <div className=' d-flex pe-4'>
                    {orderDetail?.deliveryType === "delivery" && (
                      <button
                        className='btn text-white mx-3'
                        style={{ backgroundColor: "#ff8c00" }}
                        data-bs-toggle='modal'
                        data-bs-target='#exampleModal'
                      >
                        Change Delivery Person
                      </button>
                    )}
                    <ReactToPrint
                      trigger={() => (
                        <button
                          style={{ backgroundColor: "#ff8c00" }}
                          className='btn text-white mx-3'
                          onClick={() => { }}
                        >
                          Print
                        </button>
                      )}
                      content={() => printRef?.current}
                      onBeforePrint={() => { }}
                    ></ReactToPrint>
                  </div>
                </div>
                <div className='col-12 d-flex '>
                  <div className='col-4'>
                    <h6 className='py-2'>
                      Order No : {orderDetail?.orderCode}
                    </h6>
                    <h6 className='py-2'>
                      Phone No : {orderDetail?.mobileNumber}
                    </h6>
                    <h6 className='py-2'>Address : {orderDetail?.address}</h6>
                    <h6 className='py-2'>Postal Code : not received </h6>
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
                    {orderDetail?.deliveryType === "delivery" && (
                      <h6 className='py-2'>
                        Delivery Executive :{" "}
                        {orderDetail?.deliveryExecutiveName}
                      </h6>
                    )}
                  </div>
                  <div className='col-4'>
                    <h6 className='py-2'>Type : {orderDetail?.orderFrom}</h6>
                  </div>
                </div>

                <div className='col-12'>
                  <h5>Product Details :</h5>
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
                      const objectToArray = Object.entries(order?.config).map(
                        ([key, value]) => ({ key, value })
                      );
                      return (
                        <tr key={index + order?.productName}>
                          <td scope='row'>{index + 1}</td>
                          <td className='text-capitalize'>
                            {order.productName}
                            {objectToArray?.map((item, index) => {
                              if (item.key === "sidesSize") {
                                return <p className='m-0'>{item.value}</p>;
                              }
                              if (item?.key === "pizza") {
                                return (
                                  <>
                                    <p className='m-0'>
                                      {item.key} ({order?.pizzaSize})
                                    </p>
                                    <PizzaDetails pizzaData={item} />
                                  </>
                                );
                              }
                              if (item.key === "dips") {
                                return item?.value.length > 0 ? (
                                  <span>
                                    <strong> {item.key}</strong> :
                                    {item?.value.map((dips, index) => (
                                      <span className='text-capitalize'>
                                        {dips.dipsName}{" "}
                                        {item.value.length - 1 === index
                                          ? ""
                                          : ","}
                                      </span>
                                    ))}
                                  </span>
                                ) : null;
                              }
                              // if (item.key === "drinks") {
                              //   return item?.value.length > 0 ? (
                              //     <span>
                              //       <strong> {item.key}</strong> :
                              //       {item?.value.map((drinks, index) => (
                              //         <span className='text-capitalize'>
                              //           {drinks.drinksName}{" "}
                              //           {item.value.length - 1 === index
                              //             ? ""
                              //             : ","}
                              //         </span>
                              //       ))}
                              //     </span>
                              //   ) : null;
                              // }
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
                      <td>
                        {" "}
                        $ {orderDetail?.subTotal - orderDetail?.discountmount}
                      </td>
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
                      <td>$ {orderDetail?.taxAmount} </td>
                    </tr>
                    {orderDetail?.deliveryType === "delivery" && (
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <th>Delivery Charges:</th>
                        <td>$ {orderDetail?.deliveryCharges}</td>
                      </tr>
                    )}
                    {Number(orderDetail?.extraDeliveryCharges) > 0 ? (
                      <p className='m-0 p-0'>
                        Extra Delivery Charges : ${" "}
                        {Number(orderDetail?.extraDeliveryCharges)}
                      </p>
                    ) : null}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Grand Total :</th>
                      <td>$ {orderDetail?.grandTotal}</td>
                    </tr>
                  </tbody>
                </table>
                <Print printRef={printRef} orderDetail={orderDetail} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        class='modal fade'
        id='exampleModal'
        tabindex='-1'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div class='modal-dialog modal-dialog-centered'>
          <div class='modal-content'>
            <div class='modal-header'>
              <h5 class='modal-title'>Change Delivery Executive</h5>
              <button
                type='button'
                class='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div class='modal-body'>
              <select
                class='form-select form-select-sm'
                aria-label='.form-select-sm example'
                value={updatedDeliveryExecutive?.code}
                onChange={(e) => handleDeliveryExecutiveChange(e.target.value)}
              >
                <option selected value={""}>
                  Choose Delivery Executive
                </option>
                {allDeliveryExecutiveData?.map((executive) => {
                  return (
                    <option value={executive?.code} key={executive?.code}>
                      {executive.firstName} {executive.lastName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div class='modal-footer'>
              <button
                type='button'
                class='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Close
              </button>
              <button
                type='button'
                style={{ backgroundColor: "#ff8c00" }}
                class='btn text-white'
                data-bs-dismiss='modal'
                onClick={updateDeliveryExecutive}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div
        class='modal fade'
        id='exampleModalStatus'
        tabindex='-1'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div class='modal-dialog modal-dialog-centered'>
          <div class='modal-content'>
            <div class='modal-header'>
              <h5 class='modal-title'>Change Order Status</h5>
              <button
                type='button'
                class='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div class='modal-body'>
              <select
                class='form-select form-select-sm'
                aria-label='.form-select-sm example'
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <option selected value={""}>
                  Choose Order Status
                </option>
                <option value='pickedup'>Pickedup</option>
                <option value='completed'>Completed</option>
                <option value='cancelled'>Cancelled</option>
              </select>
            </div>
            <div class='modal-footer'>
              <button
                type='button'
                class='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Close
              </button>
              <button
                type='button'
                style={{ backgroundColor: "#ff8c00" }}
                class='btn text-white'
                data-bs-dismiss='modal'
                onClick={handleStatusChange}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div> */}
      <ToastContainer position='top-center' />
    </>
  );
}
export const PizzaDetails = ({ pizzaData, productType }) => {
  return (
    <div>
      {
        pizzaData.value.map((ele, index) => (
          <div key={index}>
            {/* <p className='p-0 m-0 fw-bold'>Pizza {index + 1}</p> */}
            {
              productType === "custom_pizza" ? "" : <p className='p-0 m-0 fw-bold'>Next Pizza</p>
            }
            {ele?.cheese?.cheeseName !== "Mozzarella" && (
              <p className='p-0 m-0'>
                <strong>Cheese :</strong> {ele?.cheese?.cheeseName}
              </p>
            )}
            {ele?.crust?.crustName !== "Regular" && (
              <p className='p-0 m-0'>
                <strong>Crust :</strong> {ele?.crust?.crustName}
              </p>
            )}
            {ele?.specialbases?.specialbaseName !== undefined && (
              <p className='p-0 m-0'>
                <strong>Specialbases :</strong>{" "}
                {ele?.specialbases?.specialbaseName}
              </p>
            )}
            <p className='p-0 m-0'>
              <strong>Toppings :</strong>
            </p>
            <ToppingsList toppingsData={ele.toppings} />
          </div>
        ))}
    </div>
  );
};
export const ToppingsList = ({ toppingsData }) => {
  return (
    <div>
      {renderToppingsList(toppingsData.countAsTwoToppings, "1")}

      {renderToppingsList(toppingsData.countAsOneToppings, "2")}

      {renderToppingsList(toppingsData.freeToppings, "")}
    </div>
  );

  function renderToppingsList(toppingsList, countAs) {
    return (
      <div>
        {toppingsList.map((topping, index) => (
          <div className='row'>
            <div className='col-7 text-capitalize' key={index}>
              {topping.toppingsName} (
              {topping.toppingsPlacement === "whole"
                ? "W"
                : topping.toppingsPlacement === "lefthalf"
                  ? "L"
                  : topping.toppingsPlacement === "1/4"
                    ? "1/4"
                    : "R"}
              ) {countAs === "2" && "(2)"}
              {index === toppingsList.length - 1 ? "" : ","}{" "}
              {topping.price === undefined || topping.price === "0.00"
                ? ""
                : `$ ${topping.price}`}
            </div>
            <div className="col-3 text-end">
              {topping.toppingsPrice === undefined ||
                topping.toppingsPrice === "0.00"
                ? ""
                : `$ ${topping.toppingsPrice}`}
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default Order;
