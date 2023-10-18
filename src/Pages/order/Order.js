import React, { useEffect, useRef, useState } from "react";
import Nav from "../../layout/Nav";
import "../../css/orders.css";
import ReactToPrint from "react-to-print";
import {
  allDeliveryExecutiveApi,
  changeDeliveryExecutive,
  deliveryTypeChange,
  orderDetails,
  orderListApi,
  statusChange,
} from "../../API/order";
import { ToastContainer, toast } from "react-toastify";
import Print from "./Print";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../reducer/cartReducer";
import { storeLocationApi } from "../../API/ongoingOrder";

const sideTypeArr = ["poutine", "subs"];

function Order() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
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

  const [deliveryExecutive, setDeliveryExecutive] = useState();
  const [deliveryAddress, setDeliveryAddress] = useState();
  const [storeLocationData, setStoreLocationData] = useState();
  const [teleStore, setTeleStore] = useState();

  const user = useSelector((state) => state.user.userData);

  const orderList = async () => {
    let cashierCode = localStorage.getItem("cashierCode");
    const payload = {
      cashierCode: cashierCode,
      orderFrom: orderFrom,
      orderStatus: orderByStatus,
      storeLocation:
        user?.role === "R_4" ? teleStore ?? "" : user?.storeLocation,
      role: user?.role,
    };
    orderListApi(payload)
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

  const handleDeliveryExecutive = (e) => {
    setDeliveryExecutive(e.target.value);
  };

  const handleChangeDeliveryType = async (e) => {
    try {
      const payload = {
        orderCode: orderDetail?.code,
        address: orderDetail?.deliveryType === "pickup" ? deliveryAddress : "",
        deliveryExecutiveCode:
          orderDetail?.deliveryType === "pickup" ? deliveryExecutive : "",
      };
      // console.log("address change type : ", payload);
      await deliveryTypeChange(payload)
        .then((res) => {
          toast.success(res.data.message);
          getOrderDetailsApi();
          orderList();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    } catch (err) {
      toast.error(err);
    }
  };

  const getStoreLocation = async () => {
    await storeLocationApi()
      .then((res) => {
        setStoreLocationData(res.data.data);
      })
      .catch((err) => {
        toast.error(err?.response?.data.message);
      });
  };

  const getAllDeliveryExecutive = async () => {
    await allDeliveryExecutiveApi()
      .then((res) => {
        setAllDeliveryExecutiveData(res.data.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {}, [orderDetail]);

  useEffect(() => {
    if (orderId !== undefined) {
      getOrderDetailsApi();
    }
  }, [orderId]);

  useEffect(() => {
    orderList();
    setOrderDetail();
    getAllDeliveryExecutive();
    getStoreLocation();
    // setOrderByStatus("");
  }, [orderFrom, orderByStatus, teleStore]);

  return (
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 p-0   text-center main">
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
                <select
                  className="form-select px-4 py-2 orderType-selection"
                  onChange={(e) => setOrderByStatus(e.target.value)}
                >
                  <option value="">--Filter Orders By Status --</option>
                  <option value="">All</option>
                  <option value="pickedup" className="options">
                    Pickedup
                  </option>
                  <option value="delivered" className="options">
                    Delivered
                  </option>
                  <option value="cancelled" className="options">
                    Cancelled
                  </option>
                </select>

                {user?.role === "R_4" && (
                  <select
                    className="form-select px-4 py-2 orderType-selection"
                    onChange={(e) => setTeleStore(e.target.value)}
                  >
                    <option value="">
                      --Filter Orders By Store Location --
                    </option>
                    {storeLocationData?.map((data) => {
                      return (
                        <option value={data?.code}>
                          {data?.storeLocation}
                        </option>
                      );
                    })}
                  </select>
                )}
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
                  className="overflow-scroll"
                  style={{ height: "calc(100vh - 147px)" }}
                >
                  <ul className="list-group list-group-flush">
                    {listData?.map((data) => {
                      return (
                        <li
                          className="list-group-item p-1 orderList"
                          key={data.code}
                          onClick={() => setOrderId(data.code)}
                        >
                          <div className="d-flex my-1 justify-content-between align-items-center">
                            <div>
                              <div style={{ textAlign: "left" }}>
                                <span>
                                  <b>
                                    <span
                                      className="text-capitalize"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {data?.orderFrom}
                                    </span>
                                  </b>
                                </span>
                                <b className="mx-1">Order #{data.orderCode}</b>
                              </div>
                              <div className="store-highlight">
                                {data?.storeName}
                              </div>
                            </div>

                            <div>
                              <b className="mx-3 text-dark">
                                $ {data.grandTotal}
                              </b>
                            </div>
                            {data?.deliveryType === "pickup" ? (
                              <div className="d-flex flex-wrap">
                                {" "}
                                {data?.orderStatus !== "cancelled" &&
                                data?.orderStatus === "placed" ? (
                                  <div className="d-flex  my-1 justify-content-end ">
                                    <span
                                      className="mx-2 py-2 badge bg-secondary"
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
                                  <div className="d-flex my-1 justify-content-end">
                                    <span
                                      className="mx-2 py-2 badge bg-danger"
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
                              <div className="d-flex flex-wrap">
                                {data.orderStatus === "placed" && (
                                  <div className="d-flex  my-1 justify-content-end ">
                                    <span
                                      className="mx-2 py-2 badge bg-secondary"
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
                                  <div className="d-flex my-1 justify-content-end">
                                    <span
                                      className="mx-2 py-2 badge bg-success"
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
                                  <div className="d-flex my-1 justify-content-end">
                                    <span
                                      className="mx-2  py-2 badge bg-danger"
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
                          <div className="d-flex justify-content-between">
                            <div className="d-flex px-1 my-1 justify-content-start">
                              <span>
                                <i class="fa fa-user" aria-hidden="true"></i>
                              </span>
                              <span className="mx-3">{data.customerName}</span>
                            </div>
                            <div className="d-flex px-2 my-1 justify-content-between">
                              <span className="px-3">
                                <i
                                  class="fa fa-phone mx-2"
                                  aria-hidden="true"
                                  style={{ fontSize: "14px" }}
                                ></i>
                                <span className="" style={{ fontSize: "14px" }}>
                                  {data.mobileNumber}
                                </span>
                              </span>
                              <span className="px-3">
                                <i class="" aria-hidden="true"></i>
                                <strong
                                  className="text-capitalize"
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
              className="col-lg-8 overflow-scroll"
              style={{ height: "calc(100vh - 96px)" }}
            >
              <div
                className=" p-4 rounded "
                style={{ backgroundColor: "#ff8c0021" }}
              >
                <div className="col-12 d-flex justify-content-between my-3">
                  <div className="col-6 h5">Order Details</div>

                  <div className=" d-flex pe-4">
                    {orderDetail?.deliveryType === "delivery" && (
                      <button
                        className="btn text-white mx-3"
                        style={{ backgroundColor: "#ff8c00" }}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Change Delivery Person
                      </button>
                    )}
                    <ReactToPrint
                      trigger={() => (
                        <button
                          style={{ backgroundColor: "#ff8c00" }}
                          className="btn text-white mx-3"
                          onClick={() => {}}
                        >
                          Print
                        </button>
                      )}
                      content={() => printRef?.current}
                      onBeforePrint={() => {}}
                    ></ReactToPrint>
                    <button
                      className="btn text-white mx-3"
                      style={{ backgroundColor: "#ff8c00" }}
                      onClick={() => {
                        dispatch(addToCart(orderDetail?.orderItems));
                        navigate("/ongoing-orders");
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {orderDetail?.isDeliveryTypeChange !== "1" &&
                  orderDetail?.orderStatus === "placed" && (
                    <>
                      <div className="col-12 text-end mb-3">
                        <button
                          className="btn text-white"
                          style={{ backgroundColor: "#ff8c00" }}
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal1"
                        >
                          Change Delivery Type
                        </button>
                      </div>
                    </>
                  )}
                <div className="col-12 d-flex ">
                  <div className="col-4">
                    <h6 className="mb-2">
                      Order No : {orderDetail?.orderCode}
                    </h6>
                    <h6 className="mb-2">
                      Phone No : {orderDetail?.mobileNumber}
                    </h6>
                    <h6 className="mb-2 pe-3">
                      Address : {orderDetail?.address}
                    </h6>
                    <h6 className="mb-2">
                      Postal Code : {orderDetail?.zipCode}{" "}
                    </h6>
                    <h6 className="mb-2">
                      Delivery Type : {orderDetail?.deliveryType.toUpperCase()}
                    </h6>
                  </div>
                  <div className="col-4 text-left">
                    <h6 className="mb-2">
                      Date :{" "}
                      {moment(orderDetail?.created_at).format(
                        "DD-MM-YYYY hh:mm A"
                      )}
                    </h6>
                    <h6 className="mb-2">Name : {orderDetail?.customerName}</h6>
                    <h6 className="mb-2">
                      Store Location : {orderDetail?.storeLocation}
                    </h6>
                    {orderDetail?.deliveryType === "delivery" && (
                      <h6 className="mb-2">
                        Delivery Executive :{" "}
                        {orderDetail?.deliveryExecutiveName}
                      </h6>
                    )}
                  </div>
                  <div className="col-4">
                    <h6 className="mb-2">
                      Type : {orderDetail?.orderFrom.toUpperCase()}
                    </h6>
                  </div>
                </div>

                <div className="col-12">
                  <h5>Product Details :</h5>
                </div>

                <table class="table">
                  <tbody>
                    <tr>
                      <th scope="row">Sr No</th>
                      <th>Product </th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Amount</th>
                    </tr>
                    {orderDetail?.orderItems?.map((order, index) => {
                      console.log("order", order);
                      const objectToArray = Object.entries(order?.config).map(
                        ([key, value]) => ({ key, value })
                      );
                      return (
                        <tr key={index + order?.productName}>
                          <td scope="row">{index + 1}</td>
                          <td className="text-capitalize">
                            {order?.productType === "custom_pizza"
                              ? ""
                              : order.productName}
                            {objectToArray?.map((item, index) => {
                              if (item.key === "dips") {
                                return (
                                  <>
                                    {item?.value[0]?.dipsName !== undefined && (
                                      <>
                                        <strong
                                          className="m-0"
                                          style={{ color: "#191919" }}
                                        >
                                          Dips :
                                        </strong>
                                        <div className="col-12 text-capitalize">
                                          {item?.value?.map((dips, index) => {
                                            return (
                                              <>
                                                <div>
                                                  <div className="row">
                                                    <div
                                                      className="col-9 text-capitalize"
                                                      key={index}
                                                    >
                                                      {dips.dipsName}
                                                    </div>
                                                    {order?.productType !==
                                                      "special_pizza" && (
                                                      <div className="col-3 text-end me-0 pe-0">
                                                        {dips.dipsPrice !==
                                                        undefined
                                                          ? `$ ${dips?.dipsPrice}`
                                                          : null}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </>
                                            );
                                          })}
                                        </div>
                                      </>
                                    )}
                                  </>
                                );
                              }
                              if (item.key === "sides") {
                                // console.log(
                                //   item?.value,
                                // );
                                return (
                                  <>
                                    {item?.value[0]?.sidesName !== undefined ||
                                    item?.value[0]?.sideName !== undefined ? (
                                      <>
                                        <strong
                                          className="m-0"
                                          style={{ color: "#191919" }}
                                        >
                                          Sides :{" "}
                                        </strong>
                                        <div className="col-12 text-capitalize">
                                          {item?.value?.map((side, index) => {
                                            return (
                                              <>
                                                <div>
                                                  <div className="row">
                                                    <div
                                                      className="col-7 text-capitalize"
                                                      key={index}
                                                    >
                                                      {sideTypeArr.includes(
                                                        side?.sidesType
                                                      )
                                                        ? `(${side?.sidesType}) `
                                                        : ""}
                                                      {side?.sideName}
                                                      {side?.sideSize
                                                        ? ` (${side.sideSize})`
                                                        : ""}
                                                    </div>
                                                    {order?.productType !==
                                                      "special_pizza" && (
                                                      <div className="col-5 text-end">
                                                        {side?.totalPrice > 0
                                                          ? `$ ${side?.totalPrice}`
                                                          : null}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </>
                                            );
                                          })}
                                        </div>
                                      </>
                                    ) : null}
                                  </>
                                );
                              }
                              if (item?.key === "pizza") {
                                return (
                                  <>
                                    <p className="m-0 text-capitalize">
                                      {item.key} ({order?.pizzaSize})
                                    </p>
                                    <PizzaDetails
                                      pizzaData={item}
                                      productType={order?.productType.toLowerCase()}
                                    />
                                    <p className="m-0 text-capitalize fst-italic">
                                      Comment : {order?.comments}
                                    </p>
                                  </>
                                );
                              }
                              if (item.key === "drinks") {
                                console.log(item);
                                return (
                                  <>
                                    {order?.productType === "custom_pizza" ||
                                    order?.productType === "special_pizza"
                                      ? item?.value[0]?.drinksName !==
                                          undefined && (
                                          <>
                                            <strong
                                              className="m-0"
                                              style={{ color: "#191919" }}
                                            >
                                              Drinks :{" "}
                                            </strong>
                                            <div className="col-12 text-capitalize">
                                              {item.value?.map(
                                                (drink, index) => {
                                                  return (
                                                    <>
                                                      <div>
                                                        <div className="row">
                                                          <div
                                                            className="col-9 text-capitalize"
                                                            key={index}
                                                          >
                                                            {drink.drinksName}
                                                          </div>
                                                          {order?.productType !==
                                                            "Special_Pizza" && (
                                                            <div className="col-3 text-end">
                                                              $
                                                              {
                                                                drink.drinksPrice
                                                              }
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </>
                                        )
                                      : null}
                                  </>
                                );
                              }
                            })}
                          </td>
                          <td>{order.quantity}</td>
                          <td>{"$ " + order.price}</td>
                          <td>
                            {order?.productType === "custom_pizza" ||
                            order?.productType === "special_pizza"
                              ? "$ " + order?.pizzaPrice
                              : "$ " + order.amount}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Sub Total :</th>
                      <td>
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
                      <p className="m-0 p-0">
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
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Change Delivery Executive</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <select
                class="form-select form-select-sm"
                aria-label=".form-select-sm example"
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
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                style={{ backgroundColor: "#ff8c00" }}
                class="btn text-white"
                data-bs-dismiss="modal"
                onClick={updateDeliveryExecutive}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Delivery Type  */}
      <div
        class="modal fade"
        id="exampleModal1"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Change Delivery Type</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="mb-3">
                Order No:{" "}
                <strong className="mx-2">{orderDetail?.orderCode}</strong>
              </div>
              <div className="mb-3">
                Delivery Type:{" "}
                <strong className="mx-2">
                  {orderDetail?.deliveryType.toUpperCase()}
                </strong>
              </div>
              {orderDetail?.deliveryType === "pickup" && (
                <>
                  <textarea
                    className="form-control mb-3"
                    maxLength={50}
                    placeholder="Address to deliver your order"
                    required
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                    }}
                  />
                  <select
                    class="form-select form-select-sm"
                    aria-label=".form-select-sm example"
                    value={updatedDeliveryExecutive?.code}
                    onChange={(e) => {
                      handleDeliveryExecutive(e);
                    }}
                    required
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
                </>
              )}
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                style={{ backgroundColor: "#ff8c00" }}
                class="btn text-white"
                data-bs-dismiss="modal"
                onClick={handleChangeDeliveryType}
              >
                {orderDetail?.deliveryType === "pickup"
                  ? "Change Delivery Type -> Delivery"
                  : "Change Delivery Type -> Pickup"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}
export const PizzaDetails = ({ pizzaData, productType }) => {
  return (
    <div>
      {pizzaData.value.map((ele, index) => (
        <div key={index}>
          {productType === "special_pizza" && index > 0 ? (
            <p className="p-0 m-0 fw-bold mt-2" style={{ color: "#191919" }}>
              Next Pizza
            </p>
          ) : null}

          {ele?.toppings?.isAllIndiansTps === true && (
            <div className="row">
              <div className="col-9 text-capitalize">
                <strong style={{ color: "#191919" }}>Indian Style</strong>
              </div>
            </div>
          )}

          {ele?.cheese?.cheeseName !== "Mozzarella" && (
            <div className="row">
              <div className="col-9 text-capitalize pe-0" key={index}>
                <strong style={{ color: "#191919" }}>Cheese : </strong>

                {ele?.cheese?.cheeseName}
              </div>
              <div className="col-3 text-end m-0 p-0">
                {ele?.cheese?.price === undefined ||
                ele?.cheese?.price === "0.00"
                  ? ""
                  : `$ ${ele?.cheese?.price}`}
              </div>
            </div>
          )}
          {ele?.crust?.crustName !== "Regular" && (
            <div className="row">
              <div className="col-9 text-capitalize pe-0" key={index}>
                <strong style={{ color: "#191919" }}>Crust : </strong>
                {ele?.crust?.crustName}
              </div>
              <div className="col-3 text-end m-0 p-0">
                {ele?.crust?.crustPrice === undefined ||
                ele?.crust?.crustPrice === "0.00"
                  ? ""
                  : `$ ${ele?.crust?.crustPrice}`}
                {ele?.crust?.price === undefined || ele?.crust?.price === "0.00"
                  ? ""
                  : `$ ${ele?.crust?.price}`}
              </div>
            </div>
          )}

          {ele?.crustType?.crustType !== "Regular" && (
            <div className="row">
              <div className="col-9 text-capitalize pe-0" key={index}>
                <strong style={{ color: "#191919" }}>Crust Type : </strong>
                {ele?.crustType?.crustType}
              </div>
              <div className="col-3 text-end m-0 p-0">
                {ele?.crustType?.price === undefined ||
                ele?.crustType?.price === "0.00"
                  ? ""
                  : `$ ${ele?.crustType?.price}`}
              </div>
            </div>
          )}

          {ele?.specialBases?.specialbaseName !== undefined && (
            <div className="row pe-0">
              <div className="col-12 text-capitalize" key={index}>
                <div className="row pe-0">
                  <div className="col-9 pe-0">
                    <strong style={{ color: "#191919" }}>Spb : </strong>{" "}
                    <span>{ele?.specialBases?.specialbaseName}</span>
                  </div>
                  <div className="col-3 pe-0 text-end">
                    {ele?.specialBases?.price === undefined ||
                    ele?.specialBases?.price === "0.00"
                      ? ""
                      : `$ ${ele?.specialBases?.price}`}
                    {ele?.specialbases?.price === undefined ||
                    ele?.specialbases?.price === "0.00"
                      ? ""
                      : `$ ${ele?.specialbases?.price}`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {ele?.spicy?.spicy !== "Regular" && (
            <div className="row pe-0">
              <div className="col-12 text-capitalize" key={index}>
                <div className="row pe-0">
                  <div className="col-9 pe-0">
                    <strong style={{ color: "#191919" }}>Spicy : </strong>{" "}
                    <span>{ele?.spicy?.spicy}</span>
                  </div>
                  <div className="col-3 pe-0 text-end">
                    {ele?.spicy?.price === undefined ||
                    ele?.spicy?.price === "0.00"
                      ? ""
                      : `$ ${ele?.spicy?.price}`}
                  </div>
                </div>
              </div>
            </div>
          )}
          {ele?.sauce?.sauce !== "Regular" && (
            <div className="row pe-0">
              <div className="col-12 text-capitalize" key={index}>
                <div className="row pe-0">
                  <div className="col-9 pe-0">
                    <strong style={{ color: "#191919" }}>Sauce : </strong>{" "}
                    <span>{ele?.sauce?.sauce}</span>
                  </div>
                  <div className="col-3 pe-0 text-end">
                    {ele?.sauce?.price === undefined ||
                    ele?.sauce?.price === "0.00"
                      ? ""
                      : `$ ${ele?.sauce?.price}`}
                  </div>
                </div>
              </div>
            </div>
          )}
          {ele?.cook?.cook !== "Regular" && (
            <div className="row pe-0">
              <div className="col-12 text-capitalize" key={index}>
                <div className="row pe-0">
                  <div className="col-9 pe-0">
                    <strong style={{ color: "#191919" }}>Cook : </strong>{" "}
                    <span>{ele?.cook?.cook}</span>
                  </div>
                  <div className="col-3 pe-0 text-end">
                    {ele?.cook?.price === undefined ||
                    ele?.cook?.price === "0.00"
                      ? ""
                      : `$ ${ele?.cook?.price}`}
                  </div>
                </div>
              </div>
            </div>
          )}
          {ele.toppings.length > 0 && (
            <p className="p-0 m-0">
              <strong style={{ color: "#191919" }}>Toppings :</strong>
            </p>
          )}
          <ToppingsList toppingsData={ele.toppings} />
        </div>
      ))}
    </div>
  );
};
export const ToppingsList = ({ toppingsData }) => {
  return (
    <div>
      {renderToppingsList(toppingsData.countAsTwoToppings, "2")}

      {renderToppingsList(toppingsData.countAsOneToppings, "1")}

      {renderToppingsList(toppingsData.freeToppings, "")}
    </div>
  );

  function renderToppingsList(toppingsList, countAs) {
    if (countAs === "" && toppingsData?.isAllIndiansTps === true) {
      return <div></div>;
    } else {
      return (
        <div>
          {toppingsList?.map((topping, index) => {
            const keyToCheck = "amount";
            const keyExists = topping.hasOwnProperty(keyToCheck);
            return (
              <div className="row">
                {/* <div>{topping}</div> */}
                <div className="col-9 text-capitalize pe-0" key={index}>
                  {countAs === "2" && "(2) "}
                  {topping.toppingsName}
                  <span className="fw-bold">
                    {topping.toppingsPlacement === "lefthalf" && " (L)"}
                    {topping.toppingsPlacement === "righthalf" && " (R)"}
                    {topping.toppingsPlacement === "1/4" && " (1/4)"}
                  </span>
                </div>
                {/* {console.log("topping :", topping, topping.amount)} */}
                <div className="col-3 text-end m-0 p-0">
                  {/* {topping.amount === undefined || topping.amount === 0
                  ? ""
                  : `$ ${topping.price}`} */}
                  {/* {countAs === ""
                    ? ""
                    : keyExists
                      ? "$ " + Number(topping?.amount).toFixed(2)
                      : "$ " + topping?.toppingsPrice} */}
                  {topping.amount === undefined || Number(topping.amount) === 0
                    ? ""
                    : "$ " + Number(topping.amount).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  }
};

export default Order;
