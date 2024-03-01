import { configureStore } from "@reduxjs/toolkit";
import stocksSliceReducer from "./stocksSlice";
import api from "./api";

export const store = configureStore({
  reducer: {
    stocks: stocksSliceReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
