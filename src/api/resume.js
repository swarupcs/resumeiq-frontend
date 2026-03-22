import axiosInstance from '@/config/axiosConfig.js';
import { publicAxios } from '@/config/publicAxios.js';

export const getResumeByIdApi       = (resumeId) => axiosInstance.get(`/resume/${resumeId}`);
export const getPublicResumeByIdApi  = (resumeId) => publicAxios.get(`/resume/public/${resumeId}`);
export const createResumeApi         = (data)     => axiosInstance.post('/resume/create', data);
export const updateResumeApi         = (formData) =>
  axiosInstance.patch('/resume/update', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteResumeApi         = (resumeId) => axiosInstance.delete(`/resume/${resumeId}`);
export const updateResumeTitleApi    = (id, title)=> axiosInstance.patch(`/resume/${id}/title`, { title });
export const toggleResumeVisibilityApi = (id)     => axiosInstance.patch(`/resume/${id}/visibility`);
export const exportResumePdfApi      = (resumeId, resumeData) =>
  axiosInstance.post(`/resume/${resumeId}/export-pdf`, { resumeData: JSON.stringify(resumeData) }, { responseType: 'blob' });
export const exportResumePdfPublicApi = (resumeId) =>
  axiosInstance.get(`/resume/${resumeId}/export-pdf/public`, { responseType: 'blob' });
export const duplicateResumeApi      = (resumeId) => axiosInstance.post(`/resume/${resumeId}/duplicate`);

// Phase 5 — Feature 5: Restore a version snapshot
export const restoreVersionApi = (resumeId, versionIndex) =>
  axiosInstance.post(`/resume/${resumeId}/restore/${versionIndex}`);
