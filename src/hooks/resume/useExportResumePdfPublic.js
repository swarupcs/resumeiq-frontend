import { useMutation } from '@tanstack/react-query';
import { resumeService } from '@/services/resume.service.js';
import { toast } from 'sonner';

// Used on the public preview/shared link page — only works for public resumes
export const useExportResumePdfPublic = () => {
  return useMutation({
    mutationFn: ({ resumeId, fullName }) =>
      resumeService.exportResumePdfPublic(resumeId, fullName),
    onMutate: () => {
      toast.loading('Generating PDF...', { id: 'pdf-export' });
    },
    onSuccess: () => {
      toast.success('PDF downloaded successfully!', { id: 'pdf-export' });
    },
    onError: (error) => {
      toast.error('Failed to generate PDF. Try again.', { id: 'pdf-export' });
    },
  });
};