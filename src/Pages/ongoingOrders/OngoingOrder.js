import React, { useEffect, useState } from "react";
import "../../css/ongoingOrder.css";
import orderDetails from "../../json/data.json";
import Nav from "../../layout/Nav";
import SpecialMenu from "./SpecialMenu";
import CreateYourOwn from "../../components/order/CreateYourOwn";
import { allIngredientsApi, sidesApi } from "../../API/ongoingOrder";
import { useSelector } from "react-redux";
import SidesMenu from "./SidesMenu";
import DipsMenu from "./DipsMenu";
import DrinksMenu from "./DrinksMenu";

function OngoingOrder() {
  const [data, setData] = useState(orderDetails);
  const [allIngredients, setAllIngredients] = useState();
  const [sidesData, setSidesData] = useState();
  const token = localStorage.getItem("token");
  console.log("token from ongoing page: ", token);
  useEffect(() => {
    if (token !== undefined && token !== "") {
      pizzaIngredients();
      sidesIngredient();
    }
  }, [token]);

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

  // // Delete OrderDetails Data
  // const deleteItem = (index) => {
  //   index = index + 1;
  //   const updatedData = data.filter((item) => item.id !== index);
  //   setData(updatedData);
  // };
  return (
    <>
      <Nav />

      <div className="my-2 mx-4">
        <div className="row gx-4">
          {/* Section 1 */}
          <div className="col-lg-3">
            <form>
              <label className="form-label my-1">Customer Name</label>
              <input className="form-control" type="text" />
              <label className="form-label mt-2 mb-1">Phone</label>
              <input className="form-control" type="tel" />
              <label className="form-label mt-2 mb-1">Address</label>
              <textarea className="form-control" rows="4" cols="50" />
              <label className="form-label mt-2 mb-1">Store Location</label>
              <select className="form-select">
                <option value="1" selected>
                  Dixie/NorthPark
                </option>
              </select>
              <label className="radio-inline mt-3">
                <input className="mx-2" type="radio" name="category" checked />
                Pickup
              </label>
              <label className="radio-inline mx-4">
                <input className="mx-2" type="radio" name="category" />
                Delivery
              </label>
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
          <div className="col-lg-5 my-1 section2">
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
              {/* Toppings */}
              <div
                id="createByOwn"
                className="container tab-pane active m-0 p-0"
              >
                <CreateYourOwn
                  allIngredients={allIngredients}
                  sidesData={sidesData}
                />
              </div>

              {/* Special */}
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
          <div className="col-lg-4 my-1">
            <h6 className="text-center">Order</h6>
            {/* Add to Cart */}
            <div className="p-3 rounded mb-3 addToCartList">
              {/* {data.map((item, index) => {
                return (
                  <div>
                    <div className="d-flex justify-content-between">
                      <h6>{item.name}</h6>
                      <span className="mx-4">{item.price}</span>
                    </div>
                    <div className="d-flex justify-content-left mb-1">
                      <h6>Size : </h6>
                      <span className="mx-1">{item.size}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <button
                        onClick={(e) => deleteItem(index)}
                        className="btn m-0 p-0"
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
              })} */}
            </div>
            {/* Order Submit */}
            <div className="my-1">
              <form>
                <div className="d-flex flex-wrap justify-content-end align-items-center OrderAmount">
                  <label className="form-label w-25 my-2">Price</label>
                  <span className="input-group-text inputGroupTxt">$</span>
                  <input
                    className="form-control my-2 w-25"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                  ></input>
                  <span className="input-group-text inputGroupTxt">USD</span>
                </div>
                <div className="d-flex flex-wrap justify-content-end align-items-center">
                  <label className="form-label w-25 my-2">Discount</label>
                  <span className="input-group-text inputGroupTxt">$</span>
                  <input
                    className="form-control w-25 my-2"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                  ></input>
                  <span className="input-group-text inputGroupTxt">USD</span>
                </div>
                <div className="d-flex flex-wrap justify-content-end align-items-center">
                  <label className="form-label w-25 my-2">Tax</label>
                  <span className="input-group-text inputGroupTxt">$</span>
                  <input
                    className="form-control w-25 my-2"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                  ></input>
                  <span className="input-group-text inputGroupTxt">USD</span>
                </div>
                <div className="d-flex flex-wrap justify-content-end align-items-center">
                  <label className="form-label w-25 my-2">Total Price</label>
                  <span className="input-group-text inputGroupTxt">$</span>
                  <input
                    className="form-control w-25 my-2"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                  ></input>
                  <span className="input-group-text inputGroupTxt">USD</span>
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
