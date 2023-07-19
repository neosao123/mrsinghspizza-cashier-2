import React, { useEffect, useState } from "react";
import "../../css/ongoingOrder.css";
import Nav from "../../layout/Nav";
import SpecialMenu from "./SpecialMenu";
import CreateYourOwn from "../../components/order/CreateYourOwn";
import {
  allIngredientsApi,
  deleteCartItemApi,
  getCartListApi,
  sidesApi,
  storeLocationApi,
} from "../../API/ongoingOrder";
import SidesMenu from "./SidesMenu";
import DipsMenu from "./DipsMenu";
import DrinksMenu from "./DrinksMenu";
import $ from "jquery";

function OngoingOrder() {
  const [allIngredients, setAllIngredients] = useState();
  const [sidesData, setSidesData] = useState();
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [storesLocationData, setStoreLocationData] = useState();
  const [storesCode, setStoresCode] = useState();
  const [discount, setDiscount] = useState(0);
  const [taxPer, setTaxPer] = useState(0);
  const [cartListData, setCartListData] = useState();

  //API - Pizza All Ingredients
  const pizzaIngredients = async () => {
    await allIngredientsApi()
      .then((res) => {
        setAllIngredients(res.data.data);
      })
      .catch((err) => {
        console.log("Error From All Ingredient API: ", err);
      });
  };
  //API - Sides Ingredients
  const sidesIngredient = async () => {
    await sidesApi()
      .then((res) => {
        setSidesData(res.data.data);
      })
      .catch((err) => {
        console.log("Error From All Ingredient API: ", err);
      });
  };
  //API - Store Location
  const storeLocation = async () => {
    await storeLocationApi()
      .then((res) => {
        setStoreLocationData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Store Location API : ", err);
      });
  };

  // handle Stores Location --> Store Code
  const handleStores = (e) => {
    let storesCode = $("#storesID").find(":selected").attr("data-key");
    setStoresCode(storesCode);
  };

  //API - Get Cart List
  const getCartList = async () => {
    console.log("cart list called");
    let cart = JSON.parse(localStorage.getItem("CartData"));
    let cashierCode = localStorage.getItem("cashierCode");
    if (cart !== null && cart !== undefined) {
      let cartCode = cart.cartCode;
      let payload = {
        cartCode: cartCode,
        cashierCode: cashierCode,
      };
      await getCartListApi(payload)
        .then((res) => {
          setCartListData(res.data.data);
        })
        .catch((err) => {
          console.log("Error From Get Cart List API: ", err);
        });
    }
  };

  const deleteCartItem = async (e, cartLineCode) => {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem("CartData"));

    let payload = {
      cartLineCode: cartLineCode,
      discountAmount: "0",
      taxPer: "0",
    };
    console.log("Delelte Item", payload);
    await deleteCartItemApi(payload)
      .then((res) => {
        console.log(res);
        getCartList();
      })
      .catch((err) => {
        console.log("Error From Delete Cart Item API: ", err);
      });
  };

  useEffect(() => {
    pizzaIngredients();
    sidesIngredient();
    storeLocation();
    getCartList();
  }, []);

  return (
    <>
      <Nav />

      <div className="my-2 mx-4">
        <div className="row gx-4">
          {/* Section 1 */}
          <div className="col-lg-3">
            <form>
              <label className="form-label mt-2 mb-1">Phone</label>
              <input
                className="form-control"
                type="tel"
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <label className="form-label my-1">Customer Name</label>
              <input
                className="form-control"
                type="text"
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <div className="m-0 p-0">
                <label className="radio-inline mt-3">
                  <input
                    className="mx-2"
                    type="radio"
                    checked
                    onClick={(e) => {
                      setDeliveryType(e.target.value);
                    }}
                    name="category"
                  />
                  Pickup
                </label>
                <label className="radio-inline mx-4">
                  <input className="mx-2" type="radio" name="category" />
                  Delivery
                </label>
              </div>
              <label className="form-label mt-2 mb-1">Address</label>
              <textarea
                className="form-control"
                rows="4"
                cols="50"
                onChange={(e) => setAddress(e.target.value)}
              />
              <label className="form-label mt-2 mb-1">Store Location</label>
              <select
                className="form-select"
                id="storesID"
                onChange={handleStores}
              >
                <option value="" selected>
                  Choose Stores Location
                </option>
                {storesLocationData?.map((stores) => {
                  return (
                    <option key={stores.code} data-key={stores.code}>
                      {stores.storeLocation}
                    </option>
                  );
                })}
              </select>
            </form>
            <h6 className="my-3">Previous Order</h6>
            <div>
              <table className="table text-center border-none">
                <thead>
                  <tr>
                    <th scope="col">
                      <input type="checkbox" />
                    </th>
                    <th scope="col">Date</th>
                    <th scope="col">Order</th>
                  </tr>
                </thead>
                {/* <tbody>
                  <tr>
                    <th scope="row">
                      <input type="checkbox" />
                    </th>
                    <td>10-01-2023</td>
                    <td>Large Pizza</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <input type="checkbox" />
                    </th>
                    <td>04-07-2023</td>
                    <td>Extra Large Pizza</td>
                  </tr>
                </tbody> */}
              </table>
            </div>
          </div>

          {/* Section 2 */}
          <div className="col-lg-6 my-1 section2">
            {/* Tabs Headings */}
            <ul
              className="nav nav-tabs psTabsUl mt-2 d-flex justify-content-between mb-3"
              role="tablist"
            >
              <li className="nav-item">
                <a
                  className="nav-link active py-2 px-auto psTabs"
                  data-bs-toggle="tab"
                  href="#createByOwn"
                >
                  Create Your Own
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link py-2 px-auto psTabs"
                  data-bs-toggle="tab"
                  href="#special"
                >
                  Special
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link py-2 px-auto psTabs"
                  data-bs-toggle="tab"
                  href="#sidesMenu"
                >
                  Sides
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link py-2 px-auto psTabs"
                  data-bs-toggle="tab"
                  href="#dipsMenu"
                >
                  Dips
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link py-2 px-auto psTabs"
                  data-bs-toggle="tab"
                  href="#drinksMenu"
                >
                  Drinks
                </a>
              </li>
            </ul>
            {/* Tab Content */}
            <div className="tab-content m-0 p-0 w-100">
              {/* Create Your Own */}
              <div
                id="createByOwn"
                className="container tab-pane active m-0 p-0"
              >
                <CreateYourOwn
                  allIngredients={allIngredients}
                  sidesData={sidesData}
                  customerName={customerName}
                  mobileNumber={mobileNumber}
                  address={address}
                  deliveryType={deliveryType}
                  storeLocation={storesCode}
                  discount={discount}
                  taxPer={taxPer}
                  getCartList={getCartList}
                />
              </div>

              {/* SpecialMenu */}
              <div id="special" className="container tab-pane m-0 p-0">
                <SpecialMenu />
              </div>

              {/* All SIdes */}
              <div id="sidesMenu" className="container tab-pane m-0 p-0">
                <SidesMenu />
              </div>

              {/* All Dips */}
              <div
                id="dipsMenu"
                className="container tab-pane m-0 p-0 topping-list"
              >
                <DipsMenu />
              </div>

              {/* All Drinks */}
              <div id="drinksMenu" className="container tab-pane m-0 p-0">
                <DrinksMenu />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="col-lg-3 my-1">
            <h6 className="text-center">Order</h6>
            {/* Add to Cart */}
            <div className="p-3 rounded mb-3 addToCartList">
              {console.log(cartListData)}
              {cartListData?.cartItems?.map((data) => {
                return (
                  <div>
                    <div className="d-flex justify-content-between">
                      <h6>{data.productName}</h6>
                      <span className="mx-4">${data.price}</span>
                    </div>
                    <div className="d-flex justify-content-left mb-1">
                      <h6>Size : </h6>
                      <span className="mx-1">{data.pizzaSize}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn m-0 p-0"
                        onClick={(e) => deleteCartItem(e, data.code)}
                      >
                        <i
                          className="fa fa-trash-o"
                          aria-hidden="true"
                          style={{ fontSize: "1.1rem", color: "#ff5555" }}
                        ></i>
                      </button>
                      <button className="btn m-0 p-0 mx-3">
                        <i
                          className="fa fa-pencil-square-o"
                          aria-hidden="true"
                          style={{ fontSize: "1.1rem", color: "#7a3ee7" }}
                        ></i>
                      </button>
                    </div>
                    <hr className="border border-2 my-2 divider"></hr>
                  </div>
                );
              })}
            </div>
            {/* Order Submit */}
            <div className="my-1">
              <form>
                <div className="d-flex flex-wrap my-2 justify-content-end align-items-center OrderAmount">
                  <label className="form-label w-25">Price</label>
                  <div className="input-group w-50">
                    <div class="input-group-prepend">
                      <span className="input-group-text inputGroupTxt">$</span>
                    </div>
                    <input
                      className="form-control w-25"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      onChange={(e) => setDiscount(e.target.value)}
                    ></input>
                    <div class="input-group-append">
                      <span className="input-group-text inputGroupTxt">
                        USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap my-2 my-2 justify-content-end align-items-center">
                  <label className="form-label w-25">Discount</label>
                  <div className="input-group w-50">
                    <div class="input-group-prepend">
                      <span className="input-group-text inputGroupTxt">$</span>
                    </div>
                    <input
                      className="form-control w-25"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      onChange={(e) => setTaxPer(e.target.value)}
                    ></input>
                    <div class="input-group-append">
                      <span className="input-group-text inputGroupTxt">
                        USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap my-2 justify-content-end align-items-center">
                  <label className="form-label w-25">Tax</label>
                  <div className="input-group w-50">
                    <div class="input-group-prepend">
                      <span className="input-group-text inputGroupTxt">$</span>
                    </div>
                    <input
                      className="form-control w-25"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                    ></input>
                    <div class="input-group-append">
                      <span className="input-group-text inputGroupTxt">
                        USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap my-2 justify-content-end align-items-center">
                  <label className="form-label w-25">Total Price</label>
                  <div className="input-group w-50">
                    <div class="input-group-prepend">
                      <span className="input-group-text inputGroupTxt">$</span>
                    </div>
                    <input
                      className="form-control w-25"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                    ></input>
                    <div class="input-group-append">
                      <span className="input-group-text inputGroupTxt">
                        USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-end align-items-center">
                  <button
                    type="submit"
                    className="submitOrderbtn btn btn-sm my-3 px-4 py-2"
                  >
                    Submit Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OngoingOrder;
