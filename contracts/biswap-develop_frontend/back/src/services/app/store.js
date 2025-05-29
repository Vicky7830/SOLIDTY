import { configureStore } from "@reduxjs/toolkit";
import TopCoinsSlice from "../slice/topCoinsSlice";
import { tokenListing } from "../api/tokenListing";
import { listedToken } from "../api/listedToken";
import listedTokenSlice from "../slice/listedTokenSlice";

export const store = configureStore({
  reducer: {
    TopCoinsSlice,
    listedTokenSlice,
    [tokenListing.reducerPath]: tokenListing.reducer,
    [listedToken.reducerPath]: listedToken.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(tokenListing.middleware)
      .concat(listedToken.middleware),
});
