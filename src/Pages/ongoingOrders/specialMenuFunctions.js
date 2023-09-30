export const handlePops = ({ e, pop, setDrinksArr, drinksArr }) => {
  let { checked } = e.target;
  let drinksObj = {
    drinksCode: pop.code,
    drinksName: pop.softDrinkName,
    drinksPrice: pop.price ? pop.price : "0",
    quantity: 1,
    totalPrice: Number(0).toFixed(2),
  };
  if (checked) {
    setDrinksArr([drinksObj]);
  } else {
    let filteredPops = drinksArr?.filter(
      (item) => item.drinksCode !== pop.code
    );
    setDrinksArr(filteredPops);
  }
};
