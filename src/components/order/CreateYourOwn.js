import React, { useEffect, useState } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import EditCartProduct from "./EditCartProduct";
import {
  SelectDropDownCheese,
  SelectDropDownCook,
  SelectDropDownCrust,
  SelectDropDownSause,
  SelectDropDownSpecialBases,
  SelectDropDownSpicy,
} from "./createYourOwn/selectDropDown";
import {} from "./createYourOwn/selectDropDown";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCart } from "../../reducer/cartReducer";
import { resetFields } from "./createYourOwn/createYourOwnFn";

function CreateYourOwn({
  allIngredients,
  sidesData,
  discount,
  taxPer,
  getCartList,
  isEdit,
  cartLineCode,
  cartCode,
  payloadEdit,
  setPayloadEdit,
}) {
  const [dips, setDips] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [pizzaSize, setPizzaSize] = useState("Large");
  const [comments, setComments] = useState("");
  const [countTwoToppingsArr, setCountTwoToppingsArr] = useState([]);
  const [countOneToppingsArr, setCountOneToppingsArr] = useState([]);
  const [freeToppingsArr, setFreeToppingsArr] = useState([]);
  const [sidesArr, setSideArr] = useState([]);
  const [price, setPrice] = useState(0);
  const [count, setCount] = useState(0);
  const [allCheckBoxes, setAllCheckBoxes] = useState([]);
  const [sizesOfPizza, setSizesOfPizza] = useState(["Large", "Extra Large"]);
  const [sizesOfPizzaSelected, setSizesOfPizzaSelected] = useState(
    sizesOfPizza[0]
  );
  const [spicySelected, setSpicySelected] = useState();
  const [sauseSelected, setSauseSelected] = useState();
  const [cookSelected, setCookSelected] = useState();
  const [crustSelected, setCrustSelected] = useState();
  const [cheeseSelected, setCheeseSelected] = useState();
  const [specialBasesSelected, setSpecialBasesSelected] = useState();
  const [isAllIndiansTps, setIsAllIndiansTps] = useState(false);
  const dispatch = useDispatch();

  // Calculate Price
  const calculatePrice = () => {
    let calculatePrice = 0;

    let crust_price = crustSelected?.price ? crustSelected?.price : 0;
    let cheese_price = cheeseSelected?.price ? cheeseSelected?.price : 0;
    let specialbase_price = specialBasesSelected?.price
      ? specialBasesSelected?.price
      : 0;
    let cook_price = cookSelected?.price ? cookSelected?.price : 0;
    let sause_price = sauseSelected?.price ? sauseSelected?.price : 0;
    let spicy_price = spicySelected?.price ? spicySelected?.price : 0;

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
    sidesArr.map((side) => (totalSidesPrice += Number(side.sidePrice)));
    dips.map((dips) => (totalDips += Number(dips.dipsPrice)));
    drinks.map((drinks) => (totalDrinks += Number(drinks.drinksPrice)));
    calculatePrice += Number(cook_price);
    calculatePrice += Number(sause_price);
    calculatePrice += Number(spicy_price);
    calculatePrice += Number(crust_price);
    calculatePrice += Number(cheese_price);
    calculatePrice += Number(specialbase_price);
    calculatePrice += totalSidesPrice;
    calculatePrice += totalTwoToppings;
    calculatePrice += totalOneToppings;
    calculatePrice += totalFreeToppings;
    calculatePrice += totalDips;
    calculatePrice += totalDrinks;
    let priceBySize = sizesOfPizzaSelected === "Large" ? 11.49 : 16.49;
    calculatePrice += priceBySize;

    setPrice(calculatePrice.toFixed(2));
  };
  let cartdata = useSelector((state) => state.cart.cart);

  const updateInCart = (data) => {
    let cart = JSON.parse(localStorage.getItem("CartData"));
    let OneTopping = data?.countAs1Arr
      ? data?.countAs1Arr
      : countOneToppingsArr;

    let TwoTopping = data?.countAs2Arr
      ? data?.countAs2Arr
      : countTwoToppingsArr;
    let freeTopping = data?.freeTpsArr ? data?.freeTpsArr : freeToppingsArr;
    let dipsArray = data?.dipsArr ? data?.dipsArr : dips;
    let sidesArray = data?.sidesArr ? data?.sidesArr : sidesArr;
    let drinksArray = data?.drinksArr ? data?.drinksArr : drinks;

    let tempPayload = [...cartdata];
    let itemId =
      payloadEdit !== undefined && payloadEdit.productType === "custom_pizza"
        ? payloadEdit?.id
        : "#NA";
    let toUpdateCartIndex = null;
    let updatedCartId = cartdata?.findIndex(
      (item) => item?.id === payloadEdit?.id
    );
    if (updatedCartId === -1) {
      const updatedCartId2 = cartdata?.findIndex(
        (item) => item?.productCode === "#NA"
      );

      updatedCartId = updatedCartId2;
    }
    console.log(updatedCartId, "special pizza payload");
    let cartCode;
    let customerCode;
    if (cart !== null && cart !== undefined) {
      cartCode = cart?.cartCode;
      customerCode = cart?.customerCode;
    }
    let totalAmount = 0;
    let sizeofpizza = data?.pizzaSize ? data.pizzaSize : sizesOfPizzaSelected;

    // let pizzaPrice = sizeofpizza === "Large" ? 11.49 : 16.49;

    const calculate = () => {
      let calculatePrice = 0;

      console.log(data, "create your own data");
      let crust_price = data?.crust
        ? Number(data?.crust?.price)
        : Number(crustSelected?.price);
      let cheese_price = data?.cheese
        ? data?.cheese?.price
        : cheeseSelected?.price;
      let specialbase_price = data?.specialBase
        ? data?.specialBase?.price
        : specialBasesSelected?.price !== undefined
        ? specialBasesSelected?.price
        : 0;
      let cook_price = data?.cook ? data?.cook?.price : cookSelected?.price;
      let sause_price = data?.sause ? data?.sause?.price : sauseSelected?.price;
      let spicy_price = data?.spicy ? data?.spicy?.price : spicySelected?.price;

      let totalSidesPrice = Number(0);
      let totalTwoToppings = Number(0);
      let totalOneToppings = Number(0);
      let totalFreeToppings = Number(0);
      let totalDips = Number(0);
      let totalDrinks = Number(0);

      TwoTopping?.map((two) => (totalTwoToppings += Number(two.toppingsPrice)));
      console.log(data?.countAs1Arr, "countAs1Arr");
      OneTopping?.map((one) => (totalOneToppings += Number(one.toppingsPrice)));
      freeTopping?.map(
        (free) => (totalFreeToppings += Number(free.toppingsPrice))
      );
      sidesArray?.map((side) => (totalSidesPrice += Number(side.sidePrice)));
      dipsArray?.map((dips) => (totalDips += Number(dips.dipsPrice)));
      drinksArray?.map((drinks) => (totalDrinks += Number(drinks.drinksPrice)));
      calculatePrice += Number(cook_price);
      calculatePrice += Number(sause_price);
      calculatePrice += Number(spicy_price);
      calculatePrice += Number(crust_price);
      calculatePrice += Number(cheese_price);
      calculatePrice += Number(specialbase_price);
      calculatePrice += totalSidesPrice;
      calculatePrice += totalTwoToppings;
      calculatePrice += totalOneToppings;
      calculatePrice += totalFreeToppings;
      calculatePrice += totalDips;
      calculatePrice += totalDrinks;
      let priceBySize = sizeofpizza === "Large" ? 11.49 : 16.49;
      calculatePrice += priceBySize;
      totalAmount = calculatePrice;
      return calculatePrice.toFixed(2);
    };
    calculate();
    console.log(totalAmount, "create your own price");
    // totalAmount += Number(pizzaPrice);
    const payload = {
      id: updatedCartId !== -1 ? cartdata[updatedCartId]?.id : uuidv4(),
      productCode: "#NA",
      productName: "Create Your Own",
      productType: "custom_pizza",
      config: {
        pizza: [
          {
            crust: data?.crust ? data?.crust : crustSelected,
            cheese: data?.cheese ? data?.cheese : cheeseSelected,
            specialBases: data?.specialBase
              ? data?.specialBase
              : specialBasesSelected,
            cook: data?.cook ? data?.cook : cookSelected,
            sauce: data?.sause ? data?.sause : sauseSelected,
            spicy: data?.spicy ? data?.spicy : spicySelected,
            toppings: {
              countAsTwoToppings: data?.countAs2Arr
                ? data?.countAs2Arr
                : countTwoToppingsArr,
              countAsOneToppings: data?.countAs1Arr
                ? data?.countAs1Arr
                : countOneToppingsArr,
              freeToppings: data?.freeTpsArr
                ? data?.freeTpsArr
                : freeToppingsArr,
              isAllIndiansTps: isAllIndiansTps,
            },
          },
        ],
        sides: data?.sidesArr ? data?.sidesArr : sidesArr,
        dips: data?.dipsArr ? data?.dipsArr : dips,
        drinks: data?.drinksArr ? data?.drinksArr : drinks,
      },
      quantity: "1",
      price: data?.pizzaSize == "Extra Large" ? 16.49 : 11.49,
      amount: totalAmount?.toFixed(2),
      comments: data?.comment ? data.comment : comments,
      pizzaSize: data.pizzaSize ? data.pizzaSize : sizesOfPizzaSelected,
      discountAmount: discount,
      taxPer: taxPer,
    };
    if (updatedCartId !== -1) {
      tempPayload[updatedCartId] = payload;
    } else {
      tempPayload.unshift(payload);
    }
    dispatch(addToCart([...tempPayload]));
  };
  // Onclick Add To Cart Button
  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (
      payloadEdit !== undefined &&
      payloadEdit.productType === "custom_pizza"
    ) {
      const payloadForEdit = {
        id: payloadEdit?.id,
        productCode: "#NA",
        productName: "Create Your Own",
        productType: "custom_pizza",
        config: {
          pizza: [
            {
              crust: crustSelected,
              cheese: cheeseSelected,
              specialBases: specialBasesSelected,
              cook: cookSelected,
              sauce: sauseSelected,
              spicy: spicySelected,
              toppings: {
                countAsTwoToppings: countTwoToppingsArr,
                countAsOneToppings: countOneToppingsArr,
                freeToppings: freeToppingsArr,
                isAllIndiansTps: isAllIndiansTps,
              },
            },
          ],
          sides: sidesArr,
          dips: dips,
          drinks: drinks,
        },
        quantity: "1",
        price: price,
        amount: price,
        comments: comments,
        pizzaSize: sizesOfPizzaSelected,
        discountAmount: discount,
        taxPer: taxPer,
      };
      const updatedCart = cartdata.findIndex(
        (item) => item.id === payloadEdit.id
      );
      let tempPayload = [...cartdata];
      let movedObject = tempPayload.splice(updatedCart, 1)[0];
      // tempPayload.unshift(movedObject);
      tempPayload[0] = payloadForEdit;
      dispatch(addToCart([...tempPayload]));
      setPayloadEdit();
      resetFields(
        allIngredients,
        setSpecialBasesSelected,
        setCookSelected,
        setSauseSelected,
        setSpicySelected,
        setCheeseSelected,
        setCrustSelected
      );
      // setCrustSelected({
      //   crustCode: allIngredients?.crust[0]?.crustCode,
      //   crustName: allIngredients?.crust[0]?.crustName,
      //   price: allIngredients?.crust[0]?.price,
      // });
      setSizesOfPizzaSelected(sizesOfPizza[0]);
      setSpecialBasesSelected({ specialbaseCode: "" });
      setDips([]);
      setDrinks([]);
      setSideArr([]);
      setCountTwoToppingsArr([]);
      setCountOneToppingsArr([]);
      setFreeToppingsArr([]);
      setPrice(0);
      setComments("");

      uncheckAllCheckboxes();

      toast.success(`Custom Pizza edited Successfully...`);
    } else {
      if (crustSelected && cheeseSelected) {
        const payload = {
          id: uuidv4(),
          productCode: "#NA",
          productName: "Create Your Own",
          productType: "custom_pizza",
          config: {
            pizza: [
              {
                crust: crustSelected,
                cheese: cheeseSelected,
                specialBases: specialBasesSelected,
                cook: cookSelected,
                sauce: sauseSelected,
                spicy: spicySelected,
                toppings: {
                  countAsTwoToppings: countTwoToppingsArr,
                  countAsOneToppings: countOneToppingsArr,
                  freeToppings: freeToppingsArr,
                  isAllIndiansTps: isAllIndiansTps,
                },
              },
            ],
            sides: sidesArr,
            dips: dips,
            drinks: drinks,
          },
          quantity: "1",
          price: price,
          amount: price,
          comments: comments,
          pizzaSize: sizesOfPizzaSelected,
          discountAmount: discount,
          taxPer: taxPer,
        };
        console.log(payload.config, "payload conffig");

        dispatch(addToCart([payload, ...cartdata]));
        toast.success(`Custom Pizza Added Successfully...`);
        setSizesOfPizzaSelected(sizesOfPizza[0]);
        setCrustSelected({
          crustCode: allIngredients?.crust[0]?.crustCode,
          crustName: allIngredients?.crust[0]?.crustName,
          price: allIngredients?.crust[0]?.price,
        });
        setCheeseSelected(allIngredients?.cheese[0]);
        setSpecialBasesSelected({});
        setDips([]);
        setDrinks([]);
        setSideArr([]);
        setCountTwoToppingsArr([]);
        setCountOneToppingsArr([]);
        setFreeToppingsArr([]);
        setPrice(0);
        setComments("");

        uncheckAllCheckboxes();
      } else {
        toast.error("Add something ..");
      }
    }
  };

  useEffect(() => {
    if (
      payloadEdit !== undefined &&
      payloadEdit.productType === "custom_pizza"
    ) {
      setPrice(payloadEdit?.amount);
      setSizesOfPizzaSelected(payloadEdit?.pizzaSize);
      setCrustSelected(payloadEdit?.config?.pizza[0]?.crust);
      setCheeseSelected(payloadEdit?.config?.pizza[0]?.cheese);
      setSpecialBasesSelected(payloadEdit?.config?.pizza[0]?.specialBases);
      setCountTwoToppingsArr(
        payloadEdit?.config?.pizza[0]?.toppings?.countAsTwoToppings
      );
      setCountOneToppingsArr(
        payloadEdit?.config?.pizza[0]?.toppings?.countAsOneToppings
      );
      setFreeToppingsArr(payloadEdit?.config?.pizza[0]?.toppings?.freeToppings);
      setSideArr(payloadEdit?.config?.sides);
      setDips(payloadEdit?.config?.dips);
      setDrinks(payloadEdit?.config?.drinks);
      setComments(payloadEdit?.comments);
      //console.log(payloadEdit?.comments, "payloadEdit");
    }
  }, [payloadEdit]);

  // handle Two Toppings
  const handleTwoToppings = (e, toppingCode) => {
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

      setCountTwoToppingsArr((prevTps) => {
        updateInCart({
          countAs2Arr: [toppingObj, ...prevTps],
        });
        return [...prevTps, toppingObj];
      });
    } else {
      setCountTwoToppingsArr((prevToppings) => {
        updateInCart({
          countAs2Arr: prevToppings.filter(
            (toppingObj) => toppingObj.toppingsCode !== toppingCode
          ),
        });

        return prevToppings.filter(
          (toppingObj) => toppingObj.toppingsCode !== toppingCode
        );
      });
    }

    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === toppingCode ? { ...checkbox, checked } : checkbox
      )
    );
  };

  // handle Two Toppings Placement
  const handleCountAsTwoToppingsPlacementChange = (e, countAsTwoToppings) => {
    const selectedValue = e.target.value;
    let arr = [...countTwoToppingsArr];
    let selectedObject = countTwoToppingsArr?.find(
      (option) => option.toppingsCode === countAsTwoToppings.toppingsCode
    );
    selectedObject = {
      ...selectedObject,
      toppingsPlacement: selectedValue,
    };
    let indexOfSelectedObject = countTwoToppingsArr?.findIndex(
      (option) => option.toppingsCode === countAsTwoToppings.toppingsCode
    );

    if (indexOfSelectedObject !== -1) {
      arr[indexOfSelectedObject] = selectedObject;
    }
    updateInCart({
      countAs2Arr: arr,
    });
    setCountTwoToppingsArr(arr);
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

      setCountOneToppingsArr((prevToppings) => {
        updateInCart({
          countAs1Arr: [...prevToppings, toppingObj],
        });
        return [...prevToppings, toppingObj];
      });
    } else {
      setCountOneToppingsArr((prevToppings) => {
        updateInCart({
          countAs1Arr: prevToppings.filter(
            (toppingObj) => toppingObj.toppingsCode !== toppingCode
          ),
        });
        return prevToppings.filter(
          (toppingObj) => toppingObj.toppingsCode !== toppingCode
        );
      });
    }
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === toppingCode ? { ...checkbox, checked } : checkbox
      )
    );
  };

  // handle One Toppings Placement
  const handleCountOnePlacementChange = (e, countAsOneToppings) => {
    const selectedValue = e.target.value;
    let arr = [...countOneToppingsArr];
    let selectedObject = countOneToppingsArr?.find(
      (option) => option.toppingsCode === countAsOneToppings.toppingsCode
    );
    selectedObject = {
      ...selectedObject,
      toppingsPlacement: selectedValue,
    };
    let indexOfSelectedObject = countOneToppingsArr?.findIndex(
      (option) => option.toppingsCode === countAsOneToppings.toppingsCode
    );

    if (indexOfSelectedObject !== -1) {
      arr[indexOfSelectedObject] = selectedObject;
    }
    updateInCart({
      countAs1Arr: arr,
    });
    setCountOneToppingsArr(arr);
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
        toppingsPrice: selectedTopping[0].toppingsCode
          ? selectedTopping[0].price
          : "0",
        toppingsPlacement: placement,
      };

      setFreeToppingsArr((prevToppings) => {
        updateInCart({
          freeTpsArr: [...prevToppings, toppingObj],
        });
        return [...prevToppings, toppingObj];
      });
    } else {
      setFreeToppingsArr((prevToppings) => {
        updateInCart({
          freeTpsArr: prevToppings.filter(
            (toppingObj) => toppingObj.toppingsCode !== toppingCode
          ),
        });
        return prevToppings.filter(
          (toppingObj) => toppingObj.toppingsCode !== toppingCode
        );
      });
    }
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === toppingCode ? { ...checkbox, checked } : checkbox
      )
    );
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
  const handleSauseChange = (event) => {
    if (event.target.value !== undefined) {
      const selectedObject = allIngredients?.sauce?.find(
        (option) => option.sauceCode === event.target.value
      );
      updateInCart({
        sause: selectedObject,
      });
      setSauseSelected(selectedObject);
    }
  };
  const handleSpicyChange = (event) => {
    if (event.target.value !== undefined) {
      const selectedObject = allIngredients?.spices?.find(
        (option) => option.spicyCode === event.target.value
      );
      updateInCart({
        spicy: selectedObject,
      });
      setSpicySelected(selectedObject);
    }
  };
  const handleCookChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue !== undefined) {
      const selectedObject = allIngredients?.cook?.find(
        (option) => option.cookCode === selectedValue
      );
      updateInCart({
        cook: selectedObject,
      });
      setCookSelected(selectedObject);
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
      console.log(selectSides, "sidesArr array");
      const sidesObj = {
        sideCode: selectSides[0].sideCode,
        sideName: selectSides[0].sideName,
        sideType: selectSides[0].type,
        lineCode: lineCode,
        sidePrice: price ? price : 0,
        sideSize: size,
        quantity: 1,
        totalPrice: price * 1,
      };
      console.log(sidesObj, "sidesArr array obj");

      setSideArr((prevSides) => {
        updateInCart({
          sidesArr: [...prevSides, sidesObj],
        });
        return [...prevSides, sidesObj];
      });
    } else {
      setSideArr((prevSides) => {
        updateInCart({
          sidesArr: prevSides.filter(
            (sidesObj) => sidesObj.sideCode !== sideCode
          ),
        });
        return prevSides.filter((sidesObj) => sidesObj.sideCode !== sideCode);
      });
    }
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === sideCode ? { ...checkbox, checked } : checkbox
      )
    );
  };

  // handle Sides Placement
  const handleSidePlacementChange = (e, sideCode) => {
    const sideIndex = sidesArr?.findIndex(
      (sides) => sides.sideCode === sideCode
    );
    const selectSides = sidesData?.filter(
      (sides) => sides.sideCode === sideCode
    );
    const selectedLineEntries = selectSides[0]?.combination?.filter(
      (side) => side?.lineCode === e.target.value
    );

    let tempSideArr = [...sidesArr];
    if (sideIndex !== -1) {
      const sidesObj = {
        sideCode: selectSides[0].sideCode,
        sideName: selectSides[0].sideName,
        sideType: selectSides[0].type,
        lineCode: selectedLineEntries[0].lineCode,
        sidePrice: selectedLineEntries[0]?.price
          ? selectedLineEntries[0]?.price
          : 0,
        sideSize: selectedLineEntries[0]?.size,
        quantity: 1,
        totalPrice: selectedLineEntries[0]?.price * 1,
      };
      console.log(sidesObj, "selected side ");
      tempSideArr[sideIndex] = sidesObj;
      setSideArr(tempSideArr);
      updateInCart({
        sidesArr: tempSideArr,
      });
    }
    setCount((prevCount) => prevCount + 1);
  };

  // handle dips
  const handleDips = (e, code) => {
    const { checked } = e.target;
    if (checked) {
      const selectedDips = allIngredients?.dips.filter(
        (dips) => dips.dipsCode === code
      );
      if (selectedDips.length > 0) {
        let dipsObj = {
          dipsCode: selectedDips[0].dipsCode,
          dipsName: selectedDips[0].dipsName,
          dipsPrice: selectedDips[0].price ? selectedDips[0].price : "0",
          quantity: 1,
          totalPrice: selectedDips[0].price ? selectedDips[0].price : "0",
        };
        updateInCart({
          dipsArr: [...dips, dipsObj],
        });
        setDips([...dips, dipsObj]);
      }
    } else {
      const newDips = dips.filter((newDips) => newDips.dipsCode !== code);
      updateInCart({
        dipsArr: newDips,
      });
      setDips(newDips);
    }
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === code ? { ...checkbox, checked } : checkbox
      )
    );
  };

  // handle Drinks
  const handleDrinks = (e, code) => {
    const { checked } = e.target;
    const selectedDrinks = allIngredients?.softdrinks.filter(
      (drinks) => drinks.softdrinkCode === code
    );
    if (selectedDrinks.length > 0) {
      let drinksObj = {
        drinksCode: selectedDrinks[0].softdrinkCode,
        drinksName: selectedDrinks[0].softDrinksName,
        drinksPrice: selectedDrinks[0].price ? selectedDrinks[0].price : "0",
        quantity: 1,
        totalPrice: selectedDrinks[0].price ? selectedDrinks[0].price : "0",
      };
      if (checked) {
        setDrinks((prevDrinks) => {
          updateInCart({
            drinksArr: [...prevDrinks, drinksObj],
          });
          return [...prevDrinks, drinksObj];
        });
      } else {
        const newDrinks = drinks.filter(
          (updatedDrinks) => updatedDrinks.drinksCode !== code
        );
        updateInCart({
          drinksArr: newDrinks,
        });
        setDrinks(newDrinks);
      }
    }
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === code ? { ...checkbox, checked } : checkbox
      )
    );
  };

  // rest checkboxes
  const uncheckAllCheckboxes = () => {
    setAllCheckBoxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) => ({ ...checkbox, checked: false }))
    );
  };

  useEffect(() => {
    let ckbx = [];

    allIngredients?.toppings?.countAsTwo?.map((d) => {
      ckbx.push({ id: d.toppingsCode, checked: false });
    });

    allIngredients?.toppings?.countAsOne?.map((d) => {
      ckbx.push({ id: d.toppingsCode, checked: false });
    });

    allIngredients?.toppings?.freeToppings?.map((d) => {
      ckbx.push({ id: d.toppingsCode, checked: false });
    });

    allIngredients?.dips?.map((d) => {
      ckbx.push({ id: d.dipsCode, checked: false });
    });

    sidesData?.map((d) => {
      ckbx.push({ id: d.sideCode, checked: false });
    });

    allIngredients?.softdrinks?.map((d) => {
      ckbx.push({ id: d.softdrinkCode, checked: false });
    });

    setAllCheckBoxes(ckbx);
  }, [allIngredients, sidesData]);

  useEffect(() => {
    calculatePrice();
    if (
      freeToppingsArr.length === allIngredients?.toppings?.freeToppings?.length
    ) {
      setIsAllIndiansTps(true);
    } else {
      setIsAllIndiansTps(false);
    }
  }, [
    sidesArr,
    countTwoToppingsArr,
    countOneToppingsArr,
    freeToppingsArr,
    dips,
    drinks,
    crustSelected,
    specialBasesSelected,
    cheeseSelected,
    sidesArr,
    count,
    sizesOfPizzaSelected,
    freeToppingsArr,
  ]);

  //pizza size (large or extra-large)
  const handleSizeOfPizza = (e) => {
    setSizesOfPizzaSelected(e.target.value);
    updateInCart({ pizzaSize: e.target.value });
  };

  //crust
  const handleCrustChange = (event) => {
    const selectedValue = event.target.value;
    const selectedObject = allIngredients?.crust?.find(
      (option) => option.crustCode === selectedValue
    );
    updateInCart({
      crust: {
        crustCode: selectedObject?.crustCode,
        crustName: selectedObject?.crustName,
        price: selectedObject?.price,
      },
    });

    setCrustSelected({
      crustCode: selectedObject?.crustCode,
      crustName: selectedObject?.crustName,
      price: selectedObject?.price,
    });
  };

  // cheese
  const handleCheeseChange = (event) => {
    const selectedValue = event.target.value;
    const selectedObject = allIngredients?.cheese?.find(
      (option) => option.cheeseCode === selectedValue
    );
    updateInCart({
      cheese: selectedObject,
    });
    setCheeseSelected(selectedObject);
  };

  //special base
  const handleSpecialBasesChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue !== undefined) {
      const selectedObject = allIngredients?.specialbases?.find(
        (option) => option.specialbaseCode === selectedValue
      );
      updateInCart({
        specialBase: selectedObject,
      });
      setSpecialBasesSelected(selectedObject);
    }
  };

  // all indian toppings
  const handleChangeAllIndianToppins = (e) => {
    if (e.target.checked) {
      const tempAllBoxes = [...allIngredients?.toppings?.freeToppings].map(
        (item) => {
          let placement = "whole";
          const placementValue = $("#placement-" + item.toppingCode).val();
          if (placementValue !== "" && placementValue !== undefined) {
            placement = placementValue;
          }
          return {
            toppingsPrice: item.price,
            toppingsName: item.toppingsName,
            toppingsCode: item.toppingsCode,
            toppingsPlacement: placement,
          };
        }
      );
      updateInCart({
        freeTpsArr: tempAllBoxes,
      });
      setFreeToppingsArr(tempAllBoxes);
      setIsAllIndiansTps(true);
    } else {
      updateInCart({
        freeTpsArr: [],
      });
      setFreeToppingsArr([]);
      setIsAllIndiansTps(false);
    }
  };
  const handleComment = (e) => {
    updateInCart({
      comment: e.target.value,
    });
    setComments(e.target.value);
  };

  const handleFreeToppingsPlacementChange = (event, toppingsCode) => {
    const selectedValue = event.target.value;
    let arr = [...freeToppingsArr];
    let selectedObject = freeToppingsArr?.find(
      (option) => option.toppingsCode === toppingsCode
    );
    selectedObject = {
      ...selectedObject,
      toppingsPlacement: selectedValue,
    };
    let indexOfSelectedObject = freeToppingsArr?.findIndex(
      (option) => option.toppingsCode === toppingsCode
    );
    if (indexOfSelectedObject !== -1) {
      arr[indexOfSelectedObject] = selectedObject;
    }
    updateInCart({
      freeTpsArr: arr,
    });
    setFreeToppingsArr(arr);
  };

  useEffect(() => {
    resetFields(
      allIngredients,
      setSpecialBasesSelected,
      setCookSelected,
      setSauseSelected,
      setSpicySelected,
      setCheeseSelected,
      setCrustSelected
    );
  }, [allIngredients]);

  return (
    <>
      {isEdit === true ? (
        <>
          <EditCartProduct
            allIngredients={allIngredients}
            sidesData={sidesData}
            discount={discount}
            taxPer={taxPer}
            getCartList={getCartList}
            cartLineCode={cartLineCode}
            cartCode={cartCode}
          />
        </>
      ) : (
        <>
          <h6 className='text-center'>
            {payloadEdit !== undefined &&
            payloadEdit.productType === "custom_pizza"
              ? "Edit Pizza"
              : "Pizza Selection"}
          </h6>
          <div className='d-flex justify-content-between'>
            <div className='d-flex justify-content-center align-items-center'>
              <span>Size: </span>
              <select
                className='form-select mx-2'
                value={sizesOfPizzaSelected}
                onChange={handleSizeOfPizza}
              >
                {sizesOfPizza?.map((size, index) => {
                  return (
                    <option value={size} key={"sizesSelect" + index}>
                      {size}
                    </option>
                  );
                })}
              </select>
            </div>
            <h6 className=''>
              <span className='mx-2'>$ {price}</span>
            </h6>
          </div>
          <div className='row my-2'>
            {/* Crust, Cheese, SpecialBases */}
            <div className='col-lg-4 col-md-4'>
              <label className='mt-2 mb-1'>Crust</label>

              <SelectDropDownCrust
                crustSelected={crustSelected}
                handleCrustChange={handleCrustChange}
                allIngredients={allIngredients}
              />
            </div>
            <div className='col-lg-4 col-md-4'>
              <label className='mt-2 mb-1'>Cheese</label>

              <SelectDropDownCheese
                cheeseSelected={cheeseSelected}
                handleCheeseChange={handleCheeseChange}
                allIngredients={allIngredients}
              />
            </div>
            <div className='col-lg-4 col-md-4'>
              <label className='mt-2 mb-1'>Special Bases</label>
              <SelectDropDownSpecialBases
                specialBasesSelected={specialBasesSelected}
                handleSpecialBasesChange={handleSpecialBasesChange}
                allIngredients={allIngredients}
              />
            </div>
            <div className='col-lg-4 col-md-4'>
              <label className='mt-2 mb-1'>Cook</label>
              <SelectDropDownCook
                allIngredients={allIngredients}
                handleCookChange={handleCookChange}
                cookSelected={cookSelected}
              />
            </div>
            <div className='col-lg-4 col-md-4'>
              <label className='mt-2 mb-1'>Sauce</label>
              <SelectDropDownSause
                allIngredients={allIngredients}
                handleSauseChange={handleSauseChange}
                sauseSelected={sauseSelected}
              />
            </div>
            <div className='col-lg-4 col-md-4'>
              <label className='mt-2 mb-1'>Spicy</label>
              <SelectDropDownSpicy
                allIngredients={allIngredients}
                handleSpicyChange={handleSpicyChange}
                spicySelected={spicySelected}
              />
            </div>
            <div className='col-lg-12 mt-3'>
              <div class='form-check'>
                <input
                  class='form-check-input'
                  type='checkbox'
                  value=''
                  checked={
                    freeToppingsArr?.length ===
                    allIngredients?.toppings?.freeToppings?.length
                      ? true
                      : false
                  }
                  id='allIndianTps'
                  onChange={handleChangeAllIndianToppins}
                />
                <label class='form-check-label' for='allIndianTps'>
                  All Indian Style
                </label>
              </div>
            </div>
            {/* Tabs */}
            <div className='mt-3'>
              {/* Tabs Headings */}
              <ul className='nav nav-tabs' role='tablist'>
                <li className='nav-item'>
                  <Link
                    className='nav-link active py-2 px-4'
                    data-bs-toggle='tab'
                    to='#toppings-count-2-tab'
                  >
                    Toppings (2)
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link py-2 px-4'
                    data-bs-toggle='tab'
                    to='#toppings-count-1-tab'
                  >
                    Toppings (1)
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link py-2 px-4'
                    data-bs-toggle='tab'
                    to='#toppings-free-tab'
                  >
                    Indian Style (Free)
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link py-2 px-4'
                    data-bs-toggle='tab'
                    to='#sides'
                  >
                    Sides
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link py-2 px-4'
                    data-bs-toggle='tab'
                    to='#dips'
                  >
                    Dips
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link py-2 px-4'
                    data-bs-toggle='tab'
                    to='#drinks'
                  >
                    Drinks
                  </Link>
                </li>
              </ul>
              {/* Tab Content */}
              <div className='tab-content m-0 p-0 w-100'>
                {/* Count 2 Toppings */}
                <div
                  id='toppings-count-2-tab'
                  className='container tab-pane active m-0 p-0 topping-list'
                >
                  {allIngredients?.toppings?.countAsTwo?.map(
                    (countAsTwoToppings, index) => {
                      const toppingCode = countAsTwoToppings.toppingsCode;
                      const comm = countTwoToppingsArr?.findIndex(
                        (item) =>
                          item.toppingsCode === countAsTwoToppings.toppingsCode
                      );
                      return (
                        <>
                          <li
                            className='list-group-item d-flex justify-content-between align-items-center'
                            key={countAsTwoToppings.toppingsCode}
                          >
                            <div class='form-check'>
                              <input
                                class='form-check-input'
                                type='checkbox'
                                value=''
                                id={countAsTwoToppings.toppingsCode}
                                checked={comm !== -1 ? true : false}
                                onChange={(e) =>
                                  handleTwoToppings(e, toppingCode)
                                }
                              />
                              <label
                                class='form-check-label'
                                for={countAsTwoToppings.toppingsCode}
                              >
                                {countAsTwoToppings.toppingsName}
                              </label>
                            </div>
                            <div
                              className='d-flex justify-content-between align-items-center'
                              style={{ width: "12rem" }}
                            >
                              <p
                                className='mx-2 mb-0 text-end'
                                style={{ width: "35%" }}
                              >
                                $ {countAsTwoToppings.price}
                              </p>
                              <select
                                className='form-select d-inline-block'
                                style={{ width: "65%" }}
                                id={"placement-" + toppingCode}
                                value={
                                  countTwoToppingsArr[comm]?.toppingsPlacement
                                }
                                onChange={(e) => {
                                  handleCountAsTwoToppingsPlacementChange(
                                    e,
                                    countAsTwoToppings
                                  );
                                }}
                              >
                                <option
                                  value='whole'
                                  selected={
                                    countTwoToppingsArr.length === 0
                                      ? true
                                      : false
                                  }
                                >
                                  Whole
                                </option>
                                <option value='lefthalf'>Left Half</option>
                                <option value='righthalf'>Right Half</option>
                                <option value='1/4'>1/4</option>
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
                  id='toppings-count-1-tab'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  {allIngredients?.toppings?.countAsOne?.map(
                    (countAsOneToppings, index) => {
                      const toppingCode = countAsOneToppings.toppingsCode;
                      const comm = countOneToppingsArr?.findIndex(
                        (item) =>
                          item.toppingsCode === countAsOneToppings.toppingsCode
                      );
                      return (
                        <>
                          <li
                            className='list-group-item d-flex justify-content-between align-items-center'
                            key={toppingCode}
                          >
                            <div class='form-check'>
                              <input
                                class='form-check-input'
                                type='checkbox'
                                value=''
                                id={countAsOneToppings.toppingsCode}
                                checked={comm !== -1 ? true : false}
                                onChange={(e) =>
                                  handleOneToppings(e, toppingCode)
                                }
                              />
                              <label
                                class='form-check-label'
                                for={countAsOneToppings.toppingsCode}
                              >
                                {countAsOneToppings.toppingsName}
                              </label>
                            </div>
                            <div
                              className='d-flex justify-content-between align-items-center'
                              style={{ width: "12rem" }}
                            >
                              <p
                                className='mx-2 mb-0 text-end'
                                style={{ width: "35%" }}
                              >
                                $ {countAsOneToppings.price}
                              </p>
                              <select
                                className='form-select d-inline-block'
                                style={{ width: "65%" }}
                                id={"placement-" + toppingCode}
                                value={
                                  countOneToppingsArr[comm]?.toppingsPlacement
                                }
                                onChange={(e) => {
                                  handleCountOnePlacementChange(
                                    e,
                                    countAsOneToppings
                                  );
                                }}
                              >
                                <option
                                  value='whole'
                                  selected={
                                    countOneToppingsArr.length === 0
                                      ? true
                                      : false
                                  }
                                >
                                  Whole
                                </option>
                                <option value='lefthalf'>Left Half</option>
                                <option value='righthalf'>Right Half</option>
                                <option value='1/4'>1/4</option>
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
                  id='toppings-free-tab'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  {allIngredients?.toppings?.freeToppings?.map(
                    (freeToppings, index) => {
                      const toppingCode = freeToppings.toppingsCode;

                      const comm = freeToppingsArr?.findIndex(
                        (item) =>
                          item.toppingsCode === freeToppings.toppingsCode
                      );

                      return (
                        <>
                          <li
                            className='list-group-item d-flex justify-content-between align-items-center'
                            key={toppingCode}
                          >
                            <div class='form-check'>
                              <input
                                class='form-check-input'
                                type='checkbox'
                                value=''
                                id={freeToppings.toppingsCode}
                                checked={comm !== -1 ? true : false}
                                onChange={(e) =>
                                  handleFreeToppings(e, toppingCode)
                                }
                              />
                              <label
                                class='form-check-label'
                                for={freeToppings.toppingsCode}
                              >
                                {freeToppings.toppingsName}
                              </label>
                            </div>
                            <div
                              className='d-flex justify-content-between align-items-center'
                              style={{ width: "12rem" }}
                            >
                              <p
                                className='mx-2 mb-0 text-end'
                                style={{ width: "35%" }}
                              >
                                $ 0
                              </p>
                              <select
                                data-topping-area={toppingCode}
                                className='form-select d-inline-block'
                                style={{ width: "65%" }}
                                value={freeToppingsArr[comm]?.toppingsPlacement}
                                id={"placement-" + toppingCode}
                                // onChange={(e) => {
                                //   if (comm !== -1) {
                                //     const selectedPlacement = e.target.value;
                                //     const updatedTopping = {
                                //       ...freeToppingsArr[index],
                                //       toppingsPlacement: selectedPlacement,
                                //     };
                                //     const updatedArray = [...freeToppingsArr];
                                //     updatedArray[index] = updatedTopping;
                                //     setFreeToppingsArr(updatedArray);
                                //   }
                                // }}
                                onChange={(e) => {
                                  handleFreeToppingsPlacementChange(
                                    e,
                                    freeToppings.toppingsCode
                                  );
                                }}
                              >
                                <option
                                  value='whole'
                                  selected={
                                    freeToppingsArr?.length === 0 ? true : false
                                  }
                                >
                                  Whole
                                </option>
                                <option value='lefthalf'>Left Half</option>
                                <option value='righthalf'>Right Half</option>
                                <option value='1/4'>1/4</option>
                              </select>
                            </div>
                          </li>
                        </>
                      );
                    }
                  )}
                </div>

                {/* Sides */}
                <div
                  id='sides'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  {sidesData?.map((sidesData) => {
                    const sideCode = sidesData.sideCode;
                    const comm = sidesArr.findIndex(
                      (item) => item.sideCode === sidesData.sideCode
                    );
                    return (
                      <>
                        <li
                          className='list-group-item d-flex justify-content-between align-items-center'
                          key={sidesData.sideCode}
                        >
                          <label className='d-flex align-items-center'>
                            <input
                              type='checkbox'
                              className='mx-3 d-inline-block sidesChk'
                              checked={comm !== -1 ? true : false}
                              onChange={(e) => {
                                handleSides(e, sideCode);
                              }}
                            />
                            {sidesData.sideName}
                            <span
                              className={"badge-" + sidesData.type + " mx-1"}
                            >
                              ( {sidesData.type} )
                            </span>
                          </label>
                          <div style={{ width: "12rem" }}>
                            <select
                              className='form-select w-100 d-inline-block'
                              id={"placement-" + sideCode}
                              value={sidesArr[comm]?.lineCode}
                              onChange={(e) => {
                                if (comm !== -1) {
                                  handleSidePlacementChange(e, sideCode);
                                }
                              }}
                            >
                              {sidesData.combination.map((combination) => {
                                return (
                                  <option
                                    key={combination.lineCode}
                                    data-key={combination.lineCode}
                                    data-price={combination.price}
                                    data-size={combination.size}
                                    value={combination.lineCode}
                                  >
                                    {combination.size} - $ {combination.price}
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
                <div
                  id='dips'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  {allIngredients?.dips?.map((dipsData) => {
                    const dipCode = dipsData.dipsCode;
                    const comm = dips.findIndex(
                      (item) => item.dipsCode === dipsData.dipsCode
                    );
                    return (
                      <li
                        className='list-group-item d-flex justify-content-between align-items-center'
                        key={dipCode}
                      >
                        <label className='d-flex align-items-center'>
                          <input
                            type='checkbox'
                            className='mx-3 d-inline-block dipsChk'
                            checked={comm !== -1 ? true : false}
                            onChange={(e) => {
                              handleDips(e, dipCode);
                            }}
                          />
                          {dipsData.dipsName}
                        </label>
                        <p className='mb-0 mx-2'>$ {dipsData.price}</p>
                      </li>
                    );
                  })}
                </div>

                {/* Drinks */}
                <div
                  id='drinks'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  {allIngredients?.softdrinks?.map((drinksData) => {
                    const softdrinkCode = drinksData.softdrinkCode;
                    const comm = drinks.findIndex(
                      (item) => item.drinksCode === drinksData.softdrinkCode
                    );
                    return (
                      <li
                        className='list-group-item d-flex justify-content-between align-items-center'
                        key={softdrinkCode}
                      >
                        <label className='d-flex align-items-center'>
                          <input
                            type='checkbox'
                            className='mx-3 d-inline-block drinksChk'
                            checked={comm !== -1 ? true : false}
                            onChange={(e) => handleDrinks(e, softdrinkCode)}
                          />
                          {drinksData.softDrinksName}
                        </label>
                        <p className='mb-0 mx-2'>$ {drinksData.price}</p>
                      </li>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Comments */}
            <h6 className='text-left mt-1'>Comments</h6>
            <div className=''>
              <textarea
                className='form-control'
                rows='2'
                cols='50'
                value={comments}
                onChange={(e) => handleComment(e)}
              />
            </div>
          </div>
          {/* Add to Cart Button */}
          {payloadEdit !== undefined &&
          payloadEdit.productType === "custom_pizza" ? (
            <div className='d-flex flex-row justify-content-center align-items-center addToCartDiv position-sticky bottom-0 mb-3 '>
              <button
                type='button'
                className='btn btn-sm my-1 mb-2 px-4 py-2 addToCartbtn'
                onClick={handleAddToCart}
              >
                Edit order
                {/* {payloadEdit !== undefined &&
                payloadEdit.productType === "custom_pizza"
                  ? "Edit order"
                  : "Add to Cart"} */}
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

export default CreateYourOwn;
