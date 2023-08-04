// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // if (state.cart.length > 0) {
      //   state.cart = [...state.cart, action.payload];
      // } else {
      //   state.cart = [action.payload];
      // }
      console.log(state.cart, "newww");
      state.cart = action.payload;
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
