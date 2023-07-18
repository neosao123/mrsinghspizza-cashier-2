import React, { useEffect, useState } from "react";
import { sidesApi } from "../../API/ongoingOrder";
import specialImg1 from "../../assets/bg-img.jpg";

function SidesMenu() {
  const [sidesData, setSidesData] = useState();

  useEffect(() => {
    sides();
  }, []);

  const sides = () => {
    sidesApi()
      .then((res) => {
        setSidesData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From SidesMenu API: ", err);
      });
  };

  return (
    <>
      <ul
        className="list-group"
        style={{ overflowY: "scroll", height: "30rem" }}
      >
        {sidesData?.map((data) => {
          return (
            <li className="list-group-item" key={data.sideCode}>
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
                    <h6 className="mb-2">{data.sideName}</h6>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <select className="form-select" style={{ width: "35%" }}>
                      {data?.combination?.map((combinationData) => {
                        return (
                          <>
                            <option key={combinationData.lineCode}>
                              {combinationData.size} - $ {combinationData.price}
                            </option>
                          </>
                        );
                      })}
                    </select>
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
export default SidesMenu;
