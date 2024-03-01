import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "./userApi";

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: null,
    following: [],
    comments: [],
    profile: null,
    token: null,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getProfile.matchFulfilled,
      (state, { payload }) => {
        console.log(payload);
        state.profile = payload.profile;
      }
    );
  },
});

export default userSlice.reducer;
