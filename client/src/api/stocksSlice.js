import { createSlice } from "@reduxjs/toolkit";
import { stocksApi } from "./stocksApi";

const stocksSlice = createSlice({
  name: "stocksSlice",
  initialState: {
    stocks: [],
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      stocksApi.endpoints.getAllStocks.matchFulfilled,
      (state, { payload }) => {
        state.stocks = payload.stocks;
      }
    );
  },
});

export default stocksSlice.reducer;
