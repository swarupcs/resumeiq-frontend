import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/config/axiosConfig';
import { setCredentials, selectIsAuthenticated } from '@/features/authSlice';
import type { ApiResponse, User } from '@/types';

export const useSessionRestore = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasFired = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || hasFired.current) return;
    hasFired.current = true;

    const restore = async () => {
      try {
        const { data } = await axiosInstance.get('/user/me');
        const res = data as ApiResponse<{ user: User }>;
        if (res.data?.user) {
          dispatch(setCredentials({
            success: true, statusCode: 200,
            message: 'Session restored', data: { user: res.data.user },
          }));
        }
      } catch {
        // 401 handled by axios interceptor — clears Redux + redirects
      }
    };
    void restore();
  }, [isAuthenticated, dispatch]);
};
