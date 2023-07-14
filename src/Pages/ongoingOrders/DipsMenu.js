import React, { useEffect, useState } from "react";
import { dipsApi } from "../../API/ongoingOrder";
import specialImg1 from "../../assets/bg-img.jpg";

function DipsMenu() {
  const [dipsData, setDipsData] = useState();

  useEffect(() => {
    dips();
  }, []);

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

export default DipsMenu;
