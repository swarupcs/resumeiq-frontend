import axiosInstance from "../config/axiosConfig.js";

export const signupApi = (userData) => axiosInstance.post('/auth/signup', userData);
export const signinApi = (userData) => axiosInstance.post('/auth/signin', userData);

// FIX: Logout now calls the backend to clear the httpOnly cookie server-side.
// Previously only Redux state was cleared — the cookie stayed alive for 7 days.
export const logoutApi = () => axiosInstance.post('/auth/logout');
