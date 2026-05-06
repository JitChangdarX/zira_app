import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    removeinfo: () => initialState,
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setError, removeinfo } = userSlice.actions;
export default userSlice.reducer;
