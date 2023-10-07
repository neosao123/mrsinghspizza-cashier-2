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
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [drinksArr, setDrinksArr] = useState([]);
  const [quantity, setQuantity] = useState(1);
  let cartdata = useSelector((state) => state.cart.cart);
  let JuiceType = ["Apple", "Pineapple", "Orange", "Mango"];
  let PopsType = [
    "Coke",
    "Sprite",
    "Ginger-ale(Canada Dry)",
    "Fanta(Orange)",
    "Diet Coke",
    "Zero Coke",
    "Pepsi",
    "Nestea",
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    drinks();
  }, []);

  // handle Quantity
  const handleDrinkType = (e, data) => {
    let itemToUpdate = drinksArr?.findIndex(
      (item) => item.softdrinkCode === data.softdrinkCode
    );

    if (itemToUpdate !== -1) {
      let arr = [...drinksArr];
      arr[itemToUpdate] = {
        ...arr[itemToUpdate],
        drinkType: [e.target.value],
      };

      setDrinksArr(arr);
      setSelectedTypes([e.target.value]);
    } else {
      setDrinksArr([
        ...drinksArr,
        {
          ...data,
          drinkType: [e.target.value],
          qty: 1,
        },
      ]);
      setSelectedTypes([e.target.value]);
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
      setDrinksArr(arr);
    } else {
      setDrinksArr([
        ...drinksArr,
        {
          ...data,
          qty: inputValue <= 0 ? 1 : inputValue,
          drinkType:
            selectedTypes.length == 0
              ? data?.softDrinksName === "Juice"
                ? [JuiceType[0]]
                : [PopsType[0]]
              : null,
        },
      ]);
    }

    handleAddToCart(e, data);
  };
  useEffect(() => {
    if (payloadEdit !== undefined && payloadEdit.productType === "drinks") {
      setDrinksArr([
        ...drinksArr,
        {
          softdrinkCode: payloadEdit?.productCode,
          softDrinksName: payloadEdit?.productName,
          price: payloadEdit?.price,
          qty: payloadEdit?.quantity,
          drinkType: payloadEdit?.config[0],
          comment: payloadEdit?.comments,
        },
      ]);
      console.log(payloadEdit, "payload");
      setSelectedTypes(payloadEdit.config);
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
            selectedTypes.length == 0
              ? data?.softDrinksName === "Juice"
                ? [JuiceType[0]]
                : [PopsType[0]]
              : null,
        },
      ]);
    }
  };

  // Onclick Add To Cart - API Add To Cart
  const handleAddToCart = async (e, drink) => {
    // e.preventDefault();
    const selectedDrinks = drinksArr?.filter(
      (drinks) => drinks.softdrinkCode === drink.softdrinkCode
    );
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
    console.log(selectedDrinks, "selected");
    if (drinksArr.length === 0) {
      const payload = {
        id: uuidv4(),
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: drink?.softdrinkCode,
        productName: drink?.softDrinksName,
        productType: "drinks",
        quantity: 1,
        config:
          selectedTypes.length === 0 ? drink?.drinkType[0] : selectedTypes,
        price: drink?.price,
        amount: drink?.price,
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: selectedDrinks[0]?.comment,
      };
      setComment("");
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
      return;
    }
    if (payloadEdit !== undefined && payloadEdit.productType === "drinks") {
      console.log(selectedDrinks, "selectedDrinks");
      const payloadForEdit = {
        id: payloadEdit?.id,
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: selectedDrinks[0].softdrinkCode,
        productName: selectedDrinks[0].softDrinksName,
        productType: "drinks",
        config:
          selectedTypes.length === 0
            ? selectedDrinks[0].drinkType[0]
            : selectedTypes,
        quantity: selectedDrinks[0].qty ? selectedDrinks[0].qty : 1,
        price: selectedDrinks[0].price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: selectedDrinks[0]?.comment,
      };
      const updatedCart = cartdata.findIndex(
        (item) => item.id === payloadEdit.id
      );
      let tempPayload = [...cartdata];
      tempPayload[0] = payloadForEdit;
      dispatch(addToCart([...tempPayload]));
      toast.success(
        `${selectedDrinks[0].softDrinksName} ` + "Updated Successfully"
      );
      console.log(payloadForEdit, "payload");
      setComment("");
      setPayloadEdit();
      let temp = softDrinksData.map((item) => {
        return {
          ...item,
          qty: 1,
        };
      });
      setSoftDrinksData(temp);
      setDrinksArr([]);
    } else {
      console.log(selectedDrinks[0], "selected ");
      const payload = {
        id: uuidv4(),
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        cashierCode: localStorage.getItem("cashierCode"),
        productCode: selectedDrinks[0]?.softdrinkCode,
        productName: selectedDrinks[0]?.softDrinksName,
        productType: "drinks",
        config:
          selectedTypes.length === 0
            ? selectedDrinks[0]?.drinkType[0]
            : selectedTypes,
        quantity: selectedDrinks[0]?.qty ? selectedDrinks[0]?.qty : 1,
        price: selectedDrinks[0]?.price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
        pizzaSize: "",
        comments: selectedDrinks[0]?.comment,
      };
      setComment("");
      addToCartAndResetQty(
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
    }
  };
  // useEffect(() => {
  //   console.log(drinksArr);
  // }, [drinksArr])

  return (
    <>
      <ul className='list-group'>
        {softDrinksData?.map((data) => {
          let obj = drinksArr?.find(
            (item) => item.softdrinkCode === data.softdrinkCode
          );
          console.log(obj, "existed obj");
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
                      onClick={(e) => handleAddToCart(e, data)}
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
                      placeholder='eg. add additional drinks, pops, juice, can, coke'
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
