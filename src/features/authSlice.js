import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  success: false,
  statusCode: null,
  message: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { success, statusCode, message, data } = action.payload;
      state.success = success;
      state.statusCode = statusCode;
      state.message = message;
      state.user = data?.user || null;
      state.isAuthenticated = success && !!data?.user;
    },
    logout: () => initialState, // ✅ returns initialState directly, also clears persist
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthMessage = (state) => state.auth.message;

export default authSlice.reducer;
