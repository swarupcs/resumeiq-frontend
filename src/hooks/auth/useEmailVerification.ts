import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export const useVerifyEmail = () =>
  useMutation({ mutationFn: (token: string) => authService.verifyEmail(token) });

export const useResendVerification = () =>
  useMutation({ mutationFn: (emailId: string) => authService.resendVerification(emailId) });
