import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { authService } from '@/services/auth.service';
import { setCredentials } from '@/features/authSlice';
import type { SigninPayload } from '@/types';

export const useSignin = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (userData: SigninPayload) => authService.signin(userData),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
  });
};
