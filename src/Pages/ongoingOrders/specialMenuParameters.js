export const specialMenuParamsFn = (
  handlePops,
  e,
  pop,
  updateInCart,
  setDrinksArr,
  drinksArr
) => {
  return {
    handlePops: {
      callback: handlePops,
      parameters: {
        e: e,
        pop: pop,
        updateInCart: updateInCart,
        setDrinksArr: setDrinksArr,
        drinksArr: drinksArr,
      },
    },
  };
};
