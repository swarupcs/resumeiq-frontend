import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { aiService } from '@/services/ai.service';
import type {
  ATSAnalysisPayload,
  CoverLetterPayload,
  UploadResumePayload,
  ImportLinkedInPayload,
} from '@/types';

export const useEnhanceProfessionalSummary = () =>
  useMutation({
    mutationFn: (userContent: string) =>
      aiService.enhanceProfessionalSummary(userContent),
    onError: () => toast.error('Failed to enhance professional summary'),
  });

export const useEnhanceJobDescription = () =>
  useMutation({
    mutationFn: (userContent: string) =>
      aiService.enhanceJobDescription(userContent),
    onError: () => toast.error('Failed to enhance job description'),
  });

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadResumePayload) =>
      aiService.uploadResume(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['userResume'] });
      toast.success('Resume uploaded successfully');
    },
    onError: () => toast.error('Failed to upload resume'),
  });
};

export const useImportFromLinkedIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: ImportLinkedInPayload) =>
      aiService.importFromLinkedIn(payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['userResume'] });
      toast.success('LinkedIn profile imported successfully');
      if (data.data?.resumeId) navigate(`/app/builder/${data.data.resumeId}`);
    },
    onError: () => toast.error('Failed to import LinkedIn profile'),
  });
};

export const useGenerateCoverLetter = () =>
  useMutation({
    mutationFn: (payload: CoverLetterPayload) =>
      aiService.generateCoverLetter(payload),
    onError: () => toast.error('Failed to generate cover letter'),
  });

export const useATSAnalysis = () =>
  useMutation({
    mutationFn: (payload: ATSAnalysisPayload) => aiService.analyzeATS(payload),
    onError: () => toast.error('Failed to analyse ATS compatibility'),
  });
