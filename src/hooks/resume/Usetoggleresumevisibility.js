import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services/resume.service.js';
import { toast } from 'sonner';

export const useToggleResumeVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId) => resumeService.toggleResumeVisibility(resumeId),
    onSuccess: (data, resumeId) => {
      // Invalidate so any other consumers of this resume stay in sync
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      toast.success(
        data.resume.isPublic ? 'Resume is now public' : 'Resume is now private',
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to toggle visibility');
    },
  });
};
