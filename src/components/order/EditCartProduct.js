import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import $ from "jquery";
import { updateCartApi } from "../../API/ongoingOrder";
import { toast } from "react-toastify";

function EditCartProduct({
  allIngredients,
  sidesData,
  customerName,
  mobileNumber,
  address,
  deliveryType,
  storeLocation,
  discount,
  taxPer,
  getCartList,
  cartLineCode,
  cartCode,
}) {
  // Selected State
  const [selectedSize, setSelectedSize] = useState();
  const [selectedPrice, setSelectedPrice] = useState();
  const [selectedCrust, setSelectedCrust] = useState();
  const [selectedCheese, setSelectedCheese] = useState();
  const [selectedSB, setSelectedSB] = useState();
  const [selectedDips, setSelectedDips] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedLineCode, setSelectedLineCode] = useState([]);
  const [selectedTwoTps, setSelectedTwoTps] = useState([]);
  const [selectedOneTps, setSelectedOneTps] = useState([]);
  const [selectedFreeTps, setSelectedFreeTps] = useState([]);

  // Global Context
  const globalCtx = useContext(GlobalContext);
  const [cartItemDetails, setCartItemDetails] = globalCtx.cartItem;

  // handle Change State - Updated Data
  const [crust, setCrust] = useState({});
  const [cheese, setCheese] = useState({});
  const [specialBases, setSpecialBases] = useState({});
  const [dips, setDips] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [pizzaSize, setPizzaSize] = useState();
  const [comments, setComments] = useState("");
  const [countTwoToppingsArr, setCountTwoToppingsArr] = useState([]);
  const [countOneToppingsArr, setCountOneToppingsArr] = useState([]);
  const [freeToppingsArr, setFreeToppingsArr] = useState([]);
  const [sidesArr, setSideArr] = useState([]);
  const [price, setPrice] = useState(0);
  const [count, setCount] = useState(0);

  const CartData = localStorage.getItem("CartData"); 
  const customerCode = localStorage.getItem("customerCode");

  // Add To Cart - API Payload
  const payload = {
    cartCode: cartCode,
    cartLineCode: cartLineCode,
    customerCode: customerCode,
    customerName: customerName,
    mobileNumber: mobileNumber,
    address: address,
    deliveryType: "pickup",
    storeLocation: storeLocation,
    productCode: cartItemDetails?.productCode
      ? cartItemDetails?.productCode
      : "#NA",
    productName: cartItemDetails?.productName
      ? cartItemDetails?.productName
      : "#NA",
    productType: "Pizza",
    config: {
      pizza: [
        {
          crust: crust ? crust : selectedCrust,
          cheese: cheese ? cheese : selectedCheese,
          specialBases: specialBases ? specialBases : selectedSB,
          toppings: {
            countAsTwoToppings: countTwoToppingsArr
              ? countTwoToppingsArr
              : selectedTwoTps,
            countAsOneToppings: countOneToppingsArr
              ? countOneToppingsArr
              : selectedOneTps,
            freeToppings: freeToppingsArr ? freeToppingsArr : selectedFreeTps,
          },
        },
      ],
      sides: sidesArr ? sidesArr : selectedSides,
      dips: dips ? dips : selectedDips,
      drinks: drinks ? drinks : selectedDrinks,
    },
    quantity: "1",
    price: price,
    amount: price,
    pizzaSize: pizzaSize,
    discountAmount: discount,
    taxPer: taxPer,
  };

  // Onclick Add To Cart Button
  const handleAddToCart = async (e) => {
    e.preventDefault();
    await updateCartApi(payload)
      .then((res) => {
        localStorage.setItem("CartData", JSON.stringify(res.data.data));
        //clear fields from create your own
        getCartList();
        toast.success(`Custom Pizza Added Successfully...`);
      })
      .catch((err) => {
        console.log("Error From All Ingredient API: ", err);
      });
    console.log("Data Succefully Store in Add To Cart.....", payload);
  };

  // handle Selected State
  const handleSelectedState = () => {
    const pizzaSelected = cartItemDetails?.config?.pizza;
    const dipsSelected = cartItemDetails?.config?.dips;
    const drinksSelected = cartItemDetails?.config?.drinks;
    const sidesSelected = cartItemDetails?.config?.sides;

    setSelectedPrice(cartItemDetails?.price); //Selected Price
    setSelectedSize(cartItemDetails?.pizzaSize); //Selected Pizza Size
    // Selected Crust Code
    pizzaSelected?.map((items) => {
      const crustCode = items?.crust?.crustCode;
      if (crustCode !== undefined && crustCode !== "") {
        setSelectedCrust(crustCode);
      }
    });
    // Selected Cheese Code
    pizzaSelected?.map((items) => {
      const cheeseCode = items?.cheese?.cheeseCode;
      if (cheeseCode !== undefined && cheeseCode !== "") {
        setSelectedCheese(cheeseCode);
      }
    });
    // Selected SpecialBases Code
    pizzaSelected?.map((items) => {
      const SBcode = items?.specialBases?.specialbaseCode;
      if (SBcode !== undefined && SBcode !== "") {
        setSelectedSB(SBcode);
      }
    });
    // Selected Dips Code
    if (dipsSelected && dipsSelected.length > 0) {
      const dipsCode = dipsSelected.map((dip) => dip.dipsCode);
      setSelectedDips(dipsCode);
    }
    // Selected Drinks Code
    if (drinksSelected && drinksSelected.length > 0) {
      const drinkCode = drinksSelected.map((drinks) => drinks.drinksCode);
      setSelectedDrinks(drinkCode);
    }
    // Selected Sides Code
    if (sidesSelected && sidesSelected.length > 0) {
      const sidesCode = sidesSelected.map((sides) => sides.sidesCode);
      const lineCode = sidesSelected.map((combination) => combination.lineCode);
      // console.log(lineCode);
      setSelectedSides(sidesCode);
      setSelectedLineCode(lineCode);
    }
    // Selected Count As Two Toppings Code
    pizzaSelected.map((items) => {
      const countTwoTpsSelected = items.toppings.countAsTwoToppings;
      console.log("countTwoTpsSelected : ", countTwoTpsSelected);
      if (countTwoTpsSelected && countTwoTpsSelected.length > 0) {
        let toppingsObj;
        const toppingData = countTwoTpsSelected.map((toppings) => {
          const toppingCode = toppings.toppingsCode;
          const placement = toppings.toppingsPlacement;
          toppingsObj = {
            selectedCode: toppingCode,
            selectedPlacement: placement,
          };
          return toppingsObj;
        });
        setSelectedTwoTps(toppingData);
      }
    });
    // Selected Count As One Toppings Code
    pizzaSelected.map((items) => {
      const countOneTpsSelected = items.toppings.countAsOneToppings;
      console.log("countTwoTpsSelected : ", countOneTpsSelected);
      if (countOneTpsSelected && countOneTpsSelected.length > 0) {
        let toppingsObj;
        const toppingData = countOneTpsSelected.map((toppings) => {
          const toppingCode = toppings.toppingsCode;
          const placement = toppings.toppingsPlacement;
          toppingsObj = {
            selectedCode: toppingCode,
            selectedPlacement: placement,
          };
          return toppingsObj;
        });
        setSelectedOneTps(toppingData);
      }
    });
    // Selected Free Toppings Code
    pizzaSelected.map((items) => {
      const freeTpsSelected = items.toppings.freeToppings;
      console.log("countTwoTpsSelected : ", freeTpsSelected);
      if (freeTpsSelected && freeTpsSelected.length > 0) {
        let toppingsObj;
        const toppingData = freeTpsSelected.map((toppings) => {
          const toppingCode = toppings.toppingsCode;
          const placement = toppings.toppingsPlacement;
          toppingsObj = {
            selectedCode: toppingCode,
            selectedPlacement: placement,
          };
          return toppingsObj;
        });
        setSelectedFreeTps(toppingData);
      }
    });
  };

  // Calculate Price
  const calculatePrice = () => {
    let calculatePrice = 0;
    let crust_price = $("#crust").find(":selected").attr("data-price") || 0;
    let cheese_price = $("#cheese").find(":selected").attr("data-price") || 0;
    let specialbase_price =
      $("#specialbase").find(":selected").attr("data-price") || 0;
    let totalSidesPrice = Number(0);
    let totalTwoToppings = Number(0);
    let totalOneToppings = Number(0);
    let totalFreeToppings = Number(0);
    let totalDips = Number(0);
    let totalDrinks = Number(0);

    countTwoToppingsArr.map(
      (two) => (totalTwoToppings += Number(two.toppingsPrice))
    );
    countOneToppingsArr.map(
      (one) => (totalOneToppings += Number(one.toppingsPrice))
    );
    freeToppingsArr.map((free) => (totalFreeToppings += 0));
    sidesArr.map((side) => (totalSidesPrice += Number(side.sidesPrice)));
    dips.map((dips) => (totalDips += Number(dips.dipsPrice)));
    drinks.map((drinks) => (totalDrinks += Number(drinks.drinksPrice)));

    calculatePrice += Number(crust_price);
    calculatePrice += Number(cheese_price);
    calculatePrice += Number(specialbase_price);
    calculatePrice += totalSidesPrice;
    calculatePrice += totalTwoToppings;
    calculatePrice += totalOneToppings;
    calculatePrice += totalFreeToppings;
    calculatePrice += totalDips;
    calculatePrice += totalDrinks;

    setPrice(calculatePrice);
  };

  // handle Pizza Size
  const handlePizzaSize = (e) => {
    setPizzaSize(e.target.value);
  };

  // handle Crust
  const handleCrust = async (e) => {
    console.log("crust onchange : ", e.target.value);
    allIngredients?.crust?.map((crustData) => {
      if (e.target.value.split(" -")[0] === crustData.crustName) {
        setCrust({
          crustCode: crustData.crustCode,
          crustName: crustData.crustName,
          crustPrice: crustData.price ? crustData.price : "0",
        });
        calculatePrice();
      }
    });
  };
  // handle Cheese
  const handleCheese = (e) => {
    allIngredients?.cheese?.map((cheeseData) => {
      if (e.target.value.split(" -")[0] === cheeseData.cheeseName) {
        setCheese({
          cheeseCode: cheeseData.cheeseCode,
          cheeseName: cheeseData.cheeseName,
          cheesePrice: cheeseData.price ? cheeseData.price : "0",
        });
        calculatePrice();
      }
    });
  };
  // handle SpecialBases
  const handleSpecialBases = (e) => {
    allIngredients?.specialbases?.map((specialBasesData) => {
      if (e.target.value.split(" -")[0] === specialBasesData.specialbaseName) {
        setSpecialBases({
          specialbaseCode: specialBasesData.specialbaseCode,
          specialbaseName: specialBasesData.specialbaseName,
          specialbasePrice: specialBasesData.price
            ? specialBasesData.price
            : "0",
        });
        calculatePrice();
      }
    });
  };

  // handle Two Toppings
  const handleTwoToppings = (e, index, toppingCode) => {
    const { checked } = e.target;
    if (checked) {
      const selectedTopping = allIngredients?.toppings?.countAsTwo.filter(
        (topping) => topping.toppingsCode === toppingCode
      );
      let placement = "whole";
      const placementValue = $("#placement-" + toppingCode).val();
      if (placementValue !== "" && placementValue !== undefined) {
        placement = placementValue;
      }
      const toppingObj = {
        toppingsCode: selectedTopping[0].toppingsCode,
        toppingsName: selectedTopping[0].toppingsName,
        toppingsPrice: selectedTopping[0].price
          ? selectedTopping[0].price
          : "0",
        toppingsPlacement: placement,
      };

      setCountTwoToppingsArr((prevToppings) => [...prevToppings, toppingObj]);
    } else {
      setCountTwoToppingsArr((prevToppings) =>
        prevToppings.filter(
          (toppingObj) => toppingObj.toppingsCode !== toppingCode
        )
      );
    }
  };
  // handle Two Toppings Placement
  const handleCountTwoPlacementChange = (e, toppingCode) => {
    const placement = e.target.value;
    const filteredToppings = countTwoToppingsArr.filter(
      (topping) => topping.toppingsCode === toppingCode
    );
    if (filteredToppings.length > 0) {
      let filteredTopping = filteredToppings[0];
      filteredTopping.toppingsPlacement = placement;
    }
  };

  // handle One Toppings
  const handleOneToppings = (e, toppingCode) => {
    const { checked } = e.target;
    if (checked) {
      const selectedTopping = allIngredients?.toppings?.countAsOne.filter(
        (topping) => topping.toppingsCode === toppingCode
      );

      let placement = "whole";
      const placementValue = $("#placement-" + toppingCode).val();
      if (placementValue !== "" && placementValue !== undefined) {
        placement = placementValue;
      }
      const toppingObj = {
        toppingsCode: selectedTopping[0].toppingsCode,
        toppingsName: selectedTopping[0].toppingsName,
        toppingsPrice: selectedTopping[0].price
          ? selectedTopping[0].price
          : "0",
        toppingsPlacement: placement,
      };

      setCountOneToppingsArr((prevToppings) => [...prevToppings, toppingObj]);
    } else {
      setCountOneToppingsArr((prevToppings) =>
        prevToppings.filter(
          (toppingObj) => toppingObj.toppingsCode !== toppingCode
        )
      );
    }
  };
  // handle One Toppings Placement
  const handleCountOnePlacementChange = (e, toppingCode) => {
    const placement = e.target.value;
    const filteredToppings = countOneToppingsArr.filter(
      (topping) => topping.toppingsCode === toppingCode
    );
    if (filteredToppings.length > 0) {
      let filteredTopping = filteredToppings[0];
      filteredTopping.toppingsPlacement = placement;
    }
  };

  // handle Free Toppings
  const handleFreeToppings = (e, toppingCode) => {
    const { checked } = e.target;
    if (checked) {
      const selectedTopping = allIngredients?.toppings?.freeToppings.filter(
        (topping) => topping.toppingsCode === toppingCode
      );

      let placement = "whole";
      const placementValue = $("#placement-" + toppingCode).val();
      if (placementValue !== "" && placementValue !== undefined) {
        placement = placementValue;
      }
      const toppingObj = {
        toppingsCode: selectedTopping[0].toppingsCode,
        toppingsName: selectedTopping[0].toppingsName,
        toppingsPrice: selectedTopping[0].price
          ? selectedTopping[0].price
          : "0",
        toppingsPlacement: placement,
      };

      setFreeToppingsArr((prevToppings) => [...prevToppings, toppingObj]);
    } else {
      setFreeToppingsArr((prevToppings) =>
        prevToppings.filter(
          (toppingObj) => toppingObj.toppingsCode !== toppingCode
        )
      );
    }
  };
  // handle Free Toppings Placement
  const handleFreePlacementChange = (e, toppingCode) => {
    const placement = e.target.value;
    const filteredToppings = freeToppingsArr.filter(
      (topping) => topping.toppingsCode === toppingCode
    );
    if (filteredToppings.length > 0) {
      let filteredTopping = filteredToppings[0];
      filteredTopping.toppingsPlacement = placement;
    }
  };

  // handle Sides
  const handleSides = (e, sideCode) => {
    const { checked } = e.target;
    if (checked) {
      const selectSides = sidesData?.filter(
        (sides) => sides.sideCode === sideCode
      );
      let lineCode = $("#placement-" + sideCode)
        .find(":selected")
        .attr("data-key");
      let size = $("#placement-" + sideCode)
        .find(":selected")
        .attr("data-size");
      let price = $("#placement-" + sideCode)
        .find(":selected")
        .attr("data-price");
      const sidesObj = {
        sidesCode: selectSides[0].sideCode,
        sidesName: selectSides[0].sideName,
        sidesType: selectSides[0].type,
        lineCode: lineCode,
        sidesPrice: price ? price : "0",
        sidesSize: size,
      };
      setSideArr((prevSides) => [...prevSides, sidesObj]);
    } else {
      setSideArr((prevSides) =>
        prevSides.filter((sidesObj) => sidesObj.sidesCode !== sideCode)
      );
    }
  };
  // handle Sides Placement
  const handleSidePlacementChange = (e, sideCode) => {
    const lineCode = $("#placement-" + sideCode)
      .find(":selected")
      .attr("data-key");
    let size = $("#placement-" + sideCode)
      .find(":selected")
      .attr("data-size");
    let price = $("#placement-" + sideCode)
      .find(":selected")
      .attr("data-price");
    const filteredSides = sidesArr.filter(
      (sides) => sides.sidesCode === sideCode
    );
    if (filteredSides.length > 0) {
      let filteredSide = filteredSides[0];
      filteredSide.lineCode = lineCode;
      filteredSide.sidesPrice = price;
      filteredSide.sidesSize = size;
    }
    setCount((prevCount) => prevCount + 1);
  };

  // handle Dips
  const handleDips = (e, code) => {
    const selectedDips = allIngredients?.dips.filter(
      (dips) => dips.dipsCode === code
    );
    if (selectedDips.length > 0) {
      let dipsObj = {
        dipsCode: selectedDips[0].dipsCode,
        dipsName: selectedDips[0].dipsName,
        dipsPrice: selectedDips[0].price ? selectedDips[0].price : "0",
      };
      if (e.target.checked === true) {
        setDips([...dips, dipsObj]);
        calculatePrice();
      } else {
        const newDips = dips.filter(
          (newDips) => newDips.dipsCode !== dipsObj.dipsCode
        );
        setDips(newDips);
      }
    }
  };

  // handle Drinks
  const handleDrinks = (e, code) => {
    const selectedDrinks = allIngredients?.softdrinks.filter(
      (drinks) => drinks.softdrinkCode === code
    );
    if (selectedDrinks.length > 0) {
      let drinksObj = {
        drinksCode: selectedDrinks[0].softdrinkCode,
        drinksName: selectedDrinks[0].softDrinksName,
        drinksPrice: selectedDrinks[0].price ? selectedDrinks[0].price : "0",
      };
      if (e.target.checked === true) {
        setDrinks([...drinks, drinksObj]);
      } else {
        const newDrinks = drinks.filter(
          (updatedDrinks) => updatedDrinks.drinksCode !== drinksObj.drinksCode
        );
        setDrinks(newDrinks);
      }
    }
  };

  useEffect(() => {
    handleSelectedState();
  }, [crust]);

  useEffect(() => {
    calculatePrice();
  }, [
    sidesArr,
    countTwoToppingsArr,
    countOneToppingsArr,
    freeToppingsArr,
    dips,
    drinks,
    count,
  ]);

  return (
    <>
      <h6 className="text-center">Edit Pizza</h6>
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-center align-items-center">
          <span>Size: </span>
          <select
            className="form-select mx-2"
            value={pizzaSize}
            onChange={(e) => handlePizzaSize(e)}
          >
            <>
              <option selected={selectedSize === "Large" ? true : false}>
                Large
              </option>
              <option selected={selectedSize === "Extra Large" ? true : false}>
                Extra Large
              </option>
            </>
          </select>
        </div>
        <h6 className="">
          <span className="mx-2">${selectedPrice}</span>
        </h6>
      </div>
      <div className="row my-2">
        {/* Crust, Cheese, SpecialBases */}
        <div className="col-lg-4 col-md-4">
          <label className="mt-2 mb-1">Crust</label>
          <select
            className="form-select"
            id="crust"
            onChange={(e) => handleCrust(e)}
          >
            {allIngredients?.crust?.map((crustData) => {
              let crustCode = crustData.crustCode;
              return (
                <>
                  <option
                    selected={selectedCrust === crustCode ? true : false}
                    key={crustCode}
                    // value={selectedCrust}
                    data-price={crustData.price}
                  >
                    {crustData.crustName} - $ {crustData.price}
                  </option>
                </>
              );
            })}
          </select>
        </div>
        <div className="col-lg-4 col-md-4">
          <label className="mt-2 mb-1">Cheese</label>
          <select
            className="form-select"
            id="cheese"
            onChange={(e) => handleCheese(e)}
          >
            {allIngredients?.cheese?.map((cheeseData) => {
              let cheeseCode = cheeseData.cheeseCode;
              return (
                <>
                  <option
                    selected={selectedCheese === cheeseCode ? true : false}
                    key={cheeseCode}
                    data-price={cheeseData.price}
                  >
                    {cheeseData.cheeseName} - $ {cheeseData.price}
                  </option>
                </>
              );
            })}
          </select>
        </div>
        <div className="col-lg-4 col-md-4">
          <label className="mt-2 mb-1">Special Bases</label>
          <select
            className="form-select"
            id="specialbase"
            onChange={(e) => handleSpecialBases(e)}
          >
            {allIngredients?.specialbases?.map((specialbasesData) => {
              return (
                <>
                  <option
                    key={specialbasesData.specialbaseCode}
                    data-price={specialbasesData.price}
                    selected={
                      selectedSB === specialbasesData.specialbaseCode
                        ? true
                        : false
                    }
                  >
                    {specialbasesData.specialbaseName} - $
                    {specialbasesData.price}
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
              <Link
                className="nav-link active py-2 px-4"
                data-bs-toggle="tab"
                to="#toppings-count-2-tab"
              >
                Toppings (2)
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link py-2 px-4"
                data-bs-toggle="tab"
                to="#toppings-count-1-tab"
              >
                Toppings (1)
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link py-2 px-4"
                data-bs-toggle="tab"
                to="#toppings-free-tab"
              >
                Indian Toppings (Free)
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link py-2 px-4"
                data-bs-toggle="tab"
                to="#sides"
              >
                Sides
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link py-2 px-4"
                data-bs-toggle="tab"
                to="#dips"
              >
                Dips
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link py-2 px-4"
                data-bs-toggle="tab"
                to="#drinks"
              >
                Drinks
              </Link>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content m-0 p-0 w-100">
            {/* Count 2 Toppings */}
            <div
              id="toppings-count-2-tab"
              className="container tab-pane active m-0 p-0 topping-list"
            >
              {allIngredients?.toppings?.countAsTwo?.map(
                (countAsTwoToppings, index) => {
                  const toppingCode = countAsTwoToppings.toppingsCode;
                  const isSelected =
                    selectedTwoTps.find(
                      (data) => data.selectedCode === toppingCode
                    ) ?? false;
                  const toppingPlacement = isSelected
                    ? isSelected.selectedPlacement
                    : "whole";
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
                            checked={isSelected ? true : false}
                            onChange={(e) => handleTwoToppings(e, toppingCode)}
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
                            id={"placement-" + toppingCode}
                            onChange={(e) =>
                              handleCountTwoPlacementChange(e, toppingCode)
                            }
                          >
                            <option
                              selected={
                                toppingPlacement === "whole" ? true : false
                              }
                              value="whole"
                            >
                              Whole
                            </option>
                            <option
                              selected={
                                toppingPlacement === "lefthalf" ? true : false
                              }
                              value="lefthalf"
                            >
                              Left Half
                            </option>
                            <option
                              selected={
                                toppingPlacement === "righthalf" ? true : false
                              }
                              value="righthalf"
                            >
                              Right Half
                            </option>
                          </select>
                        </div>
                      </li>
                    </>
                  );
                }
              )}
            </div>
            {/* Count 1 Toppings */}
            <div
              id="toppings-count-1-tab"
              className="container tab-pane m-0 p-0 topping-list"
            >
              {allIngredients?.toppings?.countAsOne?.map(
                (countAsOneToppings, index) => {
                  const toppingCode = countAsOneToppings.toppingsCode;
                  const isSelected =
                    selectedOneTps.find(
                      (data) => data.selectedCode === toppingCode
                    ) ?? false;
                  const toppingPlacement = isSelected
                    ? isSelected.selectedPlacement
                    : "whole";
                  return (
                    <>
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={toppingCode}
                      >
                        <label className="">
                          <input
                            type="checkbox"
                            className="mx-3 d-inline-block"
                            checked={isSelected ? true : false}
                            onChange={(e) => handleOneToppings(e, toppingCode)}
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
                            id={"placement-" + toppingCode}
                            onChange={(e) =>
                              handleCountOnePlacementChange(e, toppingCode)
                            }
                          >
                            <option
                              value="whole"
                              selected={
                                toppingPlacement === "whole" ? true : false
                              }
                            >
                              Whole
                            </option>
                            <option
                              value="lefthalf"
                              selected={
                                toppingPlacement === "lefthalf" ? true : false
                              }
                            >
                              Left Half
                            </option>
                            <option
                              value="righthalf"
                              selected={
                                toppingPlacement === "righthalf" ? true : false
                              }
                            >
                              Right Half
                            </option>
                          </select>
                        </div>
                      </li>
                    </>
                  );
                }
              )}
            </div>
            {/* Free Toppings */}
            <div
              id="toppings-free-tab"
              className="container tab-pane m-0 p-0 topping-list"
            >
              {allIngredients?.toppings?.freeToppings?.map(
                (freeToppings, index) => {
                  const toppingCode = freeToppings.toppingsCode;
                  const isSelected =
                    selectedFreeTps.find(
                      (data) => data.selectedCode === toppingCode
                    ) ?? false;
                  const toppingPlacement = isSelected
                    ? isSelected.selectedPlacement
                    : "whole";
                  return (
                    <>
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={toppingCode}
                      >
                        <label className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            className="mx-3 d-inline-block"
                            checked={isSelected ? true : false}
                            onChange={(e) => handleFreeToppings(e, toppingCode)}
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
                            data-topping-area={toppingCode}
                            className="form-select d-inline-block"
                            style={{ width: "65%" }}
                            id={"placement-" + toppingCode}
                            onChange={(e) =>
                              handleFreePlacementChange(e, toppingCode)
                            }
                          >
                            <option
                              value="whole"
                              selected={
                                toppingPlacement === "whole" ? true : false
                              }
                            >
                              Whole
                            </option>
                            <option
                              value="lefthalf"
                              selected={
                                toppingPlacement === "lefthalf" ? true : false
                              }
                            >
                              Left Half
                            </option>
                            <option
                              value="righthalf"
                              selected={
                                toppingPlacement === "righthalf" ? true : false
                              }
                            >
                              Right Half
                            </option>
                          </select>
                        </div>
                      </li>
                    </>
                  );
                }
              )}
            </div>

            {/* Sides */}
            <div id="sides" className="container tab-pane m-0 p-0 topping-list">
              {sidesData?.map((sidesData) => {
                const sidesCode = sidesData.sideCode;
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
                          checked={
                            selectedSides.includes(sidesCode) ? true : false
                          }
                          onChange={(e) => handleSides(e, sidesCode)}
                        />
                        {sidesData.sideName}
                      </label>
                      <div style={{ width: "12rem" }}>
                        <select
                          className="form-select w-100 d-inline-block"
                          id={"placement-" + sidesCode}
                        >
                          {sidesData.combination.map((combination) => {
                            const lineCode = combination.lineCode;
                            return (
                              <option
                                key={combination.lineCode}
                                data-key={combination.lineCode}
                                data-price={combination.price}
                                data-size={combination.size}
                                selected={
                                  selectedLineCode.includes(lineCode)
                                    ? true
                                    : false
                                }
                                onChange={(e) =>
                                  handleSidePlacementChange(e, sidesCode)
                                }
                              >
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
                      <input
                        type="checkbox"
                        className="mx-3 d-inline-block"
                        checked={
                          selectedDips.includes(dipsData.dipsCode)
                            ? true
                            : false
                        }
                        onChange={(e) => handleDips(e, dipsData.dipsCode)}
                      />
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
              {allIngredients?.softdrinks?.map((drinksData) => {
                return (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={drinksData.softdrinkCode}
                  >
                    <label className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="mx-3 d-inline-block"
                        checked={
                          selectedDrinks.includes(drinksData.softdrinkCode)
                            ? true
                            : false
                        }
                        onChange={(e) =>
                          handleDrinks(e, drinksData.softdrinkCode)
                        }
                      />
                      {drinksData.softDrinksName}
                    </label>
                    <p className="mb-0 mx-2">$ {drinksData.price}</p>
                  </li>
                );
              })}
            </div>
          </div>
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

export default EditCartProduct;
