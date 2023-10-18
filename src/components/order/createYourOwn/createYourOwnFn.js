export const resetFields = (
  allIngredients,
  setSpecialBasesSelected,
  setCookSelected,
  setSauseSelected,
  setSpicySelected,
  setCheeseSelected,
  setCrustSelected,
) => {
  setCrustSelected({
    crustCode: allIngredients?.crust[0]?.crustCode,
    crustName: allIngredients?.crust[0]?.crustName,
    price: allIngredients?.crust[0]?.price,
  });
  setCheeseSelected(allIngredients?.cheese[0]);
  setSpicySelected({
    spicyCode: allIngredients?.spices[0].spicyCode,
    spicy: allIngredients?.spices[0]?.spicy,
    price: allIngredients?.spices[0]?.price,
  });

  setSauseSelected({
    sauceCode: allIngredients?.sauce[0]?.sauceCode,
    sauce: allIngredients?.sauce[0]?.sauce,
    price: allIngredients?.sauce[0]?.price,
  });

  setCookSelected({
    cookCode: allIngredients?.cook[0]?.cookCode,
    cook: allIngredients?.cook[0]?.cook,
    price: allIngredients?.cook[0]?.price,
  });
  setSpecialBasesSelected({});
};
