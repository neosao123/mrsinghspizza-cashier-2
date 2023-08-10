import React, { useEffect, useState } from "react";
import { addToCartApi, sidesApi } from "../../API/ongoingOrder";
import specialImg1 from "../../assets/bg-img.jpg";
import $ from "jquery";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../reducer/cartReducer";

function SidesMenu({
  getCartList,
  discount,
  taxPer,
  payloadEdit,
  setPayloadEdit,
}) {
  const [sidesData, setSidesData] = useState();
  const [quantity, setQuantity] = useState(1);
  const [sidesArr, setSidesArr] = useState([]);
  let cartdata = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    sides();
  }, []);
  useEffect(() => {
    console.log(payloadEdit, "payloadEditpayloadEdit");
  }, [payloadEdit, quantity]);

  // handle Quantity
  const handleQuantity = (e, side) => {
    const inputValue = e.target.value;
    let index = sidesArr?.findIndex((item) => item.sideCode === side.sideCode);
    console.log("edit ss", index);
    if (index !== -1) {
      let arr = [...sidesArr];
      // arr[index] = {
      //   ...side,
      //   qty: e.target.value,
      // };
      arr[index].qty = e.target.value;
      setSidesArr(arr);
      console.log(e.target.value, "edit ss : ");
    } else {
      setSidesArr([...sidesArr, { ...side, qty: inputValue }]);
    }
    // console.log(arr, "payload : ");
    // if (parseInt(inputValue) < 1) {
    //   e.target.value = 1;
    // } else if (parseInt(inputValue) > 100) {
    //   e.target.value = 100;
    // } else {
    //   setQuantity(inputValue);
    // }
  };
  useEffect(() => {
    // if(payloadEdit !== undefined && payloadEdit.productType === "side"){
    // }
  }, [payloadEdit]);

  // Onclick handle Add To Cart & API - Add To Cart
  const handleAddToCart = async (e, sideCode, Obj) => {
    e.preventDefault();
    const selectedSideForNewItem = sidesData?.filter(
      (sides) => sides.sideCode === sideCode
    );
    if (selectedSideForNewItem.length === 0) {
      const payload = {
        id: uuidv4(),
        customerCode: customerCode ? customerCode : "#NA",
        productCode: Obj.sideCode,
        productName: Obj?.sideName,
        productType: "side",
        config: {
          lineCode: selectedCombination[0].lineCode,
          sidesSize: selectedCombination[0].size,
        },
        quantity: 1,
        price: Obj.price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
      };
      // let index = sidesData?.findIndex(
      //   (item) => item.sideCode === side.sideCode
      // );
      let temp = sidesData.map((item) => {
        return {
          ...item,
          qty: 1,
        };
      });
      setSidesData(temp);

      dispatch(addToCart([...cartdata, payload]));
      console.log(payload, "payload : ");
      toast.success(`${Obj.sideName} ` + "Added Successfully");
      return;
    }

    setSidesArr([
      ...sidesArr,
      {
        ...selectedSideForNewItem,
        qty: 1,
      },
    ]);
    let lineCode = $("#combination-" + sideCode)
      .find(":selected")
      .attr("data-key");
    console.log("Combination Code : ", lineCode);
    console.log("sideCode", sideCode);
    const selectedSide = sidesArr?.filter(
      (sides) => sides.sideCode === sideCode
    );
    console.log(selectedSide, "payload : ");
    const selectedCombination = selectedSide[0]?.combination?.filter(
      (data) => data.lineCode === lineCode
    );

    let cart = JSON.parse(localStorage.getItem("CartData"));
    let cartCode;
    let customerCode;

    if (cart !== null && cart !== undefined) {
      cartCode = cart.cartCode;
      customerCode = cart.customerCode;
    }
    let price = selectedCombination[0]?.price;
    let totalAmount = 0;

    totalAmount =
      Number(price) *
      (selectedSide[0]?.qty !== undefined ? Number(selectedSide[0]?.qty) : 1);

    if (payloadEdit !== undefined && payloadEdit.productType === "side") {
      console.log("editt", payloadEdit);
      const payloadForEdit = {
        customerCode: customerCode ? customerCode : "#NA",
        productCode: selectedSide[0].sideCode,
        productName: selectedSide[0].sideName,
        productType: "side",
        config: {
          lineCode: selectedCombination[0].lineCode,
          sidesSize: selectedCombination[0].size,
        },
        quantity: selectedSide[0].qty,
        price: selectedCombination[0].price,
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
      dispatch(addToCart([...tempPayload]));
      setPayloadEdit();
      let temp = sidesData.map((item) => {
        return {
          ...item,
          qty: 1,
        };
      });
      setSidesData(temp);
      setQuantity(1);
    } else {
      const payload = {
        id: uuidv4(),
        customerCode: customerCode ? customerCode : "#NA",
        productCode: selectedSide[0].sideCode,
        productName: selectedSide[0].sideName,
        productType: "side",
        config: {
          lineCode: selectedCombination[0].lineCode,
          sidesSize: selectedCombination[0].size,
        },
        quantity: selectedSide[0].qty ? selectedSide[0].qty : 1,
        price: selectedCombination[0].price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
      };
      // let index = sidesData?.findIndex(
      //   (item) => item.sideCode === side.sideCode
      // );
      let temp = sidesData.map((item) => {
        return {
          ...item,
          qty: 1,
        };
      });
      setSidesData(temp);

      dispatch(addToCart([...cartdata, payload]));
      console.log(payload, "payload : ");
      toast.success(`${selectedSide[0].sideName} ` + "Added Successfully");
      // setQuantity(1);
    }

    // await addToCartApi(payload)
    //   .then((res) => {
    //     localStorage.setItem("CartData", JSON.stringify(res.data.data));
    //     //clear fields from create your own
    //     getCartList();
    //     toast.success(
    //       `${selectedSide[0].sideName} - ${selectedCombination[0].size} Added Successfully...`
    //     );
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

  //API - Sides
  const sides = () => {
    sidesApi()
      .then((res) => {
        console.log(
          res.data.data?.map((item) => {
            return {
              ...item,
              qty: 1,
            };
          }),
          "res.data.data"
        );
        let arr = res.data.data?.map((item) => {
          return {
            ...item,
            qty: 1,
          };
        });
        setSidesData(
          res.data.data?.map((item) => {
            return {
              ...item,
              qty: 1,
            };
          })
        );
      })
      .catch((err) => {
        console.log("ERROR From SidesMenu API: ", err);
      });
  };
  // useEffect(() => {

  // }, [sidesData]);

  return (
    <>
      <ul
        className='list-group'
        style={{ overflowY: "scroll", height: "30rem" }}
      >
        {sidesData?.map((data, index) => {
          return (
            <li className='list-group-item' key={data.sideCode}>
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
                    <h6 className='mb-2'>{data.sideName}</h6>
                  </div>
                  <div className='d-flex justify-content-between align-items-center'>
                    <select
                      className='form-select'
                      style={{ width: "35%" }}
                      id={"combination-" + data.sideCode}
                    >
                      {data?.combination?.map((combinationData) => {
                        return (
                          <>
                            <option
                              key={combinationData.lineCode}
                              data-key={combinationData.lineCode}
                              data-price={combinationData.price}
                            >
                              {combinationData.size} - $ {combinationData.price}
                            </option>
                          </>
                        );
                      })}
                    </select>
                    <input
                      type='number'
                      className='form-control'
                      style={{ width: "20%" }}
                      onChange={(e) => handleQuantity(e, data)}
                      step={1}
                      min={1}
                      // value={data?.qty}
                      value={data?.combination[index]?.qty}
                      max={100}
                      defaultValue={1}
                    />
                    <button
                      type='button'
                      className='btn btn-sm customize py-1 px-2'
                      style={{ width: "auto" }}
                      onClick={(e) => handleAddToCart(e, data.sideCode, data)}
                    >
                      {payloadEdit !== undefined &&
                      payloadEdit.productType === "side"
                        ? "Edit Side"
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
export default SidesMenu;
