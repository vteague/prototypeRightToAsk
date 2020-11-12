import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "user",
  initialState: {
    userName: null,
    MP: false,
    verificationPending: false,
    hasAccount: false,
  },
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload.userName;
    },
    registrationSuccessful: (state, action) => {
      state.hasAccount = true;
    },
    verificationPending: (state, action) => {
      state.verificationPending = true;
    },
    verify: (state, action) => {
      state.verificationPending = false;
      state.MP = true;
    },
    checkUserAccount: (state, action) => {
      console.log("checkUserAccount");
      state.userName = action.payload.userName;
      state.hasAccount = true;
    },
    deleteAccount: (state, action) => {
      state.userName = null;
      state.MP = false;
      state.verificationPending = false;
      state.hasAccount = false;
    },
  },
});

export default slice.reducer;
export const {
  setUserName,
  startRegistration,
  endRegistration,
  registrationSuccessful,
  verificationPending,
  verify,
  checkUserAccount,
  deleteAccount,
} = slice.actions;
