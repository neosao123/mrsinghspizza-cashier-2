import React from "react";

function CreateYourOwn({ allIngredients, sidesData }) {
  return (
    <>
      <h6 className="text-center">Pizza Selection</h6>

      <div className="row my-2">
        {/* Crust, Cheese, SpecialBases */}
        <div className="col-lg-4 col-md-4">
          <label className="mt-2 mb-1">Crust</label>
          <select className="form-select">
            {allIngredients?.crust?.map((crustData) => {
              return (
                <>
                  <option key={crustData.crustCode}>
                    {crustData.crustName}
                  </option>
                </>
              );
            })}
          </select>
        </div>
        <div className="col-lg-4 col-md-4">
          <label className="mt-2 mb-1">Cheese</label>
          <select className="form-select">
            {allIngredients?.cheese?.map((cheeseData) => {
              return (
                <>
                  <option key={cheeseData.cheeseCode}>
                    {cheeseData.cheeseName}
                  </option>
                </>
              );
            })}
          </select>
        </div>
        <div className="col-lg-4 col-md-4">
          <label className="mt-2 mb-1">Special Bases</label>
          <select className="form-select">
            {allIngredients?.specialbases?.map((specialbasesData) => {
              return (
                <>
                  <option key={specialbasesData.specialbaseCode}>
                    <span>{specialbasesData.specialbaseName} - </span>
                    <span className="mx-2">${specialbasesData.price}</span>
                  </option>
                </>
              );
            })}
          </select>
        </div>

        {/* Tabs */}
        <div className="mt-3 mb-3">
          {/* Tabs Headings */}
          <ul className="nav nav-tabs mt-2" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active py-2 px-4"
                data-bs-toggle="tab"
                href="#toppings-tab"
              >
                Toppings
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link py-2 px-4"
                data-bs-toggle="tab"
                href="#sides"
              >
                Sides
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link py-2 px-4"
                data-bs-toggle="tab"
                href="#dips"
              >
                Dips
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link py-2 px-4"
                data-bs-toggle="tab"
                href="#drinks"
              >
                Drinks
              </a>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content m-0 p-0 w-100">
            {/* Toppings */}
            <div
              id="toppings-tab"
              className="container tab-pane active m-0 p-0 topping-list"
            >
              {/* Count As 2 */}
              <li className="list-group-item topping-headings">
                <h6 className="mb-0">2 Toppings</h6>
              </li>
              {allIngredients?.toppings?.countAsTwo?.map(
                (countAsTwoToppings) => {
                  return (
                    <>
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={countAsTwoToppings.toppingsCode}
                      >
                        <label className="">
                          <input
                            type="checkbox"
                            className="mx-3 d-inline-block"
                          />
                          {countAsTwoToppings.toppingsName}
                        </label>
                        <div
                          className="d-flex justify-content-between align-items-center"
                          style={{ width: "12rem" }}
                        >
                          <p
                            className="mx-2 mb-0 text-end"
                            style={{ width: "35%" }}
                          >
                            $ {countAsTwoToppings.price}
                          </p>
                          <select
                            className="form-select d-inline-block"
                            style={{ width: "65%" }}
                          >
                            <option value="1">Left Half</option>
                            <option value="2">Right Half</option>
                            <option value="3" selected>
                              Whole
                            </option>
                          </select>
                        </div>
                      </li>
                    </>
                  );
                }
              )}

              {/* Count As 1 */}
              <li className="list-group-item topping-headings">
                <h6 className="mb-0">1 Toppings</h6>
              </li>
              {allIngredients?.toppings?.countAsOne?.map(
                (countAsOneToppings) => {
                  return (
                    <>
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={countAsOneToppings.toppingsCode}
                      >
                        <label className="">
                          <input
                            type="checkbox"
                            className="mx-3 d-inline-block"
                          />
                          {countAsOneToppings.toppingsName}
                        </label>
                        <div
                          className="d-flex justify-content-between align-items-center"
                          style={{ width: "12rem" }}
                        >
                          <p
                            className="mx-2 mb-0 text-end"
                            style={{ width: "35%" }}
                          >
                            $ {countAsOneToppings.price}
                          </p>
                          <select
                            className="form-select d-inline-block"
                            style={{ width: "65%" }}
                          >
                            <option value="1">Left Half</option>
                            <option value="2">Right Half</option>
                            <option value="3" selected>
                              Whole
                            </option>
                          </select>
                        </div>
                      </li>
                    </>
                  );
                }
              )}

              {/* Free Toppings */}
              <li className="list-group-item topping-headings">
                <h6 className="mb-0">Free Toppings</h6>
              </li>
              {allIngredients?.toppings?.freeToppings?.map((freeToppings) => {
                return (
                  <>
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={freeToppings.toppingsCode}
                    >
                      <label className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="mx-3 d-inline-block"
                        />
                        {freeToppings.toppingsName}
                      </label>
                      <div
                        className="d-flex justify-content-between align-items-center"
                        style={{ width: "12rem" }}
                      >
                        <p
                          className="mx-2 mb-0 text-end"
                          style={{ width: "35%" }}
                        >
                          $ 0
                        </p>
                        <select
                          className="form-select d-inline-block"
                          style={{ width: "65%" }}
                        >
                          <option value="1">Left Half</option>
                          <option value="2">Right Half</option>
                          <option value="3" selected>
                            Whole
                          </option>
                        </select>
                      </div>
                    </li>
                  </>
                );
              })}
            </div>

            {/* Sides */}
            <div id="sides" className="container tab-pane m-0 p-0 topping-list">
              {sidesData?.map((sidesData) => {
                return (
                  <>
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={sidesData.sideCode}
                    >
                      <label className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="mx-3 d-inline-block"
                        />
                        {sidesData.sideName}
                      </label>
                      <div style={{ width: "12rem" }}>
                        <select className="form-select w-100 d-inline-block">
                          {sidesData.combination.map((combination) => {
                            return (
                              <option key={combination.lineCode}>
                                <span>{combination.size} - </span>
                                <span className="mb-0 mx-2">
                                  $ {combination.price}
                                </span>
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </li>
                  </>
                );
              })}
            </div>

            {/* Dips */}
            <div id="dips" className="container tab-pane m-0 p-0 topping-list">
              {allIngredients?.dips?.map((dipsData) => {
                return (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={dipsData.dipsCode}
                  >
                    <label className="d-flex align-items-center">
                      <input type="checkbox" className="mx-3 d-inline-block" />
                      {dipsData.dipsName}
                    </label>
                    <p className="mb-0 mx-2">$ {dipsData.price}</p>
                  </li>
                );
              })}
            </div>

            {/* Drinks */}
            <div
              id="drinks"
              className="container tab-pane m-0 p-0 topping-list"
            >
              {allIngredients?.softdrinks?.map((softdrinksData) => {
                return (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={softdrinksData.softdrinkCode}
                  >
                    <label className="d-flex align-items-center">
                      <input type="checkbox" className="mx-3 d-inline-block" />
                      {softdrinksData.softDrinksName}
                    </label>
                    <p className="mb-0 mx-2">$ {softdrinksData.price}</p>
                  </li>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comments */}
        <h6 className="text-left mt-1">Comments</h6>
        <div className="">
          <textarea className="form-control" rows="4" cols="50" />
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="d-flex flex-row justify-content-center align-items-center addToCartDiv mb-3">
        <button
          type="submit"
          className="btn btn-sm my-1 mb-2 px-4 py-2 addToCartbtn"
        >
          Add to Cart
        </button>
      </div>
    </>
  );
}

export default CreateYourOwn;
