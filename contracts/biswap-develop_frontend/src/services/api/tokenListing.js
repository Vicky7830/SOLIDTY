// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const { VITE_COIN_GECO } = import.meta.env;

// Define a service using a base URL and expected endpoints
export const tokenListing = createApi({
  reducerPath: "tokenListingApi",
  baseQuery: fetchBaseQuery({ baseUrl: VITE_COIN_GECO }),
  endpoints: (builder) => ({
    getTopTokenList: builder.mutation({
      query: () => ({
        url: `?vs_currency=usd&order=market_cap_desc&per_page=100&page=1`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTopTokenListMutation } = tokenListing;
