// useForgotPassword.js
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (emailId) => authService.forgotPassword(emailId),
  });
};
