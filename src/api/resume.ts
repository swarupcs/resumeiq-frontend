import axiosInstance from '@/config/axiosConfig';
import { publicAxios } from '@/config/publicAxios';
import type { ResumeData } from '@/types';

export const getResumeByIdApi = (resumeId: string) =>
  axiosInstance.get(`/resume/${resumeId}`);

export const getPublicResumeByIdApi = (resumeId: string) =>
  publicAxios.get(`/resume/public/${resumeId}`);

export const createResumeApi = (data: { title: string }) =>
  axiosInstance.post('/resume/create', data);

export const updateResumeApi = (formData: FormData) =>
  axiosInstance.patch('/resume/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteResumeApi = (resumeId: string) =>
  axiosInstance.delete(`/resume/${resumeId}`);

export const updateResumeTitleApi = (id: string, title: string) =>
  axiosInstance.patch(`/resume/${id}/title`, { title });

export const toggleResumeVisibilityApi = (id: string) =>
  axiosInstance.patch(`/resume/${id}/visibility`);

export const exportResumePdfApi = (resumeId: string, resumeData: ResumeData) =>
  axiosInstance.post(
    `/resume/${resumeId}/export-pdf`,
    { resumeData: JSON.stringify(resumeData) },
    { responseType: 'blob' }
  );

export const exportResumePdfPublicApi = (resumeId: string) =>
  axiosInstance.get(`/resume/${resumeId}/export-pdf/public`, { responseType: 'blob' });

export const duplicateResumeApi = (resumeId: string) =>
  axiosInstance.post(`/resume/${resumeId}/duplicate`);

export const restoreVersionApi = (resumeId: string, versionIndex: number) =>
  axiosInstance.post(`/resume/${resumeId}/restore/${versionIndex}`);
