export const handlePops = ({
  e,
  pop,
  updateInCart,
  setDrinksArr,
  drinksArr,
}) => {
  let { checked } = e.target;
  let drinksObj = {
    drinksCode: pop.code,
    drinksName: pop.softDrinkName,
    drinksPrice: pop.price ? pop.price : "0",
    quantity: 1,
    totalPrice: Number(0).toFixed(2),
  };
  if (checked) {
    updateInCart({ drinksArray: [drinksObj] });
    setDrinksArr([drinksObj]);
  } else {
    let filteredPops = drinksArr?.filter(
      (item) => item.drinksCode !== pop.code
    );
    updateInCart({ drinksArray: filteredPops });

    setDrinksArr(filteredPops);
  }
};
