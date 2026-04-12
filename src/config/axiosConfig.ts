import axios, { type InternalAxiosRequestConfig } from 'axios';
import store from '@/app/store';
import { logout, setCredentials } from '@/features/authSlice';
import type { User } from '@/types';

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (v: unknown) => void;
  reject: (e: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: unknown = null): void => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as RetryableRequest | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? '';

    const isAuthEndpoint =
      url.includes('/auth/signin') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/logout') ||
      url.includes('/auth/refresh');

    if (status === 401 && !isAuthEndpoint && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then(() => originalRequest && axiosInstance(originalRequest))
          .catch((err: unknown) => Promise.reject(err));
      }

      if (originalRequest) originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post('/auth/refresh');
        store.dispatch(
          setCredentials({
            success: true,
            statusCode: 200,
            message: 'Tokens refreshed',
            data: {
              user: (data as { data: { user: User } }).data.user,
            },
          }),
        );
        processQueue(null);
        isRefreshing = false;
        return originalRequest && axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
