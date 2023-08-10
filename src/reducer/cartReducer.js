// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  displaySpecialForm: false,
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log(state.cart, "newww");
      state.cart = action.payload;
    },
    setDisplaySpecialForm: (state, action) => {
      state.displaySpecialForm = action.payload;
    },
  },
});

export const { addToCart, setDisplaySpecialForm } = cartSlice.actions;
export default cartSlice.reducer;
