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
      query: ({ username, firstname, lastname, password, admincode }) => ({
        url: "/users/register",
        method: "POST",
        body: { username, firstname, lastname, password, admincode },
      }),
    }),
    update: builder.mutation({
      query: (body) => ({
        url: "/users",
        method: "PUT",
        body: body,
      }),
    }),
    contact: builder.mutation({
      query: (body) => ({
        url: "/users/contactme",
        method: "POST",
        body: body,
      }),
    }),
    getMessages: builder.query({
      query: () => "/users/messageAll",
    }),
    deleteMessage: builder.mutation({
      query: (message_id) => ({
        url: "/users/deleteMessage",
        method: "PUT",
        body: { message_id },
      }),
    }),
  }),
});

export const {
  useGetProfileMutation,
  useLoginMutation,
  useRegisterMutation,
  useUpdateMutation,
  useContactMutation,
  useLazyGetMessagesQuery,
  useDeleteMessageMutation,
} = userApi;
