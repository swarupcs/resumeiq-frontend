import axiosInstance from '../config/axiosConfig.js';

export const signupApi  = (userData) => axiosInstance.post('/auth/signup', userData);
export const signinApi  = (userData) => axiosInstance.post('/auth/signin', userData);
export const logoutApi  = ()         => axiosInstance.post('/auth/logout');

// Email verification
export const verifyEmailApi          = (token)  => axiosInstance.get(`/auth/verify-email/${token}`);
export const resendVerificationApi   = (emailId) => axiosInstance.post('/auth/resend-verification', { emailId });

// Forgot / reset password
export const forgotPasswordApi = (emailId) => axiosInstance.post('/auth/forgot-password', { emailId });
export const resetPasswordApi  = (token, password) =>
  axiosInstance.post(`/auth/reset-password/${token}`, { password });
