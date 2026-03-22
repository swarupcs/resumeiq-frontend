import axiosInstance from '@/config/axiosConfig.js';

export const enhanceProfessionalSummaryApi = (userContent) =>
  axiosInstance.post('/ai/enhance-pro-sum', { userContent });

export const enhanceJobDescriptionApi = (userContent) =>
  axiosInstance.post('/ai/enhance-job-desc', { userContent });

export const uploadResumeApi = (data) =>
  axiosInstance.post('/ai/upload-resume', data);

// Phase 5 — Feature 1: LinkedIn import
export const importFromLinkedInApi = (data) =>
  axiosInstance.post('/ai/import-linkedin', data);

// Phase 5 — Feature 4: Cover letter generator
export const generateCoverLetterApi = (data) =>
  axiosInstance.post('/ai/cover-letter', data);
