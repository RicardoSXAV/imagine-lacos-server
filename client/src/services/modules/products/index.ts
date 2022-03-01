import { createApi } from "@reduxjs/toolkit/query/react";
import { apiBaseQuery } from "../../api";
import { Product } from "./types";

export const productApi = createApi({
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
