import axiosInstance from '@/config/axiosConfig';
import type { SignupPayload, SigninPayload } from '@/types';

export const signupApi = (userData: SignupPayload) =>
  axiosInstance.post('/auth/signup', userData);

export const signinApi = (userData: SigninPayload) =>
  axiosInstance.post('/auth/signin', userData);

export const logoutApi = () =>
  axiosInstance.post('/auth/logout');

export const verifyEmailApi = (token: string) =>
  axiosInstance.get(`/auth/verify-email/${token}`);

export const resendVerificationApi = (emailId: string) =>
  axiosInstance.post('/auth/resend-verification', { emailId });

export const forgotPasswordApi = (emailId: string) =>
  axiosInstance.post('/auth/forgot-password', { emailId });

export const resetPasswordApi = (token: string, password: string) =>
  axiosInstance.post(`/auth/reset-password/${token}`, { password });
