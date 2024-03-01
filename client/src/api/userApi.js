import api from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.mutation({
      query: ({ user_id }) => ({
        url: "/users/profile",
        method: "POST",
        body: { user_id },
      }),
    }),
  }),
});

export const { useGetProfileMutation } = userApi;
