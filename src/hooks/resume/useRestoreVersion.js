import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services/resume.service.js';
import { toast } from 'sonner';

export const useRestoreVersion = (resumeId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (versionIndex) => resumeService.restoreVersion(resumeId, versionIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      toast.success('Version restored successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to restore version');
    },
  });
};
