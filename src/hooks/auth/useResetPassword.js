import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }) => authService.resetPassword(token, password),
  });
};
