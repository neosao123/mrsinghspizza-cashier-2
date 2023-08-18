import React from "react";
import { PizzaDetails, ToppingsList } from "./Order";
import { useSelector } from "react-redux";

const Print = ({ orderDetail, printRef }) => {
  // let orderDetail = useSelector((state) => state.cart.orderDetail);
  // console.log(orderDetail, "placed order res print orderdetail");

  return (
    <div className='d-none'>
      <div className='col-12 m-1' style={{ width: "498px" }} ref={printRef}>
        <div className='row'>
          <h3 className='text-center'>Mr Singh's Pizza</h3>
          <p className='text-center'>
            2120 N Park Dr Unit #25, Brampton, ON L6S 0C9{" "}
          </p>
          <p className='text-center'>905-500-4000</p>
        </div>
        <div className='row d-flex mx-1'>
          {/* <div className='d-flex justify-content-between'>
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
          </div> */}
          <div>{orderDetail?.cashierName}</div>
        </div>
        <div className='d-flex col-12 row mx-1'>
          <div className='col-1'>Qty</div>
          <div className='col-8'>Item</div>
          <div className='col-3 text-end '>Amount</div>
          {orderDetail?.orderItems?.map((order, index) => {
            const objectToArray = Object.entries(order?.config).map(
              ([key, value]) => ({ key, value })
            );
            return (
              <p key={index + order?.productName} className='d-flex m-0  '>
                <div className='col-1'>
                  <p className='m-0'>{order.quantity}</p>
                </div>
                <div className='col-8'>
                  {order.productName}
                  {objectToArray?.map((item, index) => {
                    if (item?.key === "pizza") {
                      return (
                        <>
                          <p className='m-0'>{item.key}</p>
                          <PizzaDetails pizzaData={item} />
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
        <div className='d-flex col-12 row mx-1 text-end'>
          <div className='col-12'>
            <p>Sub Total : $ {orderDetail?.subTotal}</p>
            <p>Delivery Charges : $ {orderDetail?.deliveryCharges}</p>
            <p>Grand Total : $ {orderDetail?.grandTotal}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Print;
