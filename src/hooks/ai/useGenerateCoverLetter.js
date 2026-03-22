import { useMutation } from '@tanstack/react-query';
import { aiService } from '@/services/ai.service.js';
import { toast } from 'sonner';

export const useGenerateCoverLetter = () => {
  return useMutation({
    mutationFn: aiService.generateCoverLetter,
    onError: (error) => {
      toast.error(error.message || 'Failed to generate cover letter');
    },
  });
};
