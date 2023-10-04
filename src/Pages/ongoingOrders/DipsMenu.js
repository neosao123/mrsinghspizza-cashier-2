import React, { useEffect, useState } from "react";
import { dipsApi } from "../../API/ongoingOrder";
import { toast } from "react-toastify";
import { addToCart } from "../../reducer/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addToCartAndResetQty } from "./dipsMenu/dipsMenuFunctions";

function DipsMenu({ discount, taxPer, setPayloadEdit, payloadEdit }) {
  const [dipsData, setDipsData] = useState();
  const [dipsArr, setDipsArr] = useState([]);
  let cartdata = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dips();
  }, []);

  // handle Quantity
  const handleQuantity = (e, dipsCode, data) => {
    const inputValue = e.target.value;
    if (parseInt(inputValue) < 1) {
      e.target.value = 1;
    } else if (parseInt(inputValue) > 100) {
      e.target.value = 100;
    }
    let itemToUpdate = dipsArr?.findIndex((item) => item.dipsCode === dipsCode);

    if (itemToUpdate !== -1) {
      let arr = [...dipsArr];
      arr[itemToUpdate] = {
        ...arr[itemToUpdate],
        qty: inputValue < 0 ? 1 : inputValue,
      };

      setDipsArr(arr);
    } else {
      setDipsArr([
        ...dipsArr,
        {
          ...data,
          qty: inputValue < 0 ? 1 : inputValue,
        },
      ]);
    }
  };

  //API - Dips Data
  const dips = () => {
    dipsApi()
      .then((res) => {
        setDipsData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From DipsMenu API: ", err);
      });
  };

  useEffect(() => {
    if (payloadEdit !== undefined && payloadEdit.productType === "dips") {
      console.log(payloadEdit, "payloadEdit");
      setDipsArr([
        ...dipsArr,
        {
          dipsCode: payloadEdit?.productCode,
          dipsName: payloadEdit?.productName,
          price: payloadEdit?.price,
          qty: payloadEdit?.quantity,
          comment: payloadEdit?.comments,
        },
      ]);
    }
  }, [payloadEdit]);
  useEffect(() => {
    console.log(dipsArr, "dipsArr");
  }, [dipsArr]);

  // Onclick Add To Cart - API Add To Cart
  const handleAddToCart = async (e, dipsitem) => {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem("CartData"));
    let cartCode;
    let customerCode;
    const selectedDips = dipsArr?.filter(
      (dips) => dips.dipsCode === dipsitem.dipsCode
    );

    // console.log(first);
    if (selectedDips.length === 0) {
      // config: {
      //   dips: dipsArr,
      // },
      const payload = {
        id: uuidv4(),
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: dipsitem?.dipsCode,
        productName: dipsitem?.dipsName,
        productType: "dips",
        config: {},
        quantity: 1,
        price: dipsitem?.price,
        amount: dipsitem?.price,
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: "",
      };

      addToCartAndResetQty(
        dispatch,
        addToCart,
        [...cartdata, payload],
        toast,
        setDipsArr,
        setDipsData,
        dipsData,
        [dipsitem],
        "Added Successfully"
      );
      return;
    }

    if (cart !== null && cart !== undefined) {
      cartCode = cart.cartCode;
      customerCode = cart.customerCode;
    }
    let price = selectedDips[0]?.price;
    let totalAmount = 0;

    totalAmount =
      Number(price) *
      (selectedDips[0]?.qty !== undefined ? Number(selectedDips[0]?.qty) : 1);

    if (payloadEdit !== undefined && payloadEdit.productType === "dips") {
      // config: {
      //   dips: dipsArr,
      // },
      const payloadForEdit = {
        id: payloadEdit?.id,
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: selectedDips[0].dipsCode,
        productName: selectedDips[0].dipsName,
        productType: "dips",
        config: {},
        quantity: selectedDips[0].qty ? selectedDips[0].qty : 1,
        price: selectedDips[0].price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: selectedDips[0].comment,
      };
      const updatedCart = cartdata.findIndex(
        (item) => item.id === payloadEdit.id
      );
      let tempPayload = [...cartdata];
      tempPayload[updatedCart] = payloadForEdit;
      addToCartAndResetQty(
        dispatch,
        addToCart,
        [...tempPayload],
        toast,
        setDipsArr,
        setDipsData,
        dipsData,
        selectedDips,
        "Updated Successfully"
      );

      setPayloadEdit();
    } else {
      // config: {
      //   dips: dipsArr,
      // },
      const payload = {
        id: uuidv4(),
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: selectedDips[0].dipsCode,
        productName: selectedDips[0].dipsName,
        productType: "dips",
        config: {},
        quantity: selectedDips[0].qty ? selectedDips[0].qty : 1,
        price: selectedDips[0].price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: selectedDips[0].comment,
      };
      console.log(selectedDips, "selected dips");
      addToCartAndResetQty(
        dispatch,
        addToCart,
        [...cartdata, payload],
        toast,
        setDipsArr,
        setDipsData,
        dipsData,
        selectedDips,
        "Added Successfully"
      );
    }
  };
  const handleComment = (e, data) => {
    let index = dipsArr?.findIndex((item) => item.dipsCode === data.dipsCode);

    let obj = dipsData.find((item) => item.dipsCode === data.dipsCode);
    if (index !== -1) {
      let arr = [...dipsArr];

      arr[index] = { ...arr[index], comment: e.target.value };
      setDipsArr(arr);
    } else {
      setDipsArr([{ ...obj, comment: e.target.value }]);
    }
  };

  return (
    <>
      <ul className='list-group'>
        {dipsData?.map((data) => {
          let obj = dipsArr?.find((item) => item.dipsCode === data.dipsCode);
          return (
            <li className='list-group-item' key={data.dipsCode}>
              <div className='d-flex justify-content-between align-items-end py-2'>
                <div className='d-flex justify-content-center w-auto'>
                  {/* <img
                    className='rounded'
                    src={data.image === "" ? `${specialImg1}` : data.image}
                    width='50px'
                    height='50px'
                    alt=''
                  ></img> */}
                </div>
                <div className='d-flex justify-content-center flex-column py-1 w-100'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <h6 className='mb-2'>{data.dipsName}</h6>
                    <h6 className='mb-2'>$ {data.price}</h6>
                  </div>
                  <div className='d-flex justify-content-between align-items-center'>
                    <input
                      type='number'
                      defaultValue={1}
                      className='form-control'
                      value={obj !== undefined ? obj.qty : data.qty}
                      style={{ width: "20%" }}
                      onChange={(e) => handleQuantity(e, data.dipsCode, data)}
                    />
                    <button
                      type='button'
                      className='btn btn-sm customize py-1 px-2'
                      style={{ width: "auto" }}
                      onClick={(e) => handleAddToCart(e, data)}
                    >
                      {payloadEdit !== undefined &&
                      payloadEdit.productType === "dips" &&
                      obj !== undefined
                        ? "Edit"
                        : "Add To Cart"}
                    </button>
                  </div>
                  <div className='d-flex justify-content-between align-items-center'>
                    {/* <label htmlFor="comment">comment </label> */}
                    <input
                      id='comment'
                      type='text'
                      value={obj?.comment !== undefined ? obj?.comment : ""}
                      className='form-control mt-2'
                      onChange={(e) => handleComment(e, data)}
                      placeholder='eg. comment'
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default DipsMenu;
