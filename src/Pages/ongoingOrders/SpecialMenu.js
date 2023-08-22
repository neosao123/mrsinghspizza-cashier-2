import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setDisplaySpecialForm } from "../../reducer/cartReducer";
import { toast } from "react-toastify";
import { getSpecialDetails } from "./specialMenu/specialMenuCustomApiHandler";

function SpecialMenu({ setPayloadEdit, payloadEdit, specialTabRef }) {
  const [pizzaState, setPizzaState] = useState();
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
  const [additionalToppingsCount, setAdditionalToppingsCount] = useState(0);
  const [noOfFreeDips, setNoOfFreeDips] = useState(0);
  const [noofFreeDrinks, setNoofFreeDrinks] = useState(0);
  const [allToppings, setAllToppings] = useState([]);
  const [totalPriceOfToppings, setTotalPriceOfToppings] = useState(0);
  const [totalPriceOfDips, setTotalPriceOfDips] = useState(0);
  const [totalPriceOfDipsFinal, setTotalPriceOfDipsFinal] = useState(0);
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
  const handlePriceWithFreeToppins = (
    countAsTwoToppings,
    offeredFreeToppings
  ) => {
    if (countAsTwoToppings.price - offeredFreeToppings <= 0) {
      setOfferedFreeToppings(offeredFreeToppings - 2);
      return 0;
    }
    setOfferedFreeToppings(offeredFreeToppings - 2);
    return (
      countAsTwoToppings.price -
      (offeredFreeToppings <= 0 ? 0 : offeredFreeToppings)
    );
  };
  const handlePriceWithFreeToppinsCountAsOne = (
    countAsOneToppings,
    offeredFreeToppings
  ) => {
    if (1 - offeredFreeToppings <= 0) {
      setOfferedFreeToppings(offeredFreeToppings - 1);
      return 0;
    }
    setOfferedFreeToppings(offeredFreeToppings - 1);
    return (
      countAsOneToppings.price -
      (offeredFreeToppings <= 0 ? 0 : offeredFreeToppings)
    );
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
    arr[count - 1] = {
      ...arr[count - 1],
      crust: selectedObject,
    };
    // setPrice((prev) => prev + Number(selectedObject.price));
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
    setPizzaState(arr);
  };
  useEffect(() => {
    console.log(totalPriceOfToppings, "totalPriceOfToppings");
  }, [totalPriceOfToppings]);

  const handleTwoToppings = (e, count, countAsTwoToppings) => {
    const { checked } = e.target;
    if (checked) {
      let arr = [...pizzaState];

      const tempCountAsTwo = [
        ...(arr[count - 1].toppings?.countAsTwoToppings || []),
        {
          ...countAsTwoToppings,
          placement: "whole",

          // price: handlePriceWithFreeToppins(
          //   countAsTwoToppings,
          //   offeredFreeToppings
          // ),
        },
      ];
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1].toppings,
          countAsTwoToppings: tempCountAsTwo,
        },
      };
      // if (offeredFreeToppings > 0) {
      //   if (offeredFreeToppings - 2 === -1) {
      //     setTotalPriceOfToppings(
      //       (prev) => prev + Number(countAsTwoToppings.price) / 2
      //     );
      //     setAdditionalToppingsCount(1);
      //     setOfferedFreeToppings(0);
      //   }
      //   setOfferedFreeToppings((prev) => prev - 2);
      // } else {
      //   console.log(countAsTwoToppings.price);
      //   setTotalPriceOfToppings(
      //     (prev) => prev + Number(countAsTwoToppings.price)
      //   );
      // }
      setAllToppings([...allToppings, Number(countAsTwoToppings.countAs)]);
      setPizzaState(arr);
      console.log(offeredFreeToppings);
      if (offeredFreeToppings <= 0) {
        console.log(offeredFreeToppings, "j");
        console.log(additionalToppingsCount, "j");
        setAdditionalToppingsCount((val) => val + 2);
      }
    } else {
      let arr = [...pizzaState];

      const index = arr[count - 1]?.toppings?.countAsTwoToppings.findIndex(
        (item) => item.toppingsCode === countAsTwoToppings.toppingsCode
      );
      // const index2 = allToppings?.findIndex(
      //   (item) => item.toppingsCode === countAsTwoToppings.toppingsCode
      // );
      let updatedAll = allToppings.filter(
        (item) => item.toppingsCode !== countAsTwoToppings.toppingsCode
      );
      setAllToppings(updatedAll);

      if (index !== -1 && arr[count - 1]?.toppings?.countAsTwoToppings) {
        if (offeredFreeToppings <= 0) {
          if (additionalToppingsCount === 1) {
            setAdditionalToppingsCount((val) => {
              return val - 2 === -1 ? 0 : val - 2;
            });
            setOfferedFreeToppings(1);
            // setTotalPriceOfToppings((prev) => {
            //   return prev - 1;
            // });
            // setPrice((prev) => prev - Number(countAsTwoToppings.price));
          } else {
            if (offeredFreeToppings === 0) {
              setOfferedFreeToppings((prev) => prev + 2);
            }
            setAdditionalToppingsCount((prev) => prev - 2);
            // setTotalPriceOfToppings(
            //   (prev) => prev - Number(countAsTwoToppings.price)
            // );
          }
        } else if (offeredFreeToppings <= getSpecialData?.noofToppings) {
          setOfferedFreeToppings((prev) => prev + 2);
        }
        let updatedArr = arr[count - 1]?.toppings?.countAsTwoToppings.filter(
          (item) => item.toppingsCode !== countAsTwoToppings.toppingsCode
        );
        console.log(updatedArr, "updatedArr");
        arr[count - 1] = {
          ...arr[count - 1],
          toppings: {
            ...arr[count - 1].toppings,
            countAsTwoToppings: updatedArr,
          },
        };
      }
      setPizzaState(arr);
    }
  };
  const calculateTotalPrice = () => {
    let sum = 0;
    if (pizzaState?.length > 0) {
      pizzaState[0]?.toppings?.countAsTwoToppings?.forEach(
        (item) => (sum += Number(item.price))
      );
    }

    return sum;
  };
  // useEffect(() => {
  //   let sum =
  //     calculateTotalPrice() >= getSpecialData?.noofToppings
  //       ? calculateTotalPrice() - getSpecialData?.noofToppings
  //       : 0;
  //   setTotalPriceOfToppings((prev) => prev + sum);
  // }, [pizzaState]);

  const handleOneToppings = (e, count, countAsOneToppings) => {
    const { checked } = e.target;
    if (checked) {
      let arr = [...pizzaState];
      const tempCountAsOne = [
        ...(arr[count - 1].toppings?.countAsOneToppings || []),
        {
          ...countAsOneToppings,
          placement: "whole",
          // price: handlePriceWithFreeToppinsCountAsOne(
          //   countAsOneToppings,
          //   offeredFreeToppings
          // ),
        },
      ];

      arr[count - 1].toppings = {
        ...arr[count - 1].toppings,
        countAsOneToppings: tempCountAsOne,
      };

      setAllToppings([...allToppings, Number(countAsOneToppings.countAs)]);

      setPizzaState(arr);

      console.log(offeredFreeToppings, "j");
      if (offeredFreeToppings <= 0) {
        setAdditionalToppingsCount((val) => {
          return val + 1;
        });
        // setTotalPriceOfToppings(
        //   (prev) => prev + Number(countAsOneToppings.price)
        // );
      } else {
        setOfferedFreeToppings((prev) => prev - 1);
      }
    } else {
      let arr = [...pizzaState];
      const index = arr[count - 1].toppings?.countAsOneToppings.findIndex(
        (item) => item.toppingsCode == countAsOneToppings.toppingsCode
      );
      let updatedAll = allToppings.filter(
        (item) => item.toppingsCode !== countAsOneToppings.toppingsCode
      );
      setAllToppings(updatedAll);
      if (index !== -1) {
        let updatedArr = arr[count - 1]?.toppings?.countAsOneToppings.filter(
          (item) => item.toppingsCode !== countAsOneToppings.toppingsCode
        );
        arr[count - 1] = {
          ...arr[count - 1],
          toppings: {
            ...arr[count - 1].toppings,
            countAsOneToppings: updatedArr,
          },
        };
      }
      setPizzaState(arr);
      if (offeredFreeToppings <= 0) {
        if (additionalToppingsCount > 0) {
          setAdditionalToppingsCount((val) => {
            return val - 1;
          });
          // setTotalPriceOfToppings(
          //   (prev) => prev - Number(countAsOneToppings.price)
          // );
        } else {
          setOfferedFreeToppings((prev) => prev + 1);
        }
      } else if (offeredFreeToppings <= getSpecialData?.noofToppings) {
        setOfferedFreeToppings((prev) => prev + 1);
      }
    }
  };
  const handleFreeToppingsPlacementChange = (event, count, toppingsCode) => {
    const selectedValue = event.target.value;
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
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1]?.toppings,
          freeToppings: [
            ...arr[count - 1]?.toppings?.freeToppings.slice(
              0,
              indexOfSelectedObject
            ),
            selectedObject,
            ...arr[count - 1]?.toppings?.freeToppings.slice(
              indexOfSelectedObject + 1
            ),
          ],
        },
      };
    }
    setPizzaState(arr);
  };
  const handleCountAsOneToppingsPlacementChange = (
    event,
    count,
    toppingsCode
  ) => {
    const selectedValue = event.target.value;
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
      arr[count - 1] = {
        ...arr[count - 1],
        toppings: {
          ...arr[count - 1]?.toppings,
          countAsOneToppings: [
            ...arr[count - 1]?.toppings?.countAsOneToppings.slice(
              0,
              indexOfSelectedObject
            ),
            selectedObject,
            ...arr[count - 1]?.toppings?.countAsOneToppings.slice(
              indexOfSelectedObject + 1
            ),
          ],
        },
      };
    }
    setPizzaState(arr);
  };
  const handleFreeToppings = (e, count, freeToppings) => {
    const { checked } = e.target;
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
      setPizzaState(arr);
    } else {
      let arr = [...pizzaState];
      const index = arr[count - 1].toppings?.freeToppings?.findIndex(
        (item) => item.toppingsCode == freeToppings.toppingsCode
      );
      if (index !== -1) {
        let updatedArr = arr[count - 1]?.toppings?.freeToppings?.filter(
          (item) => item.toppingsCode !== freeToppings.toppingsCode
        );
        arr[count - 1] = {
          ...arr[count - 1],
          toppings: {
            ...arr[count - 1].toppings,
            freeToppings: updatedArr,
          },
        };
      }
      setPizzaState(arr);
    }
  };
  useEffect(() => {
    if (
      payloadEdit !== undefined &&
      payloadEdit?.productType === "Special_Pizza"
    ) {
      handleGetSpecial({ code: payloadEdit?.code });
      setPizzaSize(payloadEdit?.pizzaSize);
      setPizzaState(payloadEdit?.config?.pizza);
      setDrinksArr(payloadEdit?.config?.drinks);
      setDipsArr(payloadEdit?.config?.dips);
      setSidesArr(payloadEdit?.config?.sides);

      setPrice(Number(payloadEdit?.amount));
      console.log(payloadEdit, "payloadEdit");
      setComments(payloadEdit?.comments);
    }
  }, [payloadEdit]);

  useEffect(() => {}, [pizzaState]);

  useEffect(() => {}, [pizzaState]);
  useEffect(() => {
    specialIngredients();
    dispatch(setDisplaySpecialForm(false));
  }, []);

  //Component - Special Pizza Selection
  const elements = [];
  const createEmptyObjects = (count) => {
    const emptyObjectsArray = Array.from({ length: count }, () => ({
      crust: getSpecialData?.crust[0],
      cheese: getSpecialData?.cheese[0],
      specialbases: {},
      toppings: {
        countAsTwoToppings: [],
        countAsOneToppings: [],
        freeToppings: [],
      },
    }));
    setPizzaState(emptyObjectsArray);
  };

  useEffect(() => {
    if (getSpecialData?.noofToppings !== undefined) {
      setOfferedFreeToppings(Number(getSpecialData?.noofToppings));
    }
    if (getSpecialData?.noofDips !== undefined) {
      setNoOfFreeDips(Number(getSpecialData?.noofDips));
    }
    if (getSpecialData?.noofDrinks !== undefined) {
      setNoofFreeDrinks(Number(getSpecialData?.noofDrinks));
    }
    if (payloadEdit === undefined) {
      createEmptyObjects(Number(getSpecialData?.noofPizzas));
    }
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
  useEffect(() => {
    console.log(price, "price at dips");
  }, [price]);

  const handleDips = (e, dips) => {
    let { checked } = e.target;
    if (checked) {
      let obj = {
        ...dips,
        qty: 1,
        prevQty: 0,
      };
      setDipsArr([...dipsArr, obj]);
      // calculateDipsPrice(obj, noOfFreeDips);
      // if (noOfFreeDips <= 0) {
      //   console.log(dips.qty, "price at dips");
      //   let tempQty = dips.qty === undefined ? 1 : Number(dips.qty);
      //   setTotalPriceOfDips(
      //     (prev) => prev + Number(dips.price) * Number(tempQty)
      //   );
      // } else {
      //   console.log(noOfFreeDips, "price at dips");
      //   setNoOfFreeDips((prev) => prev - 1);
      // }
      // console.log(noOfFreeDips, "price at dips parent");

      // calculateDipsPrice(dips, noOfFreeDips);
    } else {
      let filteredDips = dipsArr?.filter(
        (item) => item.dipsCode !== dips.dipsCode
      );
      let tempDips = dipsArr?.filter((item) => item.dipsCode === dips.dipsCode);
      setDipsArr(filteredDips);
      // setNoOfFreeDips((prev) => prev + 1);
      console.log(noOfFreeDips, "price at dips");
      // if (noOfFreeDips - 1 <= 0) {
      //   setTotalPriceOfDips((prev) => {
      //     return prev - tempDips[0].price * tempDips[0].qty;
      //   });
      //   setNoOfFreeDips((prev) => prev + 1);
      // }
    }
  };
  const handleDipsCount = (e, dips) => {
    let ind = dipsArr?.findIndex((item) => item.dipsCode === dips.dipsCode);
    let tempDips = dipsArr?.find((item) => item.dipsCode === dips.dipsCode);
    if (ind !== -1) {
      let updatedDips = {
        ...dips,
        qty: e.target.value,
      };
      console.log(dips, "price at dips");
      // calculateDipsPrice(
      //   {
      //     ...tempDips,
      //     qty:
      //       dips.qty < e.target.value
      //         ? e.target.value - dips.qty
      //         : e.target.value,
      //     prevQty: tempDips.qty,
      //   },
      //   noOfFreeDips
      // );
      let temp = [...dipsArr];
      temp[ind] = updatedDips;
      setDipsArr(temp);
    }
  };
  const handleSides = (e, sides) => {
    let { checked } = e.target;

    if (checked) {
      let obj = {
        ...sides,
        lineEntries: [sides.lineEntries[0]],
        qty: 1,
      };
      setSidesArr([...sidesArr, obj]);
    } else {
      let filteredSides = sidesArr?.filter((item) => item.code !== sides.code);
      setSidesArr(filteredSides);
    }
  };
  const handleSidelineEntries = (e, sides) => {
    let ind = sidesArr?.findIndex((item) => item.code === sides.code);

    if (ind !== -1) {
      let selectedEntry = sides?.lineEntries?.filter(
        (item) => item.code === e.target.value
      );
      let updatedSide = {
        ...sides,
        lineEntries: selectedEntry,
      };
      let temp = [...sidesArr];
      temp[ind] = updatedSide;
      setSidesArr(temp);
    }
  };
  const handleDrinks = (e, drink) => {
    let { checked } = e.target;
    if (checked) {
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
      setDrinksArr([...drinksArr, pops]);
    } else {
      let filteredPops = drinksArr?.filter((item) => item.code !== pops.code);
      setDrinksArr(filteredPops);
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
        comments: comments,
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
      setComments("");
      toast.success(`Special Pizza edited Successfully...`);
      setPayloadEdit();
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
          drinks: [...drinksArr, ...popsArr],
        },
        quantity: "1",
        price: "0",
        amount: price,
        comments: comments,
        pizzaSize: pizzaSize === "Large" ? "Large" : "Extra Large",
      };

      dispatch(addToCart([...cartdata, payload]));
      toast.success(`Special Pizza Added Successfully...`);
      setSidesArr([]);
      setDrinksArr([]);
      setDipsArr([]);
      setPopsArr([]);
      setComments("");
      setAdditionalToppingsCount(0);
      setOfferedFreeToppings(Number(getSpecialData?.noofToppings));
      console.log(Number(getSpecialData?.price), "payloadEdit");
      setPrice(Number(getSpecialData?.price));
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

    // Calculate base pizza price
    totalPrice +=
      pizzaSize === "Large"
        ? Number(getSpecialData?.largePizzaPrice)
        : Number(getSpecialData?.extraLargePizzaPrice);

    // Iterate through pizzaState
    pizzaState?.forEach((item) => {
      totalPrice += item?.cheese?.price ? Number(item?.cheese?.price) : 0;

      totalPrice += item?.crust?.price ? Number(item?.crust?.price) : 0;

      totalPrice += item?.specialbases?.price
        ? Number(item?.specialbases?.price)
        : 0;

      let totalToppingsCount = 0;
      totalToppingsCount = allToppings?.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      // console.log(totalToppingsCount, "updatedAll sum");
      let tempToppingsPrice = 0;
      let remainingItemCount = 0;

      // console.log("topping sum i", allToppings[1], allToppings[2]);
      let sum = 0;
      for (let i = 0; i < allToppings.length; i++) {
        console.log("topping sum i", allToppings[i], allToppings[i + 1]);
        sum = allToppings[i] + allToppings[i + 1];
        console.log("topping sum", sum);
        if (sum > offeredFreeToppings) {
          tempToppingsPrice += sum - offeredFreeToppings;
          console.log(
            allToppings.length - (i + 1),
            "topping sum restSum updatedAll"
          );
          // if (allToppings.length - (i + 1) > 0) {
          //   let restSum = allToppings.length - (i + 1);
          //   console.log(allToppings, "topping sum restSum updatedAll");
          //   console.log("topping sum restSum", restSum);
          //   tempToppingsPrice += restSum * 2;
          //   console.log("topping sum tempToppingsPrice if", tempToppingsPrice);
          // }

          // break;
        } else if (sum > 0) {
          // Otherwise, increment the remainingItemCount
          remainingItemCount++;
        }
        // if (sum == offeredFreeToppings) {
        //   let restSum = allToppings.length - (i + 1);
        //   tempToppingsPrice += restSum * 2;
        // }
      }
      console.log("topping sum remainingItemCount", remainingItemCount);
      console.log("topping sum tempToppingsPrice", tempToppingsPrice);
      // console.log(tempToppingsPrice, "updatedAll tempToppingsPrice");

      // totalToppingsCount = ;
      // item?.toppings?.countAsTwoToppings?.forEach((toppings) => {
      //   totalToppingsCount += 2;
      // });
      // item?.toppings?.countAsOneToppings?.forEach((toppings) => {
      //   totalToppingsCount += 1;
      // });
      // if (totalToppingsCount >= offeredFreeToppings) {
      //   console.log("Total Toppings Count", totalToppingsCount);
      //   let paidToppings = Number(totalToppingsCount) - offeredFreeToppings;
      //   // let priceOfOneTopping = item?.toppings?.countAsTwoToppings[0]?.price
      //   //   ? item?.toppings?.countAsTwoToppings[0]?.price
      //   //   : null
      //   //   ? Number(dipsArr[0]?.price)
      //   //   : null;
      //   let priceOfOneTopping = 1;
      //   let paidPrice = paidToppings * priceOfOneTopping;
      //   totalPrice += paidPrice;
      // }

      // // Add prices for freeToppings

      // item?.toppings?.freeToppings?.forEach((toppings) => {
      //   totalPrice += Number(toppings?.price);
      // });
    });

    // Iterate through dipsArr
    let totalQtyDips = 0;
    dipsArr?.forEach((item) => {
      totalQtyDips += Number(item.qty);
    });
    if (totalQtyDips >= noOfFreeDips) {
      let paidDips = Number(totalQtyDips) - noOfFreeDips;
      let priceOfOneDips = dipsArr[0]?.price ? Number(dipsArr[0]?.price) : null;
      let paidPrice = paidDips * priceOfOneDips;
      totalPrice += paidPrice;
    }

    sidesArr?.forEach((item) => {
      totalPrice += Number(item?.lineEntries[0]?.price);
    });

    drinksArr?.forEach((drinks, index) => {
      if (noofFreeDrinks < index + 1) {
        totalPrice += Number(drinks?.price);
      }
    });

    const formattedPrice = (
      Number(totalPrice) +
      Number(totalPriceOfToppings) +
      Number(totalPriceOfDips)
    ).toFixed(2);
    setPrice(formattedPrice);
  };
  useEffect(() => {
    console.log(dipsArr, "qty dips");
  }, [dipsArr]);

  const calculateDipsPrice = (dips, noOfFreeDips) => {
    // console.log(dips.prevQty, "price at dips");
    // if (noOfFreeDips <= 0) {
    //   // console.log(dips.qty, "price at dips");
    //   let tempQty = dips.qty === undefined ? 1 : Number(dips.qty);
    //   // console.log(tempQty, "price at dips");
    //   setTotalPriceOfDips((prev) => {
    //     let sum = prev - Number(dips.price) * Number(dips.prevQty);
    //     // console.log(sum, "price at dips");
    //     return Number(sum) + Number(dips.price) * Number(tempQty);
    //   });
    // } else {
    //   setNoOfFreeDips((prev) => prev - 1);
    // }
  };
  useEffect(() => {
    console.log(price, "pricefinal");
  }, [price]);

  useEffect(() => {
    // calculateDipsPrice();
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
                      {offeredFreeToppings <= 0 ? 0 : offeredFreeToppings} /{" "}
                      {getSpecialData?.noofToppings}
                    </span>
                  </p>

                  <p className='mb-1'>
                    Additional Toppings Used :
                    <span className='mx-2'>
                      {offeredFreeToppings <= 0 ? additionalToppingsCount : 0}{" "}
                      ($2.00)
                    </span>
                  </p>
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
                          const comm = sidesArr.findIndex(
                            (item) => item.code === sidesData.code
                          );
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
                          const comm = dipsArr?.findIndex(
                            (item) => item.dipsCode === data.dipsCode
                          );

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
                    {payloadEdit !== undefined &&
                    payloadEdit?.productType === "Special_Pizza"
                      ? "Edit"
                      : " Add to Cart"}
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
