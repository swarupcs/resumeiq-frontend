import axiosInstance from '@/config/axiosConfig.js';

export const enhanceProfessionalSummaryApi = (userContent) =>
  axiosInstance.post('/ai/enhance-pro-sum', { userContent });

export const enhanceJobDescriptionApi = (userContent) =>
  axiosInstance.post('/ai/enhance-job-desc', { userContent });

export const uploadResumeApi = (data) =>
  axiosInstance.post('/ai/upload-resume', data);

export const importFromLinkedInApi = (data) =>
  axiosInstance.post('/ai/import-linkedin', data);

export const generateCoverLetterApi = (data) =>
  axiosInstance.post('/ai/cover-letter', data);

// ATS keyword analysis
export const analyzeATSApi = (data) =>
  axiosInstance.post('/ai/ats-analysis', data);
