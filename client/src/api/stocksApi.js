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
    editcomment: builder.mutation({
      query: ({ comment_id, message }) => ({
        url: "stocks/editcomment",
        method: "PUT",
        body: { comment_id, message },
      }),
    }),
    addcomment: builder.mutation({
      query: ({ comment_id, message }) => ({
        url: "stocks/addcomment",
        method: "POST",
        body: { comment_id, message },
      }),
    }),
    removecomment: builder.mutation({
      query: (comment_id) => ({
        url: "stocks/removecomment",
        method: "PUT",
        body: { comment_id },
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
  useEditcommentMutation,
  useAddcommentMutation,
  useRemovecommentMutation,
} = stocksApi;
