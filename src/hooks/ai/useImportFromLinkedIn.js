// useImportFromLinkedIn.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '@/services/ai.service.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useImportFromLinkedIn = () => {
  const queryClient = useQueryClient();
  const navigate    = useNavigate();

  return useMutation({
    mutationFn: aiService.importFromLinkedIn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userResume'] });
      toast.success('LinkedIn profile imported successfully');
      navigate(`/app/builder/${data.data.resumeId}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to import LinkedIn profile');
    },
  });
};
