import axios from 'axios';
import store from '@/app/store.js';
import { logout } from '@/features/authSlice.js';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// FIX: 401 interceptor is now active.
// Previously it was commented out with `window.location.href = '/login'` which
// would also bypass Redux entirely. Now we dispatch `logout()` through the store
// so redux-persist clears stored auth state before the navigation happens.
// A flag prevents infinite loops if the /auth/logout call itself returns 401.
let isHandling401 = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? '';

    // Don't intercept auth endpoints — they handle their own errors
    const isAuthEndpoint =
      url.includes('/auth/signin') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/logout');

    if (status === 401 && !isAuthEndpoint && !isHandling401) {
      isHandling401 = true;

      try {
        // Best-effort cookie clear — don't block on failure
        await axiosInstance.post('/auth/logout').catch(() => {});
      } finally {
        store.dispatch(logout());
        isHandling401 = false;
        // Navigate to login without a full page reload so React Router handles it
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
