// Store Cashier Details in Redux using Token
import { cashierDetails } from "../API/ongoingOrder";

export const checkLogin = (dispatch) => {
  const tokenDetailsString = localStorage.getItem("token");
  console.log("tokenDetailsString from UserStore : ", tokenDetailsString);

  cashierDetails(tokenDetailsString)
    .then((res) => {
      dispatch({
        type: "LOGGD_IN_USER",
        payload: {
          token: tokenDetailsString,
          code: res.data.data.code,
          userName: res.data.data.userName,
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          mobileNumber: res.data.data.mobileNumber,
          email: res.data.data.email,
          isActive: res.data.data.isActive,
          firebaseId: res.data.data.firebaseId,
          profilePhoto: res.data.data.profilePhoto,
        },
      });
    })
    .catch((err) => {
      console.log("Cashier Details Error", err);
    });
};
