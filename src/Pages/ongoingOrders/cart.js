import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../reducer/cartReducer";
import { v4 as uuidv4 } from "uuid";

const Cart = ({ setPayloadEdit, payloadEdit, onProductClick }) => {
  const dispatch = useDispatch();
  const [cartListData, setCartListData] = useState();
  let cartdata = useSelector((state) => state.cart.cart);
  const deleteItemFromCart = (ind) => {
    let tmp = [...cartListData];
    tmp.splice(ind, 1);
    dispatch(addToCart([...tmp]));
    toast.error("Item deleted successfully");
  };
  const duplicateItem = (item) => {
    console.log(item, "duplicate item");
    dispatch(addToCart([{ ...item, id: uuidv4() }, ...cartdata]));
  };
  useEffect(() => {
    setCartListData(cartdata);
  }, [cartdata]);
  const moveItemToTop = (item, index) => {
    let tempPayload = [...cartdata];
    let movedObject = tempPayload.splice(index, 1)[0];
    tempPayload.unshift(movedObject);
    dispatch(addToCart([...tempPayload]));
  };

  return (
    <>
      <div>
        {cartdata?.map((data, index) => {
          return (
            <div
              key={"cart-div-" + index}
              className='p-1'
              style={{
                borderRadius: "5px",
                scrollTop:
                  payloadEdit !== undefined && index === 0 ? "0" : null,
                borderColor:
                  payloadEdit !== undefined && index === 0
                    ? "rgb(22 22 22)"
                    : "",
                boxShadow:
                  payloadEdit !== undefined && index === 0
                    ? " rgb(167 142 73) 0px 0px 10px"
                    : "",
              }}
            >
              <div className='d-flex justify-content-between'>
                <h6>{data.productName}</h6>
                <span className='mx-0'>${data.amount}</span>
              </div>
              <div className='d-flex justify-content-between'>
                <div className='d-flex justify-content-left'>
                  {console.log(data, "product type")}
                  {data?.productType?.toLowerCase() === "drinks" ? (
                    <>
                      <h6>Drink Type : </h6>
                      <span className='mx-1'>{data?.config[0]}</span>
                    </>
                  ) : null}
                  {data?.productType?.toLowerCase() === "custom_pizza" ||
                  data?.productType?.toLowerCase() === "special_pizza" ? (
                    <>
                      <h6>Size: </h6>
                      <span className='mx-1'>{data.pizzaSize}</span>
                    </>
                  ) : data.productType === "side" ? (
                    <>
                      <h6>Size: </h6>
                      <span className='mx-1'>{data.config.sidesSize}</span>
                    </>
                  ) : null}
                </div>
                <div className='d-flex justify-content-right mx-0 mb-1'>
                  <h6 className='mx-2'>Quantity : </h6>
                  <span className=''>{data.quantity}</span>
                </div>
              </div>
              {data?.productType?.toLowerCase() === "special_pizza" ||
              data?.productType?.toLowerCase() === "custom_pizza" ? (
                <div className='row d-flex'>
                  <div className='d-flex justify-content-left'>
                    <h6 className='me-1 col-auto'>Toppings : </h6>
                    <span className='mx-1'>
                      {data?.config?.pizza?.map((pizza, index) => {
                        return (
                          <>
                            <p key={"pizza" + index} className='mb-1'>
                              Pizza {index + 1} :{" "}
                              {[
                                ...pizza?.toppings?.countAsOneToppings,
                                ...pizza?.toppings?.countAsTwoToppings,
                                ...pizza?.toppings?.freeToppings,
                              ]
                                .slice(0, 6)
                                .map((pizzaItem) => {
                                  return (
                                    <p
                                      key={pizzaItem.toppingsCode}
                                      className='d-inline-block m-0'
                                    >
                                      {pizzaItem?.toppingsName} ,
                                    </p>
                                  );
                                })}
                            </p>
                          </>
                        );
                      })}
                    </span>
                  </div>
                </div>
              ) : null}

              <div className='d-flex align-items-center'>
                <span
                  className='btn m-0 p-0'
                  onClick={() => deleteItemFromCart(index)}
                  type='button'
                >
                  <i
                    className='fa fa-trash-o'
                    aria-hidden='true'
                    style={{ fontSize: "1.1rem", color: "#ff5555" }}
                  ></i>
                </span>
                <span
                  className='btn  ms-3'
                  onClick={() => {
                    setPayloadEdit(cartdata[index]);
                    moveItemToTop(cartdata[index], index);
                    onProductClick(cartdata[index].productType);
                  }}
                >
                  <i
                    className='fa fa-pencil-square-o'
                    aria-hidden='true'
                    style={{ fontSize: "1.1rem", color: "#7a3ee7" }}
                  ></i>
                </span>
                <span
                  className='btn'
                  onClick={() => {
                    // setPayloadEdit(cartdata[index]);
                    duplicateItem(cartdata[index]);
                  }}
                >
                  <i
                    className='fa fa-copy'
                    aria-hidden='true'
                    style={{ fontSize: "1.1rem", color: "#7a3ee7" }}
                  ></i>
                </span>
              </div>
              <hr className='border border-2 my-2 divider'></hr>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Cart;
