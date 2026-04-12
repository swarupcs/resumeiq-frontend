import axiosInstance from '@/config/axiosConfig';
import type {
  CoverLetterPayload,
  UploadResumePayload,
  ImportLinkedInPayload,
} from '@/types';

export const enhanceProfessionalSummaryApi = (userContent: string) =>
  axiosInstance.post('/ai/enhance-pro-sum', { userContent });

export const enhanceJobDescriptionApi = (userContent: string) =>
  axiosInstance.post('/ai/enhance-job-desc', { userContent });

export const uploadResumeApi = (data: UploadResumePayload) =>
  axiosInstance.post('/ai/upload-resume', data);

export const importFromLinkedInApi = (data: ImportLinkedInPayload) =>
  axiosInstance.post('/ai/import-linkedin', data);

export const generateCoverLetterApi = (data: CoverLetterPayload) =>
  axiosInstance.post('/ai/cover-letter', data);

export const analyzeATSApi = (data: {
  resumeData: string;
  jobDescription: string;
}) => axiosInstance.post('/ai/ats-analysis', data);
