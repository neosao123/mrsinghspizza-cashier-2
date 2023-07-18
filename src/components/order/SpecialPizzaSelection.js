import React, { useEffect, useState } from "react";

function SpecialPizzaSelection({
  getSpecialData,
  count,
  toppingsData,
  setCrust,
}) {
  return (
    <>
      <div className="jumbotron">
        <h6 className="text-center">Pizza {count}</h6>
        <div className="row my-2">
          {/*  */}
          <div className="col-lg-4 col-md-4">
            <label className="mt-2 mb-1">Crust</label>
            <select
              className="form-select"
              onChange={(e) => {
                getSpecialData?.crust?.map((crustData) => {
                  if (e.target.value === crustData.crustName) {
                    setCrust({
                      crustCode: crustData.crustCode,
                      crustName: crustData.crustName,
                      crustPrice: !crustData.price ? "0" : crustData.price,
                    });
                  }
                });
              }}
            >
              {getSpecialData?.crust?.map((data) => {
                return (
                  <>
                    <option key={data.crustCode}>{data.crustName}</option>
                  </>
                );
              })}
            </select>
          </div>
          <div className="col-lg-4 col-md-4">
            <label className="mt-2 mb-1">Cheese</label>
            <select className="form-select">
              {getSpecialData?.cheese?.map((data) => {
                return (
                  <>
                    <option key={data.cheeseCode}>{data.cheeseName}</option>
                  </>
                );
              })}
            </select>
          </div>
          <div className="col-lg-4 col-md-4">
            <label className="mt-2 mb-1">Special Bases</label>
            <select className="form-select">
              {getSpecialData?.specialbases?.map((data) => {
                return (
                  <>
                    <option key={data.specialbaseCode}>
                      {data.specialbaseName} - $ {data.price}
                    </option>
                  </>
                );
              })}
            </select>
          </div>
          {/*  */}
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
            </ul>
            {/* Tab Content */}
            <div className="tab-content m-0 p-0 w-100">
              {/* Toppings */}
              <div
                id="toppings-tab"
                className="container tab-pane active m-0 p-0 topping-list"
              >
                <li className="list-group-item topping-headings">
                  <h6 className="mb-0">2 Toppings</h6>
                </li>
                {toppingsData?.toppings?.countAsTwo?.map(
                  (countAsTwoToppings) => {
                    return (
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
                    );
                  }
                )}

                <li className="list-group-item topping-headings">
                  <h6 className="mb-0">1 Toppings</h6>
                </li>
                {toppingsData?.toppings?.countAsOne?.map(
                  (countAsOneToppings) => {
                    return (
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
                    );
                  }
                )}

                <li className="list-group-item topping-headings">
                  <h6 className="mb-0">Free Toppings</h6>
                </li>
                {toppingsData?.toppings?.freeToppings?.map((freeToppings) => {
                  return (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={freeToppings.toppingsCode}
                    >
                      <label className="">
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
                  );
                })}
              </div>
            </div>
            {/* Sides */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SpecialPizzaSelection;
