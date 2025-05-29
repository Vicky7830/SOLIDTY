import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listedTokens: {},
};

export const listedTokensSlice = createSlice({
  name: "listedTokens",
  initialState,
  reducers: {
    setListedTokens: (state, actions) => {
      state.listedTokens = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setListedTokens } = listedTokensSlice.actions;

export default listedTokensSlice.reducer;
