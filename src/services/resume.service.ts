import {
  getResumeByIdApi, getPublicResumeByIdApi, createResumeApi, updateResumeApi,
  deleteResumeApi, updateResumeTitleApi, toggleResumeVisibilityApi,
  exportResumePdfApi, exportResumePdfPublicApi, duplicateResumeApi, restoreVersionApi,
} from '@/api/resume';
import handleApiError from '@/lib/handleApiError';
import type { ApiResponse, ResumeData, ResumeListItem, UpdateResumePayload } from '@/types';

export const resumeService = {
  getResumeById: async (resumeId: string): Promise<ApiResponse<{ resume: ResumeData }>> => {
    try {
      const { data } = await getResumeByIdApi(resumeId);
      return data as ApiResponse<{ resume: ResumeData }>;
    } catch (error) { return handleApiError(error, 'Failed to fetch resume'); }
  },

  getPublicResumeById: async (resumeId: string): Promise<ApiResponse<{ resume: ResumeData }>> => {
    try {
      const { data } = await getPublicResumeByIdApi(resumeId);
      return data as ApiResponse<{ resume: ResumeData }>;
    } catch (error) { return handleApiError(error, 'Failed to fetch public resume'); }
  },

  createResume: async (title: string): Promise<ApiResponse<{ resume: ResumeListItem }>> => {
    try {
      const { data } = await createResumeApi({ title });
      return data as ApiResponse<{ resume: ResumeListItem }>;
    } catch (error) { return handleApiError(error, 'Failed to create resume'); }
  },

  updateResume: async ({ resumeId, resumeData, image, removeBackground }: UpdateResumePayload): Promise<ApiResponse<{ resume: ResumeData }>> => {
    try {
      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify(resumeData));
      if (image) formData.append('image', image);
      if (removeBackground) formData.append('removeBackground', 'true');
      const { data } = await updateResumeApi(formData);
      return data as ApiResponse<{ resume: ResumeData }>;
    } catch (error) { return handleApiError(error, 'Failed to update resume'); }
  },

  deleteResume: async (resumeId: string): Promise<ApiResponse<null>> => {
    try {
      const { data } = await deleteResumeApi(resumeId);
      return data as ApiResponse<null>;
    } catch (error) { return handleApiError(error, 'Failed to delete resume'); }
  },

  updateResumeTitle: async (id: string, title: string): Promise<ApiResponse<{ resume: ResumeListItem }>> => {
    try {
      const { data } = await updateResumeTitleApi(id, title);
      return data as ApiResponse<{ resume: ResumeListItem }>;
    } catch (error) { return handleApiError(error, 'Failed to update title'); }
  },

  toggleResumeVisibility: async (id: string): Promise<ApiResponse<{ resume: ResumeListItem }>> => {
    try {
      const { data } = await toggleResumeVisibilityApi(id);
      return data as ApiResponse<{ resume: ResumeListItem }>;
    } catch (error) { return handleApiError(error, 'Failed to toggle visibility'); }
  },

  exportResumePdf: async (resumeId: string, fullName: string, resumeData: ResumeData): Promise<void> => {
    try {
      const { data } = await exportResumePdfApi(resumeId, resumeData);
      const url = URL.createObjectURL(data as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fullName ?? 'Resume'}_Resume.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) { return handleApiError(error, 'Failed to export PDF'); }
  },

  exportResumePdfPublic: async (resumeId: string, fullName: string): Promise<void> => {
    try {
      const { data } = await exportResumePdfPublicApi(resumeId);
      const url = URL.createObjectURL(data as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fullName ?? 'Resume'}_Resume.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) { return handleApiError(error, 'Failed to export PDF'); }
  },

  duplicateResume: async (resumeId: string): Promise<ApiResponse<{ resume: ResumeListItem }>> => {
    try {
      const { data } = await duplicateResumeApi(resumeId);
      return data as ApiResponse<{ resume: ResumeListItem }>;
    } catch (error) { return handleApiError(error, 'Failed to duplicate resume'); }
  },

  restoreVersion: async (resumeId: string, versionIndex: number): Promise<ApiResponse<{ resume: ResumeData }>> => {
    try {
      const { data } = await restoreVersionApi(resumeId, versionIndex);
      return data as ApiResponse<{ resume: ResumeData }>;
    } catch (error) { return handleApiError(error, 'Failed to restore version'); }
  },
};
