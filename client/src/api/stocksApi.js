import api from "./api";

export const stocksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllStocks: builder.query({
      query: () => "stocks/",
    }),
    follow: builder.mutation({
      query: (stock_id) => ({
        url: "stocks/follow",
        method: "POST",
        body: { stock_id },
      }),
    }),
    unfollow: builder.mutation({
      query: (stock_id) => ({
        url: "stocks/unfollow",
        method: "DELETE",
        body: { stock_id },
      }),
    }),
    upvote: builder.mutation({
      query: (stock_id) => ({
        url: "stocks/upvote",
        method: "POST",
        body: { stock_id },
      }),
    }),
    downvote: builder.mutation({
      query: (stock_id) => ({
        url: "stocks/downvote",
        method: "POST",
        body: { stock_id },
      }),
    }),
  }),
});

export const {
  useGetAllStocksQuery,
  useFollowMutation,
  useUnfollowMutation,
  useUpvoteMutation,
  useDownvoteMutation,
} = stocksApi;
