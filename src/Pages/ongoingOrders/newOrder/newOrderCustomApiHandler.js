import { toast } from "react-toastify";

export const pizzaIngredients = async (
  allIngredientsApi,
  setAllIngredients
) => {
  await allIngredientsApi()
    .then((res) => {
      setAllIngredients(res.data.data);
    })
    .catch((err) => {
      console.log("Error From All Ingredient API: ", err);
    });
};

//sides ingrident list
export const sidesIngredient = async (sidesApi, setSidesData) => {
  await sidesApi()
    .then((res) => {
      setSidesData(res.data.data);
    })
    .catch((err) => {
      console.log("Error From All Ingredient API: ", err);
    });
};

// Developer: Shreyas Mahamuni, Working Date: 23-11-2023
// Calling Pizza Price API, It return largestPizzaPrice & extraLargePizzaPrice for custom_pizza and set into setPizzaPriceObj state
export const pizzaPriceData = async (pizzaPriceApi, setPizzaPriceObj) => {
  await pizzaPriceApi()
    .then((res) => {
      setPizzaPriceObj(res.data.data);
    })
    .catch((error) => {
      if (error.response.status === 400 || error.response.status === 500) {
        toast.error(error.response.data.message);
      }
    });
};
