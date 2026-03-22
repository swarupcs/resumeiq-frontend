import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { logout } from '@/features/authSlice.js';

// FIX: Logout now calls the backend first (to clear the httpOnly cookie),
// then dispatches the Redux logout action (which also clears redux-persist storage).
// Previously only the Redux action was dispatched — the cookie stayed alive for 7 days,
// meaning all authenticated API endpoints would still accept requests.
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      // Always clear local state regardless of network outcome
      dispatch(logout());
      navigate('/');
    },
  });
};
