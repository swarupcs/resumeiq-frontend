import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services/resume.service.js';
import { toast } from 'sonner';

// Phase 2 — Fix 4: Visibility cache fix.
//
// Previous bug: only ['resume', resumeId] was invalidated after toggling.
// The dashboard's ResumeCard badge (Public/Private) is driven by the
// ['userResume'] query — it was never invalidated, so the badge stayed stale
// until the user manually refreshed the page.
//
// Fix: invalidate both query keys so the builder AND the dashboard both
// reflect the new visibility state immediately.

export const useToggleResumeVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId) => resumeService.toggleResumeVisibility(resumeId),
    onSuccess: (data, resumeId) => {
      // Invalidate the individual resume query (used in ResumeBuilder)
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });

      // Also invalidate the dashboard list so the Public/Private badge
      // updates without a page refresh
      queryClient.invalidateQueries({ queryKey: ['userResume'] });

      toast.success(
        data.data.resume.isPublic
          ? 'Resume is now public'
          : 'Resume is now private'
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to toggle visibility');
    },
  });
};
