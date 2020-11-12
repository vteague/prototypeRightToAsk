import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "ui",
  initialState: {
    loading: true,
    success: false,
    errorContent: null,
    initialFetchMade: false,
  },
  reducers: {
    startLoading: (state, action) => {
      state.loading = true;
    },
    endLoading: (state, action) => {
      state.loading = false;
    },
    success: (state, action) => {
      state.success = true;
      state.error = false;
      state.errorContent = null;
    },
    resetSuccess: (state, action) => {
      state.success = false;
      state.errorContent = null;
    },
    setError: (state, action) => {
      state.errorContent = action.payload.errorContent;
    },
    fetchData: (state, action) => {
      state.initialFetchMade = true;
    },
  },
});

export default slice.reducer;
export const {
  startLoading,
  endLoading,
  success,
  resetSuccess,
  setError,
  fetchData,
} = slice.actions;
