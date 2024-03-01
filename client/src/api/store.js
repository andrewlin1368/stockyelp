import { configureStore } from "@reduxjs/toolkit";
import stocksSliceReducer from "./stocksSlice";
import api from "./api";
import userSliceReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    stocks: stocksSliceReducer,
    user: userSliceReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
