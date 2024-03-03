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
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "/users/login",
        method: "POST",
        body: { username, password },
      }),
    }),
    register: builder.mutation({
      query: ({ username, firstname, lastname, password }) => ({
        url: "/users/register",
        method: "POST",
        body: { username, firstname, lastname, password },
      }),
    }),
    update: builder.mutation({
      query: (body) => ({
        url: "/users",
        method: "PUT",
        body: body,
      }),
    }),
  }),
});

export const {
  useGetProfileMutation,
  useLoginMutation,
  useRegisterMutation,
  useUpdateMutation,
} = userApi;
