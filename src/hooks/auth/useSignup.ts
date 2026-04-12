import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { authService } from '@/services/auth.service';
import { setCredentials } from '@/features/authSlice';
import type { SignupPayload } from '@/types';

export const useSignup = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (userData: SignupPayload) => authService.signup(userData),
    onSuccess: (data) => { dispatch(setCredentials(data)); },
  });
};
