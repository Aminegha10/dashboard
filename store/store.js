import { configureStore } from "@reduxjs/toolkit";
import { DataApi } from "../features/dataApi";

export const store = configureStore({
  reducer: {
    [DataApi.reducerPath]: DataApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(DataApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});
