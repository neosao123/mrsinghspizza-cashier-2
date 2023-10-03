export const getSpecialDetails = (
  data,
  getSpecialDetailsApi,
  setGetSpecialData
) => {
  getSpecialDetailsApi(data)
    .then((res) => {
      setGetSpecialData(res.data.data);
    })
    .catch((err) => {
      console.log("ERROR From Dips API: ", err);
    });
};

export const getSpecialDataCall = () => {};
