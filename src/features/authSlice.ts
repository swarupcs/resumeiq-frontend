import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, RootState } from '../types';

interface SetCredentialsPayload {
  success: boolean;
  statusCode: number;
  message: string;
  data: { user: User } | null;
}

const initialState: AuthState = {
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
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { success, statusCode, message, data } = action.payload;
      state.success = success;
      state.statusCode = statusCode;
      state.message = message;
      state.user = data?.user ?? null;
      state.isAuthenticated = success && !!data?.user;
    },
    logout: () => initialState,
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state: RootState): User | null =>
  state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;
export const selectAuthMessage = (state: RootState): string | null =>
  state.auth.message;

export default authSlice.reducer;
