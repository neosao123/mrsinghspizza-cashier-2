import React from "react";
import { PizzaDetails, ToppingsList } from "./Order";
import { useSelector } from "react-redux";
import Barcode from "../../assets/Barcode.jpg";
import Logo from "../../assets/logo.png";

const Print = ({ orderDetail, printRef }) => {
  return (
    <div className='d-none'>
      <div className='col-12 m-1' style={{ width: "273px" }} ref={printRef}>
        <div className='row'>
          <div className='d-flex justify-content-center'>
            <img
              src={Logo}
              alt="Mr Singh's pizza logo"
              width={"30px"}
              height={"30px"}
              className='m-1'
            ></img>
            <div className='d-flex flex-column'>
              <h3 className='text-center m-0 '>Mr Singh's Pizza</h3>
              <p className='text-center m-0 p-0'>Pure vegetarian</p>
            </div>
          </div>
          <p className='text-center mb-0'>
            2120 N Park Dr Unit #25, Brampton, ON L6S 0C9{" "}
          </p>
          <p className='text-center mb-1'>905-500-4000</p>
        </div>
        <div className='row'>
          {orderDetail?.created_at !== undefined && (
            <>
              <div className='d-flex justify-content-between'>
                <p className='m-0'></p>
                <p className='m-0'>#{orderDetail?.orderCode}</p>
              </div>
              <div className='d-flex justify-content-between'>
                <p className='m-0'>
                  {" "}
                  Date :{" "}
                  {
                    new Date(orderDetail?.created_at)
                      .toISOString()
                      .replace(/T/, " ")
                      .replace(/\.\d+Z$/, "")
                      .split(" ")[0]
                  }
                </p>
                <p className='m-0'>
                  Time :{" "}
                  {
                    new Date(orderDetail?.created_at)
                      .toISOString()
                      .replace(/T/, " ")
                      .replace(/\.\d+Z$/, "")
                      .split(" ")[1]
                  }
                </p>
              </div>
              <div className='d-flex justify-content-between'>
                <p className='m-0'>
                  {orderDetail?.customerName} - Ph. {orderDetail?.mobileNumber}
                </p>
                <p className='m-0 fw-bold text-capitalize'>
                  {orderDetail?.deliveryType}
                </p>
              </div>
            </>
          )}
          <div className='d-flex'>
            <p className='p-0 m-0 col-6'>
              OrderTakenBy: {orderDetail?.cashierName}
            </p>
            {orderDetail?.deliveryType === "delivery" && (
              <span className='col-6 text-end'>
                Delivery Executive : {orderDetail?.deliveryExecutiveName}
              </span>
            )}
          </div>
        </div>
        <div className='row'>
          <div className='col-2 text-secondary'>Qty</div>
          <div className='col-7 text-secondary'>Item</div>
          <div className='col-3 text-secondary text-end'>Amount</div>
        </div>

        {orderDetail?.orderItems?.map((order, index) => {
          const product_type = order.productType;
          const objectToArray = Object.entries(order?.config).map(
            ([key, value]) => ({ key, value })
          );
          return (
            <div className='row' key={index + order?.productName}>
              <div className='col-2'>
                <span className='m-0'>{order.quantity}</span>
              </div>
              <div className='col-10'>
                <div className='row g-0'>
                  <div className='col-9'>
                    {product_type === "custom_pizza" ? "" : order.productName}
                  </div>
                  <div className='col-3 text-end '>$ {order.amount}</div>
                </div>
              </div>
              {objectToArray?.map((item, index) => {
                if (item.key === "dips") {
                  return (
                    <>
                      {item?.value[0]?.dipsName !== undefined && (
                        <div className="row">
                          <div className='col-2'> </div>
                          <div className="col-10">
                            <strong className='m-0' style={{ color: "#717171" }}>
                              Dips :{" "}
                            </strong>
                            <div className='col-12 text-capitalize'>
                              {item?.value?.map((dips, index) => {
                                return (
                                  <>
                                    <div>
                                      <div className='row'>
                                        <div
                                          className='col-7 text-capitalize'
                                          key={index}
                                        >
                                          {dips.dipsName}
                                        </div>
                                        <div className='col-5 text-end'>
                                          $
                                          {dips.dipsPrice !== undefined
                                            ? dips.dipsPrice
                                            : dips?.price}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </div >
                        </div >
                      )}
                    </>
                  );
                }
                if (item.key === "sides") {
                  return (
                    <div className='row'>
                      <div className='col-2'> </div>
                      <div className="col-10">
                        <strong className='m-0' style={{ color: "#717171" }}>
                          Sides :{" "}
                        </strong>
                        <div className='col-12 text-capitalize'>
                          {item?.value?.map((side, index) => {
                            return (
                              <>
                                <div>
                                  <div className='row'>
                                    <div
                                      className='col-7 text-capitalize'
                                      key={index}
                                    >
                                      {side?.sidesName !== undefined
                                        ? side?.sidesName
                                        : null}
                                      {side?.sidesSize !== undefined
                                        ? side?.sidesSize
                                        : null}
                                      {side?.sideName} (
                                      {side?.lineEntries !== undefined &&
                                        side?.lineEntries[0]?.size}
                                      )
                                    </div>
                                    <div className='col-5 text-end'>
                                      $
                                      {side?.sidesPrice !== undefined
                                        ? side?.sidesPrice
                                        : side?.lineEntries !== undefined
                                          ? side?.lineEntries[0]?.price
                                          : null}
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                }
                if (item?.key === "pizza") {
                  return (
                    <div className='row'>
                      <div className='col-2'></div>
                      <div className='col-10'>
                        <p className='m-0 text-capitalize'>
                          {item.key} ({order?.pizzaSize})
                        </p>
                        <PizzaDetails
                          pizzaData={item}
                          productType={product_type}
                        />
                        <p className='m-0 text-capitalize fst-italic'>
                          Comment : {order?.comments}
                        </p>
                      </div>
                    </div>
                  );
                }
                if (item.key === "drinks") {
                  return (
                    <div className="row" style={{ padding: "0px !important" }}>

                      <div className='col-2'> </div>
                      <div className="col-10">
                        {product_type === "custom_pizza" ||
                          product_type === "Special_Pizza" ? (
                          <>
                            <strong className='m-0' style={{ color: "#717171" }}>
                              Drinks :{" "}
                            </strong>
                            <div className='col-12 text-capitalize'>
                              {item.value?.map((drink, index) => {
                                return (
                                  <>
                                    <div className="p-0" style={{ padding: "0px !important" }}>
                                      <div className='row p-0'>
                                        <div
                                          className='col-7 text-capitalize'
                                          key={index}
                                        >
                                          {drink.drinksName}
                                        </div>
                                        <div className='col-5 text-end'>
                                          ${drink.drinksPrice}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  );
                }
              })}
              <hr />
            </div>
          );
        })}
        <div className='row'>
          <div className='col-4 m-0'>
            <img
              src={Barcode}
              width={"100px"}
              height={"100px"}
              className='mt-1'
              alt=""
            />
          </div>
          <div className='col-8 text-end pe-1'>
            <p className='m-0 p-0'>Sub Total : $ {orderDetail?.subTotal}</p>
            <p className='m-0 p-0'>Tax : $ {orderDetail?.taxAmount}</p>
            {Number(orderDetail?.extraDeliveryCharges) > 0 ? (
              <p className='m-0 p-0'>
                Extra Delivery Charges : ${" "}
                {Number(orderDetail?.extraDeliveryCharges)}
              </p>
            ) : null}
            {orderDetail?.deliveryType === "delivery" && (
              <p className='m-0 p-0'>
                Delivery Charges:$ {orderDetail?.deliveryCharges}
              </p>
            )}
            <p className='m-0 p-0 fw-bold'>
              Grand Total : $ {orderDetail?.grandTotal}
            </p>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Print;
