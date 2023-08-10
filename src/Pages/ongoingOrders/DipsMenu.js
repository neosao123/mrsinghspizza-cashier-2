import React, { useEffect, useState } from "react";
import { addToCartApi, dipsApi } from "../../API/ongoingOrder";
import specialImg1 from "../../assets/bg-img.jpg";
import { toast } from "react-toastify";
import { addToCart } from "../../reducer/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addToCartAndResetQty } from "./dipsMenu/dipsMenuFunctions";

function DipsMenu({
  discount,
  taxPer,
  getCartList,
  setPayloadEdit,
  payloadEdit,
}) {
  const [dipsData, setDipsData] = useState();
  const [quantity, setQuantity] = useState(1);
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
    } else {
      setQuantity(inputValue);
    }

    let itemToUpdate = dipsArr?.findIndex((item) => item.dipsCode === dipsCode);

    if (itemToUpdate !== -1) {
      let arr = [...dipsArr];
      arr[itemToUpdate] = {
        ...data,
        qty: inputValue,
      };
      setDipsArr(arr);
    } else {
      setDipsArr([
        ...dipsArr,
        {
          ...data,
          qty: inputValue,
        },
      ]);
    }
  };

  //API - Dips Data
  const dips = () => {
    dipsApi()
      .then((res) => {
        console.log(res.data.data, "api res dips");
        setDipsData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From DipsMenu API: ", err);
      });
  };

  useEffect(() => {
    if (payloadEdit !== undefined && payloadEdit.productType === "dips") {
      setDipsArr([
        ...dipsArr,
        {
          dipsCode: payloadEdit?.productCode,
          dipsName: payloadEdit?.productName,
          price: payloadEdit?.price,
          qty: payloadEdit?.quantity,
        },
      ]);
    }
  }, [payloadEdit]);

  // Onclick Add To Cart - API Add To Cart
  const handleAddToCart = async (e, dipsitem) => {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem("CartData"));
    let cartCode;
    let customerCode;
    const selectedDips = dipsArr?.filter(
      (dips) => dips.dipsCode === dipsitem.dipsCode
    );
    if (selectedDips.length === 0) {
      const payload = {
        id: uuidv4(),
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: dipsitem?.dipsCode,
        productName: dipsitem?.dipsName,
        productType: "dips",
        quantity: 1,
        price: dipsitem?.price,
        amount: dipsitem?.price,
        discountAmount: discount,
        taxPer: taxPer,
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

    console.log(selectedDips, "selectedDips");

    if (cart !== null && cart !== undefined) {
      cartCode = cart.cartCode;
      customerCode = cart.customerCode;
    }
    let price = selectedDips[0]?.price;
    let totalAmount = 0;

    totalAmount =
      Number(price) *
      (selectedDips[0]?.qty !== undefined ? Number(selectedDips[0]?.qty) : 1);

    console.log(totalAmount, "totalAmount");
    console.log(payloadEdit, "payloadEdit");

    if (payloadEdit !== undefined && payloadEdit.productType === "dips") {
      const payloadForEdit = {
        id: payloadEdit?.id,
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: selectedDips[0].dipsCode,
        productName: selectedDips[0].dipsName,
        productType: "dips",
        quantity: selectedDips[0].qty ? selectedDips[0].qty : 1,
        price: selectedDips[0].price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
      };
      const updatedCart = cartdata.findIndex(
        (item) => item.id === payloadEdit.id
      );
      console.log(payloadEdit, payloadForEdit, "pppp");
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
      const payload = {
        id: uuidv4(),
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: selectedDips[0].dipsCode,
        productName: selectedDips[0].dipsName,
        productType: "dips",
        quantity: selectedDips[0].qty ? selectedDips[0].qty : 1,
        price: selectedDips[0].price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
      };

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

    // dispatch(addToCart([...cartdata, payload]));
    // setQuantity(1);
    // toast.success(`${selectedDips[0].dipsName} ` + "Added Successfully");
    // let itemToUpdate = dipsData.findIndex((item) => item.dipsCode === dipsCode);

    // if (itemToUpdate !== -1) {
    //   let arr = [...dipsData];
    //   arr[itemToUpdate] = {
    //     ...selectedDips,
    //     qty: 1,
    //   };
    //   setDipsData(arr);
    // }
    // await addToCartApi(payload)
    //   .then((res) => {
    //     localStorage.setItem("CartData", JSON.stringify(res.data.data));
    //     //clear fields from create your own
    //     toast.success(
    //       `${quantity} - ${selectedDips[0].dipsName} Added Succesfully...`
    //     );
    //     getCartList();
    //   })
    //   .catch((err) => {
    //     if (err.response.status === 400 || err.response.status === 500) {
    //       toast.error(err.response.data.message);
    //     }
    //   });
    // } else {
    //   toast.error("Quantity is required");
    // }
  };

  return (
    <>
      <ul className='list-group'>
        {dipsData?.map((data) => {
          let obj = dipsArr?.find((item) => item.dipsCode === data.dipsCode);
          console.log(obj, "dipsarr obj");

          return (
            <li className='list-group-item' key={data.dipsCode}>
              <div className='d-flex justify-content-between align-items-end py-2 px-1'>
                <div className='d-flex justify-content-center w-auto'>
                  <img
                    className='rounded'
                    src={data.image === "" ? `${specialImg1}` : data.image}
                    width='50px'
                    height='50px'
                    alt=''
                  ></img>
                </div>
                <div className='d-flex justify-content-center flex-column mx-2 px-2 py-1 w-100'>
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
