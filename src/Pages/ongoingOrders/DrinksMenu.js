import React, { useEffect, useState } from "react";
import { addToCartApi, softDrinksApi } from "../../API/ongoingOrder";
import specialImg1 from "../../assets/bg-img.jpg";
import { toast } from "react-toastify";

function DrinksMenu({
  getCartList,
  customerName,
  mobileNumber,
  address,
  deliveryType,
  storeLocation,
  discount,
  taxPer,
}) {
  const [softDrinksData, setSoftDrinksData] = useState();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    drinks();
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

  // Onclick Add To Cart - API Add To Cart
  const handleAddToCart = async (e, drinksCode) => {
    e.preventDefault();
    const selectedDrinks = softDrinksData.filter(
      (drinks) => drinks.softdrinkCode === drinksCode
    );
    let cart = JSON.parse(localStorage.getItem("CartData"));
    let cartCode;
    let customerCode;
    if (cart !== null && cart !== undefined) {
      cartCode = cart.cartCode;
      customerCode = cart.customerCode;
    }
    let price = selectedDrinks[0].price;
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
        productCode: selectedDrinks[0].softdrinkCode,
        productName: selectedDrinks[0].softDrinksName,
        productType: "dips",
        quantity: quantity,
        price: selectedDrinks[0].price,
        amount: totalAmount.toFixed(2),
        discountAmount: discount,
        taxPer: taxPer,
      };
      await addToCartApi(payload)
        .then((res) => {
          localStorage.setItem("CartData", JSON.stringify(res.data.data));
          //clear fields from create your own
          getCartList();
          toast.success(
            `${selectedDrinks[0].softDrinksName} Added Successfully...`
          );
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
        {softDrinksData?.map((data) => {
          return (
            <li className="list-group-item" key={data.softdrinkCode}>
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
                    <h6 className="mb-2">{data.softDrinksName}</h6>
                    <h6 className="mb-2">$ {data.price}</h6>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <input
                      type="number"
                      defaultValue={1}
                      className="form-control"
                      style={{ width: "20%" }}
                      onChange={(e) => {
                        handleQuantity(e);
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm customize py-1 px-2"
                      style={{ width: "auto" }}
                      onClick={(e) => handleAddToCart(e, data.softdrinkCode)}
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

export default DrinksMenu;
