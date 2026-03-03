// src/hooks/resume/useResumeById.js
import { useQuery } from '@tanstack/react-query';
import { resumeService } from '@/services/resume.service.js';

export const useResumeById = (resumeId, options = {}) => {
  return useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => resumeService.getResumeById(resumeId),
    enabled: !!resumeId,
    // staleTime: 1000 * 60 * 5,
    ...options,
  });
};
