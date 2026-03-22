import axios from 'axios';
import store from '@/app/store.js';
import { logout, setCredentials } from '@/features/authSlice.js';

const axiosInstance = axios.create({
  baseURL:         import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers:         { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error)  => Promise.reject(error)
);

// Phase 5 — Feature 2: Refresh token rotation.
// When any non-auth request returns 401:
//   1. Call POST /auth/refresh (which reads the refresh token cookie server-side)
//   2. If refresh succeeds → update Redux with new user data + retry original request
//   3. If refresh fails (refresh token also expired) → dispatch logout() + redirect
//
// isRefreshing flag prevents multiple concurrent requests from each triggering
// their own refresh call — they all queue behind the single in-flight refresh.

let isRefreshing  = false;
let refreshQueue  = []; // { resolve, reject }

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status          = error.response?.status;
    const url             = originalRequest?.url ?? '';

    const isAuthEndpoint =
      url.includes('/auth/signin')  ||
      url.includes('/auth/signup')  ||
      url.includes('/auth/logout')  ||
      url.includes('/auth/refresh');

    // Only intercept 401s from non-auth endpoints that haven't been retried yet
    if (status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      if (isRefreshing) {
        // Another request already kicked off a refresh — queue behind it
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post('/auth/refresh');

        // Refresh succeeded — update Redux with fresh user data
        store.dispatch(
          setCredentials({
            success:    true,
            statusCode: 200,
            message:    'Tokens refreshed',
            data:       { user: data.data.user },
          })
        );

        processQueue(null);
        isRefreshing = false;

        // Retry the original failed request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token also expired — full logout
        processQueue(refreshError);
        isRefreshing = false;

        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
