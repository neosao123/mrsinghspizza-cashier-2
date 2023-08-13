import React, { useEffect, useState } from "react";
import specialImg1 from "../../assets/bg-img.jpg";
import backBtn from "../../assets/back-button.png";
import { v4 as uuidv4 } from "uuid";
import "../../css/specialMenu.css";
import SpecialPizzaSelection from "../../components/order/SpecialPizzaSelection";
import {
  dipsApi,
  getSpecialDetailsApi,
  specialPizzaApi,
  toppingsApi,
} from "../../API/ongoingOrder";
import Selection from "../../json/Selection.json";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setDisplaySpecialForm } from "../../reducer/cartReducer";
import { toast } from "react-toastify";
import { getSpecialDetails } from "./specialMenu/specialMenuCustomApiHandler";

function SpecialMenu({ setPayloadEdit, payloadEdit, specialTabRef }) {
  //
  const [pizzaState, setPizzaState] = useState();
  // For Conditions
  const [show, setShow] = useState(false);
  const displaySpecialForm = useSelector(
    (state) => state.cart.displaySpecialForm
  );
  const [pizzaSize, setPizzaSize] = useState("Large");

  // For Data
  const [selectedLineEntries, setSelectedLineEntries] = useState();
  const [specialData, setSpecialData] = useState();
  const [crustSelected, setCrustSelected] = useState();
  const [cheeseSelected, setCheeseSelected] = useState();
  const [specialBasesSelected, setSpecialBasesSelected] = useState();
  const [getSpecialData, setGetSpecialData] = useState();
  const [toppingsData, setToppingsData] = useState();
  const [dipsData, setDipsData] = useState();
  const [dipsArr, setDipsArr] = useState([]);
  const [offeredFreeToppings, setOfferedFreeToppings] = useState(0);
  const [sidesArr, setSidesArr] = useState([]);
  const [drinksArr, setDrinksArr] = useState([]);
  const [popsArr, setPopsArr] = useState([]);
  const [comments, setComments] = useState("");
  const [price, setPrice] = useState(0);
  const dispatch = useDispatch();
  let cartdata = useSelector((state) => state.cart.cart);
  //  const
  // handle crust change
  const handleCheeseChange = (event, i) => {
    const selectedValue = event.target.value;
    const selectedObject = getSpecialData?.cheese?.find(
      (option) => option.code === selectedValue
    );

    setPizzaState((prevPizzaState) => {
      const newArr = [...prevPizzaState];
      newArr[i - 1] = {
        ...newArr[i - 1],
        cheese: selectedObject,
      };
      return newArr;
    });
  };
  //12-08-23
  const handlePriceWithFreeToppins = (
    countAsTwoToppings,
    offeredFreeToppings
  ) => {
    if (countAsTwoToppings.price - offeredFreeToppings <= 0) {
      setOfferedFreeToppings(offeredFreeToppings - 2);
      return 0;
    }
    setOfferedFreeToppings(0);
    return countAsTwoToppings.price - offeredFreeToppings;
  };
  //12-08-23
  const handlePriceWithFreeToppinsCountAsOne = (
    countAsOneToppings,
    offeredFreeToppings
  ) => {
    if (1 - offeredFreeToppings <= 0) {
      setOfferedFreeToppings(offeredFreeToppings - 1);
      return 0;
    }
    setOfferedFreeToppings(0);
    return countAsOneToppings.price - offeredFreeToppings;
    // return 1 - offeredFreeToppings;
  };
  const handleSpecialBasesChange = (event, i) => {
    const selectedValue = event.target.value;
    const selectedObject = getSpecialData?.specialbases?.find(
      (option) => option.code === selectedValue
    );
    let arr = [...pizzaState];
    arr[i - 1].specialbases = selectedObject;
    setPizzaState(arr);
  };
  const handleCrustChange = (event, count) => {
    const selectedValue = event.target.value;
    console.log(event.target.value, "selected Object ");
    console.log(getSpecialData?.crust, "selected Object ");
    const selectedObject = getSpecialData?.crust?.find(
      (option) => option.code === selectedValue
    );
    console.log("selected Object ", selectedObject);

    let arr = [...pizzaState];
    arr[count - 1].crust = selectedObject;
    setPizzaState(arr);
  };
  const handleCountAsTwoToppingsPlacementChange = (
    event,
    count,
    toppingsCode
  ) => {
    const selectedValue = event.target.value;
    console.log(event.target.value, "selected Object ");
    console.log(getSpecialData?.crust, "selected Object ");
    let arr = [...pizzaState];
    let selectedObject = arr[count - 1]?.toppings?.countAsTwoToppings?.find(
      (option) => option.toppingsCode === toppingsCode
    );
    selectedObject = {
      ...selectedObject,
      placement: selectedValue,
    };
    let indexOfSelectedObject = arr[
      count - 1
    ]?.toppings?.countAsTwoToppings?.findIndex(
      (option) => option.toppingsCode === toppingsCode
    );

    if (indexOfSelectedObject !== -1) {
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1]?.toppings,
          countAsTwoToppings: [
            ...arr[count - 1]?.toppings?.countAsTwoToppings.slice(
              0,
              indexOfSelectedObject
            ),
            selectedObject,
            ...arr[count - 1]?.toppings?.countAsTwoToppings.slice(
              indexOfSelectedObject + 1
            ),
          ],
        },
      };
    }
    console.log(arr[count - 1], "console array");
    setPizzaState(arr);
  };
  const handleTwoToppings = (e, count, countAsTwoToppings) => {
    const { checked } = e.target;
    if (checked) {
      let arr = [...pizzaState];

      const tempCountAsTwo = [
        ...(arr[count - 1].toppings?.countAsTwoToppings || []),
        {
          ...countAsTwoToppings,
          placement: "whole",
          //12-08-23
          price: handlePriceWithFreeToppins(
            countAsTwoToppings,
            offeredFreeToppings
          ),
          // countAsTwoToppings.price - offeredFreeToppings <= 0
          //   ? 0
          //   : countAsTwoToppings.price - offeredFreeToppings,
        },
      ];
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1].toppings,
          countAsTwoToppings: tempCountAsTwo,
        },
      };
      // arr[count - 1].toppings = {
      //   ...arr[count - 1].toppings,
      //   countAsTwoToppings: tempCountAsTwo,
      // };
      setPizzaState(arr);
      // if (
      //   getSpecialData?.noofToppings >=
      //     arr[count - 1].toppings?.countAsTwoToppings.length &&
      //   offeredFreeToppings - 2 >= 0
      // ) {

      // setOfferedFreeToppings(offeredFreeToppings - 2);
      // }

      // if (
      //   getSpecialData?.noofToppings <
      //     arr[count - 1].toppings?.countAsTwoToppings.length ||
      //   offeredFreeToppings === 0
      // ) {
      //   setPrice((prev) => prev + Number(countAsTwoToppings?.price));
      // } else if (offeredFreeToppings - 2 < 0) {
      //   setOfferedFreeToppings(0);
      //   setPrice((prev) => prev + Number(countAsTwoToppings?.price) / 2);
      // }
    } else {
      let arr = [...pizzaState];
      // if (
      //   getSpecialData?.noofToppings <
      //   arr[count - 1].toppings?.countAsTwoToppings.length
      // ) {
      //   setPrice((prev) => prev - Number(countAsTwoToppings?.price));
      // }
      const index = arr[count - 1]?.toppings?.countAsTwoToppings.findIndex(
        (item) => item.toppingsCode === countAsTwoToppings.toppingsCode
      );
      // if(offeredFreeToppings)
      // setOfferedFreeToppings();
      console.log(index, "array modified ind");

      if (index !== -1 && arr[count - 1]?.toppings?.countAsTwoToppings) {
        let priceCurrentProduct =
          arr[count - 1]?.toppings?.countAsTwoToppings[index].price;

        // if (priceCurrentProduct - offeredFreeToppings <= 0) {

        // } else {
        //   setOfferedFreeToppings((prev) => prev + priceCurrentProduct);
        // }
        const updatedToppings =
          arr[count - 1].toppings.countAsTwoToppings.slice();
        updatedToppings.splice(index, 1);

        arr[count - 1].toppings.countAsTwoToppings = updatedToppings;
      }

      console.log(arr, "array modified");

      setPizzaState(arr);
    }
  };

  const handleOneToppings = (e, count, countAsOneToppings) => {
    const { checked } = e.target;
    console.log(checked, "toppings");
    if (checked) {
      let arr = [...pizzaState];
      const tempCountAsOne = [
        ...(arr[count - 1].toppings?.countAsOneToppings || []),
        {
          ...countAsOneToppings,
          placement: "whole",
          price: handlePriceWithFreeToppinsCountAsOne(
            countAsOneToppings,
            offeredFreeToppings
          ),
        },
      ];

      arr[count - 1].toppings = {
        ...arr[count - 1].toppings,
        countAsOneToppings: tempCountAsOne,
      };
      setPizzaState(arr);

      console.log(countAsOneToppings, "selected countAsTwoToppings");
    } else {
      let arr = [...pizzaState];
      const index = arr[count - 1].toppings?.countAsOneToppings.findIndex(
        (item) => (item.toppingsCode = countAsOneToppings.toppingsCode)
      );
      if (index !== -1) {
        arr[count - 1].toppings?.countAsOneToppings.splice(index, 1);
      }
      setPizzaState(arr);
    }
  };
  const handleFreeToppingsPlacementChange = (event, count, toppingsCode) => {
    const selectedValue = event.target.value;
    console.log(event.target.value, "selected Object ");
    console.log(getSpecialData?.crust, "selected Object ");
    let arr = [...pizzaState];
    let selectedObject = arr[count - 1]?.toppings?.freeToppings?.find(
      (option) => option.toppingsCode === toppingsCode
    );
    selectedObject = {
      ...selectedObject,
      placement: selectedValue,
    };
    let indexOfSelectedObject = arr[
      count - 1
    ]?.toppings?.freeToppings?.findIndex(
      (option) => option.toppingsCode === toppingsCode
    );
    if (indexOfSelectedObject !== -1) {
      arr[count - 1].toppings.freeToppings[indexOfSelectedObject] = {
        ...arr[count - 1].toppings.freeToppings[indexOfSelectedObject],
        placement: selectedValue,
      };
    }
    console.log(arr, "pizza order ");
    setPizzaState(arr);
  };
  const handleCountAsOneToppingsPlacementChange = (
    event,
    count,
    toppingsCode
  ) => {
    const selectedValue = event.target.value;
    console.log(event.target.value, "selected Object ");
    console.log(getSpecialData?.crust, "selected Object ");
    let arr = [...pizzaState];
    let selectedObject = arr[count - 1]?.toppings?.countAsOneToppings?.find(
      (option) => option.toppingsCode === toppingsCode
    );
    selectedObject = {
      ...selectedObject,
      placement: selectedValue,
    };
    let indexOfSelectedObject = arr[
      count - 1
    ]?.toppings?.countAsOneToppings?.findIndex(
      (option) => option.toppingsCode === toppingsCode
    );
    if (indexOfSelectedObject !== -1) {
      arr[count - 1].toppings.countAsOneToppings[indexOfSelectedObject] = {
        ...arr[count - 1].toppings.countAsOneToppings[indexOfSelectedObject],
        placement: selectedValue,
      };
    }
    setPizzaState(arr);
  };
  const handleFreeToppings = (e, count, freeToppings) => {
    const { checked } = e.target;
    console.log(freeToppings, "toppings?.price");
    if (checked) {
      let arr = [...pizzaState];
      const tempFreeToppings = [
        ...(arr[count - 1].toppings?.freeToppings || []),
        { ...freeToppings, placement: "whole" },
      ];

      arr[count - 1].toppings = {
        ...arr[count - 1].toppings,
        freeToppings: tempFreeToppings,
      };
      console.log(arr, "pizza state array");
      setPizzaState(arr);

      console.log(freeToppings, "selected freeToppings");
    } else {
      let arr = [...pizzaState];
      const index = arr[count - 1].toppings?.freeToppings.findIndex(
        (item) => (item.toppingsCode = freeToppings.toppingsCode)
      );
      if (index !== -1) {
        arr[count - 1].toppings?.freeToppings.splice(index, 1);
      }
      setPizzaState(arr);
    }
  };
  useEffect(() => {
    if (
      payloadEdit !== undefined &&
      payloadEdit?.productType === "Special_Pizza"
    ) {
      console.log(payloadEdit, "comm dips special pizza edit");
      handleGetSpecial({ code: payloadEdit?.code });
      console.log(payloadEdit?.config?.pizza, "payloadEdit?.config?.pizza");
      setPizzaSize(payloadEdit?.pizzaSize);
      // console.log(pizzaSize, "pizzaSize");
      setPizzaState(payloadEdit?.config?.pizza);
      setDrinksArr(payloadEdit?.config?.drinks);
      console.log(payloadEdit?.config?.dips, "payloadEdit?.config?.dipsArr");
      setDipsArr(payloadEdit?.config?.dips);
      setSidesArr(payloadEdit?.config?.sides);
      console.log(payloadEdit?.amount, "(payloadEdit?.amount");
      console.log(price, "ttttprice before");
      setPrice(Number(payloadEdit?.amount));
      console.log(price, "ttttprice after");
      console.log(pizzaState, "pizza state useeffect editpayload");
    }
  }, [payloadEdit]);
  useEffect(() => {
    console.log(price, "payloadEdit?.amount useeffect");
  }, []);
  const [freeToppingsCount, setFreeToppingsCount] = useState(0);

  useEffect(() => {
    console.log(pizzaState, "pizza state useeffect");
  }, [pizzaState]);

  useEffect(() => {
    console.log(pizzaState, "all pizza state");
  }, [pizzaState]);
  useEffect(() => {
    specialIngredients();
    dispatch(setDisplaySpecialForm(false));
  }, []);

  //Component - Special Pizza Selection
  const elements = [];
  console.log(getSpecialData, "getSpecialData");
  const createEmptyObjects = (count) => {
    const emptyObjectsArray = Array.from({ length: count }, () => ({
      crust: getSpecialData?.crust[0],
      cheese: getSpecialData?.cheese[0],
      specialbases: getSpecialData?.specialbases[0],
      toppings: {
        countAsTwoToppings: [],
        countAsOneToppings: [],
        freeToppings: [],
      },
    }));
    console.log(emptyObjectsArray, "pizza state useeffect emptyObjectsArray");
    setPizzaState(emptyObjectsArray);
  };

  useEffect(() => {
    console.log("select function 2 : ");
    if (getSpecialData?.noofToppings !== undefined) {
      setOfferedFreeToppings(Number(getSpecialData?.noofToppings));
    }
    console.log(getSpecialData, "getSpecialData");
    if (payloadEdit === undefined) {
      createEmptyObjects(Number(getSpecialData?.noofPizzas));
    }
    setFreeToppingsCount(Number(getSpecialData?.noofToppings));
  }, [getSpecialData]);

  for (let i = 1; i <= getSpecialData?.noofPizzas; i++) {
    elements.push(
      <SpecialPizzaSelection
        pizzaState={pizzaState}
        handleFreeToppings={handleFreeToppings}
        handleOneToppings={handleOneToppings}
        handleTwoToppings={handleTwoToppings}
        getSpecialData={getSpecialData}
        count={i}
        toppingsData={toppingsData}
        // setCrust={setCrust}
        handleCrustChange={handleCrustChange}
        crustSelected={crustSelected}
        cheeseSelected={cheeseSelected}
        specialBasesSelected={specialBasesSelected}
        setCheeseSelected={setCheeseSelected}
        handleSpecialBasesChange={handleSpecialBasesChange}
        handleCheeseChange={handleCheeseChange}
        handleCountAsTwoToppingsPlacementChange={
          handleCountAsTwoToppingsPlacementChange
        }
        handleCountAsOneToppingsPlacementChange={
          handleCountAsOneToppingsPlacementChange
        }
        handleFreeToppingsPlacementChange={handleFreeToppingsPlacementChange}
      />
    );
  }
  const handleDips = (e, dips) => {
    let { checked } = e.target;
    if (checked) {
      let obj = {
        ...dips,
        qty: 1,
      };
      setDipsArr([...dipsArr, obj]);
    } else {
      let filteredDips = dipsArr?.filter(
        (item) => item.dipsCode !== dips.dipsCode
      );
      setDipsArr(filteredDips);
    }
  };
  const handleDipsCount = (e, dips) => {
    let ind = dipsArr?.findIndex((item) => item.dipsCode === dips.dipsCode);
    if (ind !== -1) {
      let updatedDips = {
        ...dips,
        qty: e.target.value,
      };
      console.log(updatedDips, "updatedDips");
      console.log(updatedDips, "dips updated: ");
      console.log(dipsArr, "dips updated: ");
      let temp = [...dipsArr];
      temp[ind] = updatedDips;
      console.log(temp, "dips updated: ");
      setDipsArr(temp);
    }
  };
  const handleSides = (e, sides) => {
    // console.log(sides, "index of side new addded");
    let { checked } = e.target;

    if (checked) {
      let obj = {
        ...sides,
        lineEntries: [sides.lineEntries[0]],
        qty: 1,
      };
      console.log(obj, "index of side new addded");
      setSidesArr([...sidesArr, obj]);
    } else {
      let filteredSides = sidesArr?.filter((item) => item.code !== sides.code);
      setSidesArr(filteredSides);
    }
  };
  const handleSidelineEntries = (e, sides) => {
    let ind = sidesArr?.findIndex((item) => item.code === sides.code);
    console.log(sides, "index of side line");
    console.log(sidesArr, "index of side line");
    console.log(ind, "index of side line");
    console.log(e.target.value, "selectedLineEntries");
    if (ind !== -1) {
      // if (selectedLineEntries.length !== 0) {
      let selectedEntry = sides?.lineEntries?.filter(
        (item) => item.code === e.target.value
      );
      console.log(selectedEntry, "selectedEntry");
      // }
      let updatedSide = {
        ...sides,
        lineEntries: selectedEntry,
      };
      console.log(updatedSide, "updatedSides");
      let temp = [...sidesArr];
      temp[ind] = updatedSide;
      setSidesArr(temp);
    }
  };
  const handleDrinks = (e, drink) => {
    let { checked } = e.target;
    if (checked) {
      console.log(drink, "drink");
      setDrinksArr([...drinksArr, drink]);
    } else {
      let filteredDrinks = drinksArr?.filter(
        (item) => item.code !== drink.code
      );
      setDrinksArr(filteredDrinks);
    }
  };
  const handlePops = (e, pops) => {
    let { checked } = e.target;
    if (checked) {
      setPopsArr([...popsArr, pops]);
    } else {
      let filteredPops = popsArr?.filter((item) => item.code !== pops.code);
      setPopsArr(filteredPops);
    }
  };

  const handleAddToCart = () => {
    if (
      payloadEdit !== undefined &&
      payloadEdit?.productType === "Special_Pizza"
    ) {
      let payloadForEdit = {
        id: payloadEdit?.id,
        code: getSpecialData.code,

        productCode: "#NA",
        productType: "Special_Pizza",
        productName: getSpecialData?.name,
        config: {
          pizza: pizzaState,
          sides: sidesArr,
          dips: dipsArr,
          drinks: [drinksArr, popsArr],
        },
        quantity: "1",
        price: "0",
        amount: price,
        pizzaSize: pizzaSize === "Large" ? "Large" : "Extra Large",
      };
      const updatedCart = cartdata.findIndex(
        (item) => item.id === payloadEdit.id
      );
      console.log();
      let tempPayload = [...cartdata];
      tempPayload[updatedCart] = payloadForEdit;
      dispatch(addToCart([...tempPayload]));
      setSidesArr([]);
      setDrinksArr([]);
      setDipsArr([]);
      setPopsArr([]);
      toast.success(`Special Pizza edited Successfully...`);
      setPayloadEdit("");
      createEmptyObjects(Number(getSpecialData?.noofPizzas));
    } else {
      let payload = {
        id: uuidv4(),
        code: getSpecialData.code,
        productCode: "#NA",
        productType: "Special_Pizza",
        productName: getSpecialData?.name,
        config: {
          pizza: pizzaState,
          sides: sidesArr,
          dips: dipsArr,
          drinks: [drinksArr, popsArr],
        },
        quantity: "1",
        price: "0",
        amount: price,
        pizzaSize: pizzaSize === "Large" ? "Large" : "Extra Large",
      };

      dispatch(addToCart([...cartdata, payload]));
      toast.success(`Special Pizza Added Successfully...`);
      setSidesArr([]);
      setDrinksArr([]);
      setDipsArr([]);
      setPopsArr([]);
      createEmptyObjects(Number(getSpecialData?.noofPizzas));
    }
  };
  // Customize Details
  const handleGetSpecial = (speicalPizza) => {
    getSpecialDetails(
      { code: speicalPizza.code },
      getSpecialDetailsApi,
      setGetSpecialData
    );
    toppings();
    dips();

    // setShow(true);
    dispatch(setDisplaySpecialForm(true));
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

  //API - Toppings Data
  const toppings = () => {
    toppingsApi()
      .then((res) => {
        console.log(res.data.data, "api res toppingsdata");
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
  // Calculate Price
  const calculatePrice = () => {
    let totalPrice = 0;
    console.log("Initial totalPrice: ", totalPrice);

    // Calculate base pizza price
    totalPrice +=
      pizzaSize === "Large"
        ? Number(getSpecialData?.largePizzaPrice)
        : Number(getSpecialData?.extraLargePizzaPrice);

    console.log("Initial totalPrice: Base pizza price:", totalPrice);

    // Iterate through pizzaState
    pizzaState?.forEach((item) => {
      totalPrice += item?.cheese?.price ? Number(item?.cheese?.price) : 0;
      totalPrice += item?.crust?.price ? Number(item?.crust?.price) : 0;
      totalPrice += item?.specialbases?.price
        ? Number(item?.specialbases?.price)
        : 0;

      // item?.toppings?.countAsOneToppings?.forEach((toppings, index) => {
      //   if (
      //     item?.toppings?.countAsOneToppings.length <=
      //     getSpecialData?.noofToppings
      //   ) {
      //     setOfferedFreeToppings(offeredFreeToppings + 1);
      //   }
      //   if (getSpecialData?.noofToppings < index + 1) {
      //     totalPrice += Number(toppings?.price);
      //   } else if (offeredFreeToppings > 0) {
      //     setOfferedFreeToppings(offeredFreeToppings - 1);
      //   }
      //   console.log("Initial totalPrice: Base pizza price:", totalPrice);
      // });

      // Add prices for countAsTwoToppings
      item?.toppings?.countAsTwoToppings?.forEach((toppings) => {
        console.log("freeToppingsCount ", freeToppingsCount, " ");
        if (offeredFreeToppings <= 0) {
          totalPrice += Number(toppings?.price);
        }
        console.log("Initial totalPrice: Base pizza price:", totalPrice);
      });
      item?.toppings?.countAsOneToppings?.forEach((toppings) => {
        console.log(freeToppingsCount, "freeToppingsCount");
        totalPrice += Number(toppings?.price);
        console.log("Initial totalPrice: Base pizza price:", totalPrice);
      });

      // Add prices for freeToppings
      item?.toppings?.freeToppings?.forEach((toppings) => {
        console.log(freeToppingsCount, "freeToppingsCount");
        console.log(toppings?.price, "toppings?.price");
        totalPrice += Number(toppings?.price);
        console.log("Initial totalPrice: Base pizza price:", totalPrice);
      });
    });

    // Iterate through dipsArr
    dipsArr?.forEach((item) => {
      totalPrice += Number(item?.price) * Number(item?.qty);
      console.log("Initial totalPrice: Base pizza price:", totalPrice);
    });

    // // Iterate through sidesArr
    sidesArr?.forEach((item) => {
      totalPrice += Number(item?.lineEntries[0]?.price);
      console.log("Initial totalPrice: Base pizza price:", totalPrice);
    });

    // Iterate through drinksArr
    drinksArr?.forEach((drinks) => {
      totalPrice += Number(drinks?.price);
    });
    // drinks[1]?.forEach((drinks) => {
    //   totalPrice += Number(drinks?.price);
    // });

    //   // totalPrice += Number(drinks?.price);
    //   console.log("Initial totalPrice: Base pizza price:", totalPrice);

    // Iterate through popsArr
    // popsArr?.forEach((item) => {
    //   totalPrice += Number(item?.price);
    //   // console.log("Initial totalPrice: Base pizza price:", totalPrice);
    // });

    // Set the calculated price
    console.log(price, "ttttprice befire calculate");

    setPrice(Number(totalPrice.toFixed(2)));

    console.log(price, "ttttprice after calculate");
    console.log("Initial totalPrice: Base pizza price:", totalPrice);
  };

  useEffect(() => {
    console.log(drinksArr, "drinksArr");
    console.log(popsArr, "drinksArr");

    calculatePrice();
  }, [
    pizzaState,
    sidesArr,
    dipsArr,
    selectedLineEntries,
    pizzaSize,
    drinksArr,
    popsArr,
  ]);
  useEffect(() => {
    // console.log(getSpecialData);
    if (getSpecialData) {
      calculatePrice();
    }
  }, [getSpecialData]);

  return (
    <>
      <div className='d-flex flex-wrap justify-content-center'>
        <div className='w-100'>
          {displaySpecialForm ? (
            <>
              {/* Back Button */}
              <div
                className='m-0 p-0 mx-2'
                onClick={() => {
                  setShow(false);
                  setPizzaState();
                  dispatch(setDisplaySpecialForm(false));
                }}
                style={{ cursor: "pointer" }}
              >
                <img
                  className='mb-2 p-0'
                  src={`${backBtn}`}
                  width='35px'
                  height='35px'
                  alt=''
                />
              </div>

              <div className='customizablePizza px-3'>
                <div className='d-flex justify-content-between'>
                  <h6>{getSpecialData?.name}</h6>
                  <h6 className='mx-2'>$ {price}</h6>
                </div>
                <div className='mb-4'>
                  <p className='mb-1'>
                    Toppings :{" "}
                    <span className='mx-2'>
                      {offeredFreeToppings} / {getSpecialData?.noofToppings}
                    </span>
                  </p>
                  {/* <p className="mb-1">
                    Additional Toppings Used :
                    <span className="mx-2">0 ($2.00)</span>
                  </p> */}
                  <p className='mb-1 d-inline'>Size : </p>
                  <select
                    onChange={(e) => setPizzaSize(e.target.value)}
                    className='form-select mx-2 my-2 w-25 d-inline'
                    value={pizzaSize}
                  >
                    <option value='Large'>Large</option>
                    <option value='Extra Large'>Extra Large</option>
                  </select>
                </div>

                {elements}

                {/* Sides */}
                {getSpecialData?.sides.length === 0 ? (
                  ""
                ) : (
                  <>
                    <h6 className='text-left mt-1 mb-2'>Sides</h6>
                    <div id='sides' className='mb-3'>
                      <ul className='list-group'>
                        {getSpecialData?.sides?.map((sidesData) => {
                          console.log(sidesData, "sidesData");
                          const comm = sidesArr.findIndex(
                            (item) => item.code === sidesData.code
                          );

                          console.log(comm, "sidesData");
                          return (
                            <>
                              <li
                                className='list-group-item d-flex justify-content-between align-items-center'
                                key={sidesData.code + "sidesData"}
                              >
                                <label className='d-flex align-items-center'>
                                  <input
                                    type='checkbox'
                                    className='mx-3 d-inline-block'
                                    checked={comm !== -1 ? true : false}
                                    onChange={(e) => handleSides(e, sidesData)}
                                  />
                                  {sidesData.sideName}
                                </label>
                                <div style={{ width: "12rem" }}>
                                  <select
                                    value={
                                      comm !== -1
                                        ? sidesArr[comm]?.lineEntries[0]?.code
                                        : ""
                                    }
                                    className='form-select w-100 d-inline-block'
                                    onChange={(e) => {
                                      handleSidelineEntries(e, sidesData);
                                    }}
                                  >
                                    {sidesData?.lineEntries?.map(
                                      (lineEntriesData) => {
                                        return (
                                          <option
                                            key={lineEntriesData.code}
                                            defaultValue={lineEntriesData.code}
                                            value={lineEntriesData.code}
                                          >
                                            <span>
                                              {lineEntriesData.size} -{" "}
                                            </span>
                                            <span className='mb-0 mx-2'>
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
                    <h6 className='text-left mt-1 mb-2'>Dips</h6>
                    <div id='dips' className='mb-3'>
                      <ul className='list-group'>
                        {dipsData?.map((data, index) => {
                          console.log(dipsArr, "dips map");
                          const comm = dipsArr?.findIndex(
                            (item) => item.dipsCode === data.dipsCode
                          );
                          console.log(dipsArr, "comm dips" + index);
                          console.log(comm, "comm dips" + index);

                          return (
                            <li className='list-group-item' key={data.dipsCode}>
                              <div className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex align-items-center'>
                                  <label className='d-flex align-items-center'>
                                    <input
                                      type='checkbox'
                                      className='mx-3 d-inline-block'
                                      checked={comm !== -1 ? true : false}
                                      onChange={(e) => handleDips(e, data)}
                                    />
                                    {data.dipsName} - ${data.price}
                                  </label>
                                </div>
                                <input
                                  type='number'
                                  defaultValue={1}
                                  min={1}
                                  value={
                                    dipsArr[comm]?.qty ? dipsArr[comm]?.qty : 1
                                  }
                                  className='form-control mx-2'
                                  style={{ width: "75px" }}
                                  onChange={(e) => handleDipsCount(e, data)}
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
                      <h6 className='text-left mt-1 mb-2'>Drinks</h6>
                    )}

                    <div id='drinks' className='mb-3'>
                      <ul className='list-group'>
                        {getSpecialData?.pops.map((pop) => {
                          const comm = popsArr?.findIndex(
                            (item) => item.code === pop.code
                          );

                          return (
                            <li
                              className='list-group-item d-flex justify-content-between align-items-center'
                              key={pop.code}
                            >
                              <label className='d-flex align-items-center'>
                                <input
                                  type='checkbox'
                                  className='mx-3 d-inline-block'
                                  checked={comm !== -1 ? true : false}
                                  onChange={(e) => handlePops(e, pop)}
                                />
                                {pop.softDrinkName}
                              </label>
                              <p className='mb-0 mx-2'>$ {pop.price}</p>
                            </li>
                          );
                        })}
                        {getSpecialData?.bottle.map((pop) => {
                          const comm = drinksArr?.findIndex(
                            (item) => item.code === pop.code
                          );
                          return (
                            <li
                              className='list-group-item d-flex justify-content-between align-items-center'
                              key={pop.code}
                            >
                              <label className='d-flex align-items-center'>
                                <input
                                  type='checkbox'
                                  className='mx-3 d-inline-block'
                                  checked={comm !== -1 ? true : false}
                                  onChange={(e) => handleDrinks(e, pop)}
                                />
                                {pop.softDrinkName}
                              </label>
                              <p className='mb-0 mx-2'>$ {pop.price}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}

                {/* Comments */}
                <h6 className='text-left mt-1 mb-2'>Comments</h6>
                <div className=''>
                  <textarea
                    className='form-control'
                    rows='4'
                    cols='50'
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                {/* Add to Cart Button */}
                <div className='d-flex flex-row justify-content-center align-items-center addToCartDiv mt-3 mb-3'>
                  <button
                    type='button'
                    className='btn btn-sm my-1 mb-2 px-4 py-2 addToCartbtn'
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </>
          ) : (
            <ul
              className='list-group'
              style={{ overflowY: "scroll", height: "30rem" }}
            >
              {specialData?.map((speicalPizza) => {
                return (
                  <li className='list-group-item' key={speicalPizza.code}>
                    <div className='d-flex justify-content-between align-items-end py-2 px-1'>
                      <div className='d-flex align-items-center'>
                        <div className='d-flex flex-column mx-4'>
                          <h6 className='mb-1'>{speicalPizza.name}</h6>
                          <span>{speicalPizza.noofToppings} Toppings</span>
                          <span>{speicalPizza.noofPizzas} Pizzas</span>
                        </div>
                      </div>
                      <div className='d-flex flex-column align-items-end'>
                        <h6 className='mb-3'>
                          $ {speicalPizza.largePizzaPrice}
                        </h6>
                        <button
                          type='button'
                          // ref={
                          //   speicalPizza.name === payloadEdit?.productName
                          //     ? specialTabRef
                          //     : null
                          // }
                          className='btn btn-sm customize py-1 px-2'
                          onClick={() => {
                            handleGetSpecial(speicalPizza);
                            createEmptyObjects(
                              Number(getSpecialData?.noofPizzas)
                            );
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
