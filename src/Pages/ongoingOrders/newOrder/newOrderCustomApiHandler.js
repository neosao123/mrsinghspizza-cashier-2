export const pizzaIngredients = async (
  allIngredientsApi,
  setAllIngredients
) => {
  await allIngredientsApi()
    .then((res) => {
      console.log("AllIngredient ", res?.data?.data);
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
