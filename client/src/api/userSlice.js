import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "./userApi";
import { stocksApi } from "./stocksApi";

const setUser = (state, { payload }) => {
  state.user = payload.profile.user;
  state.following = payload.profile.following;
  state.comments = payload.profile.comments;
  state.token = payload.profile.token;
  state.error = null;
  const data = {};
  for (let stock of payload.profile.following) data[stock.stock_id] = true;
  state.extra_following = data;
  window.sessionStorage.setItem(
    "USER",
    JSON.stringify({
      user: payload.profile.user,
      token: payload.profile.token,
      comments: payload.profile.comments,
      following: payload.profile.following,
      extra_following: data,
    })
  );
};

const setError = (state, { payload }) => {
  state.error = payload.data.error;
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: window.sessionStorage.getItem("USER")
      ? JSON.parse(window.sessionStorage.getItem("USER")).user
      : null,
    following: window.sessionStorage.getItem("USER")
      ? JSON.parse(window.sessionStorage.getItem("USER")).following
      : [],
    extra_following: window.sessionStorage.getItem("USER")
      ? JSON.parse(window.sessionStorage.getItem("USER")).extra_following
      : {},
    comments: window.sessionStorage.getItem("USER")
      ? JSON.parse(window.sessionStorage.getItem("USER")).comments
      : [],
    profile: null,
    token: window.sessionStorage.getItem("USER")
      ? JSON.parse(window.sessionStorage.getItem("USER")).token
      : null,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.following = [];
      state.comments = [];
      state.profile = null;
      state.token = null;
      state.error = null;
      state.extra_following = {};
      window.sessionStorage.removeItem("USER");
    },
    removeProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getProfile.matchFulfilled,
      (state, { payload }) => {
        state.profile = payload.profile;
      }
    );
    builder.addMatcher(userApi.endpoints.login.matchFulfilled, setUser);
    builder.addMatcher(userApi.endpoints.register.matchFulfilled, setUser);
    builder.addMatcher(userApi.endpoints.login.matchRejected, setError);
    builder.addMatcher(userApi.endpoints.register.matchRejected, setError);
    builder.addMatcher(
      userApi.endpoints.update.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.error = null;
      }
    );
    builder.addMatcher(userApi.endpoints.update.matchRejected, setError);
    builder.addMatcher(
      stocksApi.endpoints.follow.matchFulfilled,
      (state, { payload }) => {
        state.following.push(payload);
        const following = Object.assign([], state.following);
        state.following = following;
        const extra_following = {
          ...state.extra_following,
          [payload.stock_id]: true,
        };
        state.extra_following = extra_following;
        const data = JSON.parse(window.sessionStorage.getItem("USER"));
        data.extra_following[payload.stock_id] = true;
        data.following.push(payload);
        window.sessionStorage.setItem("USER", JSON.stringify(data));
      }
    );
    builder.addMatcher(
      stocksApi.endpoints.unfollow.matchFulfilled,
      (state, { payload }) => {
        state.following = state.following.filter(
          (stock) => stock.stock_id !== payload.stock_id
        );
        state.extra_following = {
          ...state.extra_following,
          [payload.stock_id]: false,
        };
        const data = JSON.parse(window.sessionStorage.getItem("USER"));
        data.extra_following[payload.stock_id] = false;
        data.following = data.following.filter(
          (stock) => stock.stock_id !== payload.stock_id
        );
        window.sessionStorage.setItem("USER", JSON.stringify(data));
      }
    );
  },
});

export const { logoutUser, removeProfile } = userSlice.actions;
export default userSlice.reducer;
