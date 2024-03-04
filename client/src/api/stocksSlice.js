import { createSlice } from "@reduxjs/toolkit";
import { stocksApi } from "./stocksApi";

const updateStock = (state, { payload }) => {
  const stocks = Object.assign([], state.stocks);
  state.stocks = stocks.map((stock) => {
    return stock.stock_id === payload.stock_id
      ? { ...stock, upvotes: payload.upvotes, downvotes: payload.downvotes }
      : stock;
  });
};

const updateComments = (state, { payload }) => {
  const stocks = Object.assign([], state.stocks);
  stocks[payload.stock_id - 1].comments = stocks[
    payload.stock_id - 1
  ].comments.map((comment) => {
    return comment.comment_id === payload.comment_id ? payload : comment;
  });
  state.stocks = stocks;
};

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
    builder.addMatcher(stocksApi.endpoints.upvote.matchFulfilled, updateStock);
    builder.addMatcher(
      stocksApi.endpoints.downvote.matchFulfilled,
      updateStock
    );
    builder.addMatcher(
      stocksApi.endpoints.addcomment.matchFulfilled,
      (state, { payload }) => {
        const stocks = Object.assign([], state.stocks);
        stocks[payload.stock_id - 1].comments.unshift(payload);
        state.stocks = stocks;
      }
    );
    builder.addMatcher(
      stocksApi.endpoints.editcomment.matchFulfilled,
      updateComments
    );
    builder.addMatcher(
      stocksApi.endpoints.removecomment.matchFulfilled,
      updateComments
    );
    builder.addMatcher(
      stocksApi.endpoints.addstock.matchFulfilled,
      (state, { payload }) => {
        const stocks = Object.assign([], state.stocks);
        stocks.push(payload);
        state.stocks = stocks;
      }
    );
  },
});

export default stocksSlice.reducer;
