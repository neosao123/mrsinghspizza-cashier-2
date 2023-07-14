import axios from "axios";
import { privateAPi } from "./apiFunction";

const token = localStorage.getItem("token");
console.log("token from ongoing API Function: ", token);

// Get Cashier Details using Token
export const cashierDetails = async (authToken) => {
  return await axios.get(`cashier/detailsByToken?token=${authToken}`, {
    headers: {
      Authorization: token ? "Bearer " + authToken : "",
    },
  });
};

// Get Pizza Requirements
export const allIngredientsApi = async () => {
  return await privateAPi.get("/getAllIngredients");
};

// Get Pizza Requirements
export const sidesApi = async () => {
  return await privateAPi.get("/sides");
};

// Get Special Pizza Requirements
export const specialPizzaApi = async () => {
  return await privateAPi.get("/getSpecials");
};

// Get Special Pizza Requirements
export const getSpecialDetailsApi = async (payload) => {
  return await privateAPi.post("/getSpecialDetails", payload);
};

// Toppings Data
export const toppingsApi = async () => {
  return await privateAPi.get("/toppings");
};

// Dips Data
export const dipsApi = async () => {
  return await privateAPi.get("/dips");
};

// SoftDrinks Data
export const softDrinksApi = async () => {
  return await privateAPi.get("/softdrinks");
};
