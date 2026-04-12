import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export const useForgotPassword = () =>
  useMutation({ mutationFn: (emailId: string) => authService.forgotPassword(emailId) });

export const useResetPassword = () =>
  useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
  });
