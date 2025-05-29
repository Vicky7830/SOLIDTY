import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  top100_CoinsList: [],
};

export const TopCoinsSlice = createSlice({
  name: "topcoins",
  initialState,
  reducers: {
    setTokenList: (state, actions) => {
      state.top100_CoinsList = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTokenList } = TopCoinsSlice.actions;

export default TopCoinsSlice.reducer;
