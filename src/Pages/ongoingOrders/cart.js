import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../reducer/cartReducer";

const Cart = ({ payloadEdit, setPayloadEdit, cartRef, onProductClick }) => {
  const dispatch = useDispatch();

  const [cartListData, setCartListData] = useState();
  // let cart = [];
  let cartdata = useSelector((state) => state.cart.cart);
  // cart = [...cart, cartdata];

  const deleteItemFromCart = (ind) => {
    console.log(ind, "payloadEdit");
    let tmp = [...cartListData];
    tmp.splice(ind, 1);
    // let cartdata = cartListData.filter((item) => item.id !== deleteItemId);
    console.log(cartdata, "payloadEdit");
    dispatch(addToCart([...tmp]));
    toast.error("Item deleted successfully");
  };

  useEffect(() => {
    console.log("cartdata", cartdata);
    setCartListData(cartdata);
  }, [cartdata]);

  return (
    <>
      <div>
        {cartdata?.map((data, index) => {
          return (
            <div key={data.cartCode + index}>
              <div className='d-flex justify-content-between'>
                <h6>{data.productName}</h6>
                <span className='mx-0'>${data.amount}</span>
              </div>
              <div className='d-flex justify-content-between'>
                <div className='d-flex justify-content-left'>
                  <h6>Size : </h6>
                  <span className='mx-1'>
                    {data.productType === "side"
                      ? data.config.sidesSize
                      : data.pizzaSize}
                  </span>
                </div>
                <div className='d-flex justify-content-right mx-0 mb-1'>
                  <h6 className='mx-2'>Quantity : </h6>
                  <span className=''>{data.quantity}</span>
                </div>
              </div>
              <div className='d-flex align-items-center'>
                <button
                  className='btn m-0 p-0'
                  onClick={() => deleteItemFromCart(index)}
                  type='button'
                >
                  <i
                    className='fa fa-trash-o'
                    aria-hidden='true'
                    style={{ fontSize: "1.1rem", color: "#ff5555" }}
                  ></i>
                </button>
                <button type='button' className='btn m-0 p-0 mx-3'>
                  <i
                    className='fa fa-pencil-square-o'
                    aria-hidden='true'
                    style={{ fontSize: "1.1rem", color: "#7a3ee7" }}
                    onClick={
                      () => {
                        console.log(
                          cartdata[index].productType,
                          "clickedProductType"
                        );

                        setPayloadEdit(cartdata[index]);
                        onProductClick(cartdata[index].productType);
                      }
                      // handleEditCartItem(e, data.code, cartListData?.code)
                    }
                  ></i>
                </button>
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
