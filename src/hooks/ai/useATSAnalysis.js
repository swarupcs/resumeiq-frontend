import { useMutation } from '@tanstack/react-query';
import { aiService } from '@/services/ai.service.js';
import { toast } from 'sonner';

// ATS analysis hook.
// mutationFn receives { resumeData, jobDescription }.
// Returns the full analysis object on success.
export const useATSAnalysis = () => {
  return useMutation({
    mutationFn: aiService.analyzeATS,
    onError: (error) => {
      toast.error(error.message || 'Failed to analyse ATS compatibility');
    },
  });
};
