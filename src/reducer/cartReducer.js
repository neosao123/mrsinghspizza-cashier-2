// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  displaySpecialForm: false,
  printRef: null,
  orderDetail: null,
  editRef: null,
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart = action.payload;
    },
    setDisplaySpecialForm: (state, action) => {
      state.displaySpecialForm = action.payload;
    },
    setPrintRef: (state, action) => {
      state.printRef = action.payload;
    },
    setEditRef: (state, action) => {
      state.editRef = action.payload;
    },
    setOrderDetail: (state, action) => {
      state.orderDetail = action.payload;
    },
  },
});

export const {
  addToCart,
  setOrderDetail,
  setEditRef,
  setPrintRef,
  setDisplaySpecialForm,
} = cartSlice.actions;

export default cartSlice.reducer;
