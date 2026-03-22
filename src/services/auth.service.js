import { toast } from "sonner";
import { signinApi, signupApi, logoutApi } from "../api/auth.js";
import handleApiError from "../lib/handleApiError.js";

export const authService = {
  signup: async (userData) => {
    try {
      const { data } = await signupApi(userData);
      toast.success('Account created successfully!');
      return data;
    } catch (error) {
      throw handleApiError(error, 'Signup failed');
    }
  },

  signin: async (userData) => {
    try {
      const { data } = await signinApi(userData);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Signin failed');
    }
  },

  // FIX: Calls backend to expire the httpOnly cookie before clearing Redux state.
  // Errors are swallowed intentionally — if the network is down we still want
  // the local session cleared so the user isn't stuck.
  logout: async () => {
    try {
      await logoutApi();
    } catch {
      // Silently continue — local state will still be cleared by the caller
    }
  },
};
