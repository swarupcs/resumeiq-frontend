import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/config/axiosConfig.js';
import { setCredentials, logout, selectIsAuthenticated } from '@/features/authSlice.js';

// Phase 2 — Fix 2: Session restore.
//
// Problem: Auth state is persisted in localStorage via redux-persist. If the
// httpOnly cookie expires or is cleared server-side (e.g. after a logout from
// another tab), the frontend still shows the user as logged in until they make
// a protected API call and get a 401 back.
//
// Solution: On app boot, call GET /user/me once. If the cookie is valid, refresh
// Redux with up-to-date server data (name, email may have changed). If the cookie
// is invalid/expired, the 401 interceptor in axiosConfig clears Redux and redirects
// to /login — so we don't need to handle that case here.
//
// Why not in App.jsx directly?
// Keeping it in a hook keeps App.jsx clean and makes the restore logic testable.
//
// The hook only runs when isAuthenticated is true in Redux — no point calling
// /user/me if we have no local session at all.

export const useSessionRestore = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasFired = useRef(false);

  useEffect(() => {
    // Only run once per mount, and only if Redux thinks we're logged in
    if (!isAuthenticated || hasFired.current) return;
    hasFired.current = true;

    const restore = async () => {
      try {
        const { data } = await axiosInstance.get('/user/me');
        // Refresh Redux with the latest user data from the server.
        // This handles cases where the user's name/email changed in another session.
        dispatch(
          setCredentials({
            success: true,
            statusCode: 200,
            message: 'Session restored',
            data: { user: data.data.user },
          })
        );
      } catch {
        // 401 is handled by the axios interceptor (clears Redux + redirects).
        // Any other error (network down, 500) — stay logged in, don't disrupt the user.
      }
    };

    restore();
  }, [isAuthenticated, dispatch]);
};
