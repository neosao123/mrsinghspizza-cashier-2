import React, { useEffect, useState } from "react";
import specialImg1 from "../../assets/bg-img.jpg";
import backBtn from "../../assets/back-button.png";
import "../../css/specialMenu.css";
import SpecialPizzaSelection from "../../components/order/SpecialPizzaSelection";
import {
  dipsApi,
  getSpecialDetailsApi,
  specialPizzaApi,
  toppingsApi,
} from "../../API/ongoingOrder";
import Selection from "../../json/Selection.json";

function SpecialMenu() {
  //
  const [crust, setCrust] = useState([{}]);

  // For Conditions
  const [show, setShow] = useState(false);
  const [pizzaSize, setPizzaSize] = useState("L");

  // For Data
  const [specialData, setSpecialData] = useState();
  const [getSpecialData, setGetSpecialData] = useState();
  const [toppingsData, setToppingsData] = useState();
  const [dipsData, setDipsData] = useState();

  useEffect(() => {
    specialIngredients();
  }, []);

  //Component - Special Pizza Selection
  const elements = [];
  for (let i = 1; i <= getSpecialData?.noofPizzas; i++) {
    elements.push(
      <SpecialPizzaSelection
        getSpecialData={getSpecialData}
        count={i}
        toppingsData={toppingsData}
        setCrust={setCrust}
      />
    );
  }

  const handleAddToCart = () => {
    //
  };

  // Customize Details
  const handleGetSpecial = (speicalPizza) => {
    getSpecialDetails({ code: speicalPizza.code });
    toppings();
    dips();
    setShow(true);
  };

  //API - Special Pizza
  const specialIngredients = () => {
    specialPizzaApi()
      .then((res) => {
        setSpecialData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Special Pizza API: ", err);
      });
  };
  //API - Get Special Details
  const getSpecialDetails = (data) => {
    getSpecialDetailsApi(data)
      .then((res) => {
        setGetSpecialData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Dips API: ", err);
      });
  };
  //API - Toppings Data
  const toppings = () => {
    toppingsApi()
      .then((res) => {
        setToppingsData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Toppings API: ", err);
      });
  };
  //API - Dips Data
  const dips = () => {
    dipsApi()
      .then((res) => {
        setDipsData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Dips API: ", err);
      });
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-center">
        <div className="w-100">
          {show === true ? (
            <>
              {/* Back Button */}
              <div
                className="m-0 p-0 mx-2"
                onClick={() => setShow(false)}
                style={{ cursor: "pointer" }}
              >
                <img
                  className="mb-2 p-0"
                  src={`${backBtn}`}
                  width="35px"
                  height="35px"
                  alt=""
                />
              </div>

              <div className="customizablePizza px-3">
                <div className="d-flex justify-content-between">
                  <h6>{getSpecialData?.name}</h6>
                  <h6 className="mx-2">
                    ${" "}
                    {pizzaSize === "L"
                      ? getSpecialData?.largePizzaPrice
                      : getSpecialData?.extraLargePizzaPrice}
                  </h6>
                </div>
                <div className="mb-4">
                  <p className="mb-1">
                    Toppings :{" "}
                    <span className="mx-2">
                      {getSpecialData?.noofToppings} /{" "}
                      {getSpecialData?.noofToppings}
                    </span>
                  </p>
                  {/* <p className="mb-1">
                    Additional Toppings Used :
                    <span className="mx-2">0 ($2.00)</span>
                  </p> */}
                  <p className="mb-1 d-inline">Size : </p>
                  <select
                    onChange={(e) => setPizzaSize(e.target.value)}
                    className="form-select mx-2 my-2 w-25 d-inline"
                  >
                    <option value="L">Large</option>
                    <option value="XL">Extra Large</option>
                  </select>
                </div>

                {elements}

                {/* Sides */}
                {getSpecialData?.sides.length === 0 ? (
                  ""
                ) : (
                  <>
                    <h6 className="text-left mt-1 mb-2">Sides</h6>
                    <div id="sides" className="mb-3">
                      <ul className="list-group">
                        {getSpecialData?.sides?.map((sidesData) => {
                          return (
                            <>
                              <li
                                className="list-group-item d-flex justify-content-between align-items-center"
                                key={sidesData.code}
                              >
                                <label className="d-flex align-items-center">
                                  <input
                                    type="checkbox"
                                    className="mx-3 d-inline-block"
                                    defaultChecked={false}
                                    key={sidesData.code}
                                  />
                                  {sidesData.sideName}
                                </label>
                                <div style={{ width: "12rem" }}>
                                  <select className="form-select w-100 d-inline-block">
                                    {sidesData?.lineEntries?.map(
                                      (lineEntriesData) => {
                                        return (
                                          <option
                                            key={lineEntriesData.code}
                                            defaultValue={lineEntriesData.code}
                                          >
                                            <span>
                                              {lineEntriesData.size} -{" "}
                                            </span>
                                            <span className="mb-0 mx-2">
                                              $ {lineEntriesData.price}
                                            </span>
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </li>
                            </>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}

                {/* Dips */}
                {getSpecialData?.noofDips === "0" ? (
                  ""
                ) : (
                  <>
                    <h6 className="text-left mt-1 mb-2">Dips</h6>
                    <div id="dips" className="mb-3">
                      <ul className="list-group">
                        {dipsData?.map((data) => {
                          return (
                            <li className="list-group-item" key={data.dipsCode}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <label className="d-flex align-items-center">
                                    <input
                                      type="checkbox"
                                      className="mx-3 d-inline-block"
                                    />
                                    {data.dipsName}
                                  </label>
                                </div>
                                <input
                                  type="number"
                                  defaultValue={0}
                                  className="form-control mx-2"
                                  style={{ width: "75px" }}
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}

                {/* Drinks */}
                {getSpecialData?.pops && getSpecialData?.bottle && (
                  <>
                    {(getSpecialData?.pops.length > 0 ||
                      getSpecialData.bottle.length > 0) && (
                      <h6 className="text-left mt-1 mb-2">Drinks</h6>
                    )}

                    <div id="drinks" className="mb-3">
                      <ul className="list-group">
                        {getSpecialData?.pops.map((pop) => {
                          return (
                            <li
                              className="list-group-item d-flex justify-content-between align-items-center"
                              key={pop.code}
                            >
                              <label className="d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="mx-3 d-inline-block"
                                  defaultChecked={false}
                                  key={pop.code}
                                />
                                {pop.softDrinkName}
                              </label>
                              <p className="mb-0 mx-2">$ {pop.price}</p>
                            </li>
                          );
                        })}
                        {getSpecialData?.bottle.map((pop) => {
                          return (
                            <li
                              className="list-group-item d-flex justify-content-between align-items-center"
                              key={pop.code}
                            >
                              <label className="d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="mx-3 d-inline-block"
                                  defaultChecked={false}
                                  key={pop.code}
                                />
                                {pop.softDrinkName}
                              </label>
                              <p className="mb-0 mx-2">$ {pop.price}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}

                {/* Comments */}
                <h6 className="text-left mt-1 mb-2">Comments</h6>
                <div className="">
                  <textarea className="form-control" rows="4" cols="50" />
                </div>

                {/* Add to Cart Button */}
                <div className="d-flex flex-row justify-content-center align-items-center addToCartDiv mt-3 mb-3">
                  <button
                    type="button"
                    className="btn btn-sm my-1 mb-2 px-4 py-2 addToCartbtn"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </>
          ) : (
            <ul
              className="list-group"
              style={{ overflowY: "scroll", height: "30rem" }}
            >
              {specialData?.map((speicalPizza) => {
                return (
                  <li className="list-group-item" key={speicalPizza.code}>
                    <div className="d-flex justify-content-between align-items-end py-2 px-1">
                      <div className="d-flex align-items-center">
                        <img
                          className="rounded"
                          src={
                            speicalPizza.image === ""
                              ? `${specialImg1}`
                              : speicalPizza.image
                          }
                          width="50px"
                          height="50px"
                          alt=""
                        ></img>
                        <div className="d-flex flex-column mx-4">
                          <h6 className="mb-1">{speicalPizza.name}</h6>
                          <span>{speicalPizza.noofToppings} Toppings</span>
                          <span>{speicalPizza.noofPizzas} Pizzas</span>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <h6 className="mb-3">
                          $ {speicalPizza.largePizzaPrice}
                        </h6>
                        <button
                          type="button"
                          className="btn btn-sm customize py-1 px-2"
                          onClick={() => {
                            handleGetSpecial(speicalPizza);
                          }}
                        >
                          Customize
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default SpecialMenu;
