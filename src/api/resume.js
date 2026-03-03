import axiosInstance from '@/config/axiosConfig.js';
import { publicAxios } from '@/config/publicAxios.js';

export const getResumeByIdApi = (resumeId) =>
  axiosInstance.get(`/resume/${resumeId}`);
export const getPublicResumeByIdApi = (resumeId) =>
  publicAxios.get(`/resume/public/${resumeId}`); // ✅ no cookies
export const createResumeApi = (data) =>
  axiosInstance.post('/resume/create', data);
export const updateResumeApi = (formData) =>
  axiosInstance.patch('/resume/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteResumeApi = (resumeId) =>
  axiosInstance.delete(`/resume/${resumeId}`);

export const updateResumeTitleApi = (id, title) =>
  axiosInstance.patch(`/resume/${id}/title`, { title });
export const toggleResumeVisibilityApi = (id) =>
  axiosInstance.patch(`/resume/${id}/visibility`);

// Switch from GET to POST so we can send resumeData in the body.

export const exportResumePdfApi = (resumeId, resumeData) =>
  axiosInstance.post(
    `/resume/${resumeId}/export-pdf`,
    { resumeData: JSON.stringify(resumeData) },
    { responseType: 'blob' }
  );

export const exportResumePdfPublicApi = (resumeId) =>
  axiosInstance.get(`/resume/${resumeId}/export-pdf/public`, {
    responseType: 'blob',
  });