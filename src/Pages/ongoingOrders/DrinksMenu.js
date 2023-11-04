import React, { useEffect, useState } from "react";
import { softDrinksApi } from "../../API/ongoingOrder";
import specialImg1 from "../../assets/bg-img.jpg";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../reducer/cartReducer";
import { v4 as uuidv4 } from "uuid";
import { addToCartAndResetQty } from "./drinksMenuFunctions/drinksMenuFunction";

function DrinksMenu({ discount, taxPer, setPayloadEdit, payloadEdit }) {
  const [softDrinksData, setSoftDrinksData] = useState();
  const [comment, setComment] = useState("");
  // const [selectedTypes, setSelectedTypes] = useState([]);
  const [drinksArr, setDrinksArr] = useState([]);
  let cartdata = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    drinks();
  }, []);

  // handle Quantity
  const handleDrinkType = (e, data) => {
    let itemToUpdate = drinksArr?.findIndex(
      (item) => item.softdrinkCode === data.softdrinkCode
    );
    if (
      payloadEdit !== undefined &&
      payloadEdit.productType === "drinks" &&
      payloadEdit?.productCode != data.softdrinkCode
    ) {
      toast.error("complete your last edit first");
      return;
    } else {
      if (itemToUpdate !== -1) {
        let arr = [...drinksArr];
        arr[itemToUpdate] = {
          ...arr[itemToUpdate],
          drinkType: [e.target.value],
        };

        // setSelectedTypes([e.target.value]);

        setDrinksArr(arr);
        updateInCart({
          ...arr[itemToUpdate],
          drinkType: [e.target.value],
        });
      } else {
        // setSelectedTypes([e.target.value]);
        updateInCart({
          ...data,
          drinkType: [e.target.value],
          qty: 1,
        });
        setDrinksArr([
          ...drinksArr,
          {
            ...data,
            drinkType: [e.target.value],
            qty: 1,
          },
        ]);
      }
    }

    // handleAddToCart(e, data);
  };

  useEffect(() => {
    // data();
  }, [drinksArr]);
  const handleQuantity = (e, data) => {
    const inputValue = e.target.value;
    let itemToUpdate = drinksArr?.findIndex(
      (item) => item.softdrinkCode === data.softdrinkCode
    );
    if (itemToUpdate !== -1) {
      let arr = [...drinksArr];
      arr[itemToUpdate] = {
        ...arr[itemToUpdate],
        qty: inputValue <= 0 ? 1 : inputValue,
      };
      updateInCart(data.softdrinkCode, {
        ...arr[itemToUpdate],
        qty: inputValue <= 0 ? 1 : inputValue,
      });

      setDrinksArr(arr);
    } else {
      updateInCart(data.softdrinkCode, {
        ...data,
        qty: inputValue <= 0 ? 1 : inputValue,
        drinkType:
          // selectedTypes.length === 0 ? data?.drinkType[0] : selectedTypes,
          data?.drinkType[0],
      });

      setDrinksArr([
        ...drinksArr,
        {
          ...data,
          qty: inputValue <= 0 ? 1 : inputValue,
          drinkType:
            // selectedTypes.length === 0 ? data?.drinkType[0] : selectedTypes,
            data?.drinkType[0],
        },
      ]);
    }

    // handleAddToCart(e, data);
  };
  const updateInCart = (data) => {
    let cart = JSON.parse(localStorage.getItem("CartData"));

    let tempPayload = [...cartdata];

    const updatedCartId = cartdata?.findIndex(
      (item) => item?.productCode === data?.softdrinkCode
    );
    let cartCode;
    let customerCode;
    if (cart !== null && cart !== undefined) {
      cartCode = cart?.cartCode;
      customerCode = cart?.customerCode;
    }
    let price = data?.price;
    let totalAmount = 0;
    totalAmount =
      Number(price) * (data?.qty !== undefined ? Number(data?.qty) : 1);
    const payload = {
      id: updatedCartId !== -1 ? cartdata[updatedCartId]?.id : uuidv4(),
      cartCode: cartCode ? cartCode : "#NA",
      customerCode: customerCode ? customerCode : "#NA",
      cashierCode: localStorage.getItem("cashierCode"),
      productCode: data?.softdrinkCode,
      productName: data?.softDrinksName,
      productType: "drinks",
      quantity: data?.qty,
      config: {
        type: data?.drinkType,
      },
      price: data?.price,
      amount: totalAmount.toFixed(2),
      discountAmount: discount,
      taxPer: taxPer,
      pizzaSize: "",
      comments: data?.comment,
    };
    if (updatedCartId !== -1) {
      tempPayload[updatedCartId] = payload;
    } else {
      tempPayload.unshift(payload);
    }
    dispatch(addToCart([...tempPayload]));
  };
  useEffect(() => {
    if (payloadEdit !== undefined && payloadEdit.productType === "drinks") {
      setDrinksArr([
        {
          softdrinkCode: payloadEdit?.productCode,
          softDrinksName: payloadEdit?.productName,
          price: payloadEdit?.price,
          qty: payloadEdit?.quantity,
          drinkType: payloadEdit?.config?.type,
          comment: payloadEdit?.comments,
        },
      ]);
      // setSelectedTypes(payloadEdit.config);
    }
  }, [payloadEdit]);

  // API - SoftDrinks
  const drinks = () => {
    softDrinksApi()
      .then((res) => {
        setSoftDrinksData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From SoftDrinksMenu API: ", err);
      });
  };
  const handleComments = (e, data) => {
    let itemToUpdate = drinksArr?.findIndex(
      (item) => item.softdrinkCode === data.softdrinkCode
    );

    if (itemToUpdate !== -1) {
      let arr = [...drinksArr];
      arr[itemToUpdate] = {
        ...arr[itemToUpdate],
        comment: e.target.value,
      };
      setDrinksArr(arr);
    } else {
      setDrinksArr([
        ...drinksArr,
        {
          ...data,
          comment: e.target.value,
          qty: 1,
          drinkType:
            // selectedTypes.length === 0 ? data?.drinkType[0] : selectedTypes,
            data?.drinkType,
        },
      ]);
    }
  };

  // Onclick Add To Cart - API Add To Cart
  const handleAddToCart = async (e, drink) => {
    if (
      payloadEdit !== undefined &&
      payloadEdit.productType === "drinks" &&
      payloadEdit?.productCode != drink.softdrinkCode
    ) {
      toast.error("complete your last edit first");
      return;
    } else {
      let selectedDrinks;
      selectedDrinks = drinksArr?.filter(
        (drinks) => drinks.softdrinkCode === drink.softdrinkCode
      );
      if (selectedDrinks?.length == 0 || !selectedDrinks) {
        selectedDrinks = [drink];
      }
      let cart = JSON.parse(localStorage.getItem("CartData"));
      let cartCode;
      let customerCode;
      if (cart !== null && cart !== undefined) {
        cartCode = cart.cartCode;
        customerCode = cart.customerCode;
      }
      let price = selectedDrinks[0]?.price;
      let totalAmount = 0;
      totalAmount =
        Number(price) *
        (selectedDrinks[0]?.qty !== undefined
          ? Number(selectedDrinks[0]?.qty)
          : 1);
      if (drinksArr.length === 0) {
        // alert("length 0");

        const payload = {
          id: uuidv4(),
          cartCode: cartCode ? cartCode : "#NA",
          customerCode: customerCode ? customerCode : "#NA",
          cashierCode: localStorage.getItem("cashierCode"),
          productCode: drink?.softdrinkCode,
          productName: drink?.softDrinksName,
          productType: "drinks",
          quantity: 1,
          config: {
            type: drink?.drinkType[0],
            // selectedTypes.length === 0 ? drink?.drinkType[0] : selectedTypes[0],
          },
          price: drink?.price,
          amount: drink?.price,
          discountAmount: discount,
          taxPer: taxPer,
          pizzaSize: "",
          comments: selectedDrinks[0]?.comment,
        };
        setComment("");
        console.log(payload, "drinks payload");
        // setSelectedTypes([]);
        addToCartAndResetQty(
          // setComment,
          dispatch,
          addToCart,
          [payload, ...cartdata],
          toast,
          setDrinksArr,
          setSoftDrinksData,
          softDrinksData,
          [drink],
          "Added Successfully"
        );
        setPayloadEdit();

        return;
      }
      if (
        payloadEdit !== undefined &&
        payloadEdit.productType === "drinks" &&
        e.target.innerText.toLowerCase().trim() === "edit"
      ) {
        // alert("edit item");

        const payloadForEdit = {
          id: payloadEdit?.id,
          cartCode: cartCode ? cartCode : "#NA",
          customerCode: customerCode ? customerCode : "#NA",
          cashierCode: localStorage.getItem("cashierCode"),
          productCode: selectedDrinks[0].softdrinkCode,
          productName: selectedDrinks[0].softDrinksName,
          productType: "drinks",
          config: {
            type: selectedDrinks[0]?.drinkType,
          },
          quantity: selectedDrinks[0].qty ? selectedDrinks[0].qty : 1,
          price: selectedDrinks[0].price,
          amount: totalAmount.toFixed(2),
          discountAmount: discount,
          taxPer: taxPer,
          pizzaSize: "",
          comments: selectedDrinks[0]?.comment,
        };
        console.log(payloadForEdit, "drinks payload");
        const updatedCart = cartdata.findIndex(
          (item) => item.id === payloadEdit.id
        );
        let tempPayload = [...cartdata];

        tempPayload[0] = payloadForEdit;
        dispatch(addToCart([...tempPayload]));
        toast.success(
          `${selectedDrinks[0].softDrinksName} ` + "Updated Successfully"
        );
        setComment("");
        setPayloadEdit();
        // setSelectedTypes([]);

        let temp = softDrinksData.map((item) => {
          return {
            ...item,
            qty: 1,
          };
        });
        setSoftDrinksData(temp);
        // setSelectedTypes([]);

        setDrinksArr([]);
      } else {
        // alert("new item");

        let tempPayload = [...cartdata];
        const updatedCartId = cartdata?.findIndex(
          (item) => item?.productCode === selectedDrinks[0].softdrinkCode
        );

        const payload = {
          id: updatedCartId !== -1 ? cartdata[updatedCartId].id : uuidv4(),
          cartCode: cartCode ? cartCode : "#NA",
          customerCode: customerCode ? customerCode : "#NA",
          cashierCode: localStorage.getItem("cashierCode"),
          productCode: selectedDrinks[0]?.softdrinkCode,
          productName: selectedDrinks[0]?.softDrinksName,
          productType: "drinks",
          config: {
            type: selectedDrinks[0]?.drinkType,
          },
          quantity: selectedDrinks[0]?.qty ? selectedDrinks[0]?.qty : 1,
          price: selectedDrinks[0]?.price,
          amount: totalAmount.toFixed(2),
          discountAmount: discount,
          taxPer: taxPer,
          pizzaSize: "",
          comments: selectedDrinks[0]?.comment,
        };
        if (updatedCartId !== -1) {
          tempPayload[updatedCartId] = payload;
        } else {
          tempPayload.unshift(payload);
        }
        setComment("");
        // setSelectedTypes([]);
        addToCartAndResetQty(
          dispatch,
          addToCart,
          [...tempPayload],
          toast,
          setDrinksArr,
          setSoftDrinksData,
          softDrinksData,
          [drink],
          "Added Successfully"
        );
        setPayloadEdit();
        // setSelectedTypes([]);
      }
    }
  };
  // useEffect(() => {
  //   console.log(selectedTypes, "selectedTypes");
  // }, [selectedTypes]);
  useEffect(() => {}, [drinksArr]);

  return (
    <>
      <ul className='list-group'>
        {softDrinksData?.map((data) => {
          let obj = drinksArr?.find(
            (item) => item.softdrinkCode === data.softdrinkCode
          );

          return (
            <li className='list-group-item' key={data.softdrinkCode}>
              <div className='d-flex justify-content-between align-items-end py-2 px-1'>
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
                    <h6 className='mb-2'>{data.softDrinksName}</h6>
                    <h6 className='mb-2'>$ {data.price}</h6>
                  </div>
                  <div className='d-flex justify-content-between align-items-center'>
                    <input
                      readOnly
                      type='number'
                      defaultValue={1}
                      min={1}
                      value={obj !== undefined ? obj.qty : data.qty}
                      className='form-control'
                      style={{ width: "20%" }}
                      onChange={(e) => {
                        handleQuantity(e, data);
                      }}
                    />
                    <div
                      className='d-flex flex-column'
                      style={{ width: "30%" }}
                    >
                      {/* <label htmlFor="mySelect"></label> */}
                      <select
                        id='mySelect'
                        className='form-select'
                        value={obj?.drinkType ? obj?.drinkType : ""}
                        onChange={(e) => handleDrinkType(e, data)}
                      >
                        {data?.drinkType?.map((type, index) => {
                          return (
                            <option value={type} key={type + index}>
                              {type}
                            </option>
                          );
                        })}
                        {/* {data.softDrinksName === "Juice" ? (
                          <>
                            {JuiceType.map((type, index) => {
                              return (
                                <option value={type} key={type + index}>
                                  {type}
                                </option>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {PopsType?.map((type, index) => {
                              return (
                                <option value={type} key={type + index}>
                                  {type}
                                </option>
                              );
                            })}
                          </>
                        )} */}
                      </select>
                    </div>
                    <button
                      type='button'
                      className='btn btn-sm customize py-1 px-2'
                      style={{ width: "auto" }}
                      onClick={(e) => {
                        handleAddToCart(e, data);
                      }}
                    >
                      {payloadEdit !== undefined &&
                      payloadEdit.productType === "drinks" &&
                      obj !== undefined
                        ? "Edit"
                        : "Add To Cart"}
                    </button>
                  </div>
                  <div className='d-flex w-100 '>
                    {" "}
                    <input
                      type='text'
                      value={obj?.comment !== undefined ? obj?.comment : ""}
                      onChange={(e) => handleComments(e, data)}
                      className='form-control mt-2'
                      placeholder='comment'
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

export default DrinksMenu;
