import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services/resume.service.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Phase 3 — Feature 1: Duplicate resume.
// Creates a server-side copy of the resume, invalidates the dashboard list,
// and navigates directly to the new duplicate so the user can start editing.
export const useDuplicateResume = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (resumeId) => resumeService.duplicateResume(resumeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userResume'] });
      toast.success('Resume duplicated successfully');
      // Navigate to the new duplicate so the user can start editing immediately
      navigate(`/app/builder/${data.data.resume._id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to duplicate resume');
    },
  });
};
