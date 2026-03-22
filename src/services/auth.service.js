import { toast } from 'sonner';
import {
  signinApi, signupApi, logoutApi,
  verifyEmailApi, resendVerificationApi,
  forgotPasswordApi, resetPasswordApi,
} from '../api/auth.js';
import handleApiError from '../lib/handleApiError.js';

export const authService = {
  signup: async (userData) => {
    try {
      const { data } = await signupApi(userData);
      toast.success('Account created! Please check your email to verify.');
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

  logout: async () => {
    try {
      await logoutApi();
    } catch {
      // Swallow — local state still clears
    }
  },

  verifyEmail: async (token) => {
    try {
      const { data } = await verifyEmailApi(token);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Email verification failed');
    }
  },

  resendVerification: async (emailId) => {
    try {
      const { data } = await resendVerificationApi(emailId);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to resend verification email');
    }
  },

  forgotPassword: async (emailId) => {
    try {
      const { data } = await forgotPasswordApi(emailId);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to send reset email');
    }
  },

  resetPassword: async (token, password) => {
    try {
      const { data } = await resetPasswordApi(token, password);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to reset password');
    }
  },
};
