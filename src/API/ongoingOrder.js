import axios from "axios";
import { privateAPi } from "./privateapis";
import { publicApi } from "./publicapis";

import AxiosPrivate from "./AxiosPrivate";
// Get Cashier Details using Token
export const cashierDetails = async (authToken) => {
  return await publicApi.get(`/cashier/detailsByToken?token=${authToken}`);
};

// Get Pizza Requirements
export const allIngredientsApi = async () => {
  return await AxiosPrivate.sendGetApi("/getAllIngredients", {});
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

// Add To Cart
export const addToCartApi = async (payload) => {
  return await privateAPi.post("/cart/add", payload);
};

// Add To Cart
export const storeLocationApi = async () => {
  return await privateAPi.get("/storelocation");
};
