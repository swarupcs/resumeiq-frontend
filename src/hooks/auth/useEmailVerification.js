import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token) => authService.verifyEmail(token),
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (emailId) => authService.resendVerification(emailId),
  });
};
