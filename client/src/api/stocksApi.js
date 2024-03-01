import api from "./api";

export const stocksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllStocks: builder.query({
      query: () => "stocks/",
    }),
  }),
});

export const { useGetAllStocksQuery } = stocksApi;
