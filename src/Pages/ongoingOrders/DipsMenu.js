import React, { useEffect, useState } from "react";
import { addToCartApi, dipsApi } from "../../API/ongoingOrder";
import specialImg1 from "../../assets/bg-img.jpg";
import { toast } from "react-toastify";

function DipsMenu({
  customerName,
  mobileNumber,
  address,
  deliveryType,
  storeLocation,
  discount,
  taxPer,
  getCartList,
}) {
  const [dipsData, setDipsData] = useState();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dips();
  }, []);

  // handle Quantity
  const handleQuantity = (e) => {
    const inputValue = e.target.value;
    if (parseInt(inputValue) < 1) {
      e.target.value = 1;
    } else if (parseInt(inputValue) > 100) {
      e.target.value = 100;
    } else {
      setQuantity(inputValue);
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

  // Onclick Add To Cart - API Add To Cart
  const handleAddToCart = async (e, dipsCode) => {
    e.preventDefault();
    const selectedDips = dipsData.filter((dips) => dips.dipsCode === dipsCode);
    let cart = JSON.parse(localStorage.getItem("CartData"));
    let cartCode;
    let customerCode;
    if (cart !== null && cart !== undefined) {
      cartCode = cart.cartCode;
      customerCode = cart.customerCode;
    }
    let price = selectedDips[0].price;
    let totalAmount = 0;
    if (quantity) {
      totalAmount = Number(price) * Number(quantity);
      console.log(price);
      console.log(totalAmount);
      const payload = {
        cartCode: cartCode ? cartCode : "#NA",
        customerCode: customerCode ? customerCode : "#NA",
        customerName: customerName,
        mobileNumber: mobileNumber,
        address: address,
        deliveryType: "pickup",
        storeLocation: storeLocation,
        productCode: selectedDips[0].dipsCode,
        productName: selectedDips[0].dipsName,
        productType: "dips",
        quantity: quantity,
        price: selectedDips[0].price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
      };
      await addToCartApi(payload)
        .then((res) => {
          localStorage.setItem("CartData", JSON.stringify(res.data.data));
          //clear fields from create your own
          toast.success(
            `${quantity} - ${selectedDips[0].dipsName} Added Succesfully...`
          );
          getCartList();
        })
        .catch((err) => {
          console.log("ERROR From Add To Cart Sides API", err);
        });
    } else {
      console.log("Plz Enter Quantity");
    }
  };

  return (
    <>
      <ul className="list-group">
        {dipsData?.map((data) => {
          return (
            <li className="list-group-item" key={data.dipsCode}>
              <div className="d-flex justify-content-between align-items-end py-2 px-1">
                <div className="d-flex justify-content-center w-auto">
                  <img
                    className="rounded"
                    src={data.image === "" ? `${specialImg1}` : data.image}
                    width="50px"
                    height="50px"
                    alt=""
                  ></img>
                </div>
                <div className="d-flex justify-content-center flex-column mx-2 px-2 py-1 w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-2">{data.dipsName}</h6>
                    <h6 className="mb-2">$ {data.price}</h6>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <input
                      type="number"
                      defaultValue={1}
                      className="form-control"
                      style={{ width: "20%" }}
                      onChange={handleQuantity}
                    />
                    <button
                      type="button"
                      className="btn btn-sm customize py-1 px-2"
                      style={{ width: "auto" }}
                      onClick={(e) => handleAddToCart(e, data.dipsCode)}
                    >
                      Add To Cart
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
