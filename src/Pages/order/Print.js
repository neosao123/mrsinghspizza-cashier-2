import React from "react";
import { PizzaDetails, ToppingsList } from "./Order";
import { useSelector } from "react-redux";
import Barcode from "../../assets/Barcode.jpg";

const Print = ({ orderDetail, printRef }) => {
  // let orderDetail = useSelector((state) => state.cart.orderDetail);
  // console.log(orderDetail, "placed order res print orderdetail");

  return (
    <div className='d-none'>
      <div className='col-12 m-1' style={{ width: "273px" }} ref={printRef}>
        <div className='row'>
          <h3 className='text-center'>Mr Singh's Pizza</h3>
          <p className='text-center mb-0'>
            2120 N Park Dr Unit #25, Brampton, ON L6S 0C9{" "}
          </p>
          <p className='text-center mb-1'>905-500-4000</p>
        </div>
        <div className='row d-flex '>
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
          <div>{orderDetail?.cashierName}</div>
        </div>
        <div className='d-flex col-12 row mx-1'>
          <div className='col-2'>Qty</div>
          <div className='col-7'>Item</div>
          <div className='col-3 text-end '>Amount</div>
          {orderDetail?.orderItems?.map((order, index) => {
            const objectToArray = Object.entries(order?.config).map(
              ([key, value]) => ({ key, value })
            );
            return (
              <p key={index + order?.productName} className='d-flex m-0  '>
                <div className='col-2'>
                  <p className='m-0'>{order.quantity}</p>
                </div>
                <div className='col-7 text-capitalize'>
                  {order.productName}
                  {objectToArray?.map((item, index) => {
                    console.log(item, "printlist");
                    if (item.key === "sidesSize") {
                      return <p className='m-0'>{item.value}</p>;
                    }
                    if (item?.key === "pizza") {
                      return (
                        <>
                          <p className='m-0 text-capitalize'>{item.key}</p>
                          <PizzaDetails pizzaData={item} />
                          <p className='m-0 text-capitalize fst-italic'>
                            Comment : {order?.comments}
                          </p>
                        </>
                      );
                    }
                  })}
                </div>
                <div className='text-end col-3'>$ {order.amount}</div>

                <hr />
              </p>
            );
          })}
        </div>
        <div className='d-flex col-12 row  justify-content-between'>
          <div className='col-4 px-1 m-0'>
            <img src={Barcode} width={"100px"} height={"100px"} />
          </div>
          {console.log(orderDetail, "orderDetail prinmt")}
          <div className='col-8 text-end p-0'>
            <p className='m-0 p-0'>Sub Total : $ {orderDetail?.subTotal}</p>

            <p className='m-0 p-0'>Tax : $ {orderDetail?.taxAmount}</p>
            {Number(orderDetail?.extraDeliveryCharges) > 0 ? (
              <p className='m-0 p-0'>
                Extra Delivery Charges : ${" "}
                {Number(orderDetail?.extraDeliveryCharges)}
              </p>
            ) : null}
            {orderDetail?.deliveryType === "delivery" && (
              <p className='m-0 p-0 fw-bold'>
                Delivery Charges:$ {orderDetail?.deliveryCharges}
              </p>
            )}
            <p className='m-0 p-0 fw-bold'>
              Grand Total : $ {orderDetail?.grandTotal}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Print;
