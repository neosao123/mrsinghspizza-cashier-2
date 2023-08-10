export const getSpecialDetails = (
  data,
  getSpecialDetailsApi,
  setGetSpecialData,
  calculatePrice
) => {
  getSpecialDetailsApi(data)
    .then((res) => {
      console.log(res.data.data, "api res special");
      setGetSpecialData(res.data.data);
      // calculatePrice();
    })
    .catch((err) => {
      console.log("ERROR From Dips API: ", err);
    });
};

export const getSpecialDataCall = () => {};
