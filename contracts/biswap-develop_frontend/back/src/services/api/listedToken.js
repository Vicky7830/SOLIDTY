// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const { VITE_BASE_URL } = import.meta.env;

// Define a service using a base URL and expected endpoints
export const listedToken = createApi({
  reducerPath: "listedTokenApi",
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_BASE_URL,
  }),
  endpoints: (builder) => ({
    getListedTokendetails: builder.mutation({
      query: () => ({
        url: `listedToken`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetListedTokendetailsMutation } = listedToken;
