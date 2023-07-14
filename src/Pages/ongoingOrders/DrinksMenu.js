import React, { useEffect, useState } from "react";
import { softDrinksApi } from "../../API/ongoingOrder";
import specialImg1 from "../../assets/bg-img.jpg";

function DrinksMenu() {
  const [softDrinksData, setSoftDrinksData] = useState();

  useEffect(() => {
    drinks();
  }, []);

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
                      defaultValue={0}
                      className="form-control"
                      style={{ width: "20%" }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm customize py-1 px-2"
                      style={{ width: "auto" }}
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
