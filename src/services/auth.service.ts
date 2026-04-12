import { toast } from 'sonner';
import {
  signinApi,
  signupApi,
  logoutApi,
  verifyEmailApi,
  resendVerificationApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '@/api/auth';
import handleApiError from '@/lib/handleApiError';
import type { SignupPayload, SigninPayload, ApiResponse, User } from '@/types';

export const authService = {
  signup: async (
    userData: SignupPayload,
  ): Promise<ApiResponse<{ user: User }>> => {
    try {
      const { data } = await signupApi(userData);
      toast.success('Account created! Please check your email to verify.');
      return data as ApiResponse<{ user: User }>;
    } catch (error) {
      return handleApiError(error, 'Signup failed');
    }
  },

  signin: async (
    userData: SigninPayload,
  ): Promise<ApiResponse<{ user: User }>> => {
    try {
      const { data } = await signinApi(userData);
      return data as ApiResponse<{ user: User }>;
    } catch (error) {
      return handleApiError(error, 'Signin failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await logoutApi();
    } catch {
      /* swallow */
    }
  },

  verifyEmail: async (token: string): Promise<ApiResponse<null>> => {
    try {
      const { data } = await verifyEmailApi(token);
      return data as ApiResponse<null>;
    } catch (error) {
      return handleApiError(error, 'Email verification failed');
    }
  },

  resendVerification: async (emailId: string): Promise<ApiResponse<null>> => {
    try {
      const { data } = await resendVerificationApi(emailId);
      return data as ApiResponse<null>;
    } catch (error) {
      return handleApiError(error, 'Failed to resend verification email');
    }
  },

  forgotPassword: async (emailId: string): Promise<ApiResponse<null>> => {
    try {
      const { data } = await forgotPasswordApi(emailId);
      return data as ApiResponse<null>;
    } catch (error) {
      return handleApiError(error, 'Failed to send reset email');
    }
  },

  resetPassword: async (
    token: string,
    password: string,
  ): Promise<ApiResponse<null>> => {
    try {
      const { data } = await resetPasswordApi(token, password);
      return data as ApiResponse<null>;
    } catch (error) {
      return handleApiError(error, 'Failed to reset password');
    }
  },
};
