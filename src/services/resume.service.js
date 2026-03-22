import {
  getResumeByIdApi,
  getPublicResumeByIdApi,
  createResumeApi,
  updateResumeApi,
  deleteResumeApi,
  updateResumeTitleApi,
  toggleResumeVisibilityApi,
  exportResumePdfApi,
  exportResumePdfPublicApi,
  duplicateResumeApi,
} from '@/api/resume.js';
import handleApiError from '@/lib/handleApiError.js';

export const resumeService = {
  getResumeById: async (resumeId) => {
    try {
      const { data } = await getResumeByIdApi(resumeId);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch resume');
    }
  },

  getPublicResumeById: async (resumeId) => {
    try {
      const { data } = await getPublicResumeByIdApi(resumeId);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch public resume');
    }
  },

  createResume: async (title) => {
    try {
      const { data } = await createResumeApi({ title });
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to create resume');
    }
  },

  updateResume: async ({ resumeId, resumeData, image, removeBackground }) => {
    try {
      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify(resumeData));
      if (image) formData.append('image', image);
      if (removeBackground) formData.append('removeBackground', 'true');
      const { data } = await updateResumeApi(formData);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to update resume');
    }
  },

  deleteResume: async (resumeId) => {
    try {
      const { data } = await deleteResumeApi(resumeId);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to delete resume');
    }
  },

  updateResumeTitle: async (id, title) => {
    try {
      const { data } = await updateResumeTitleApi(id, title);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to update title');
    }
  },

  toggleResumeVisibility: async (id) => {
    try {
      const { data } = await toggleResumeVisibilityApi(id);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to toggle visibility');
    }
  },

  exportResumePdf: async (resumeId, fullName, resumeData) => {
    try {
      const { data } = await exportResumePdfApi(resumeId, resumeData);
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fullName ?? 'Resume'}_Resume.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      throw handleApiError(error, 'Failed to export PDF');
    }
  },

  exportResumePdfPublic: async (resumeId, fullName) => {
    try {
      const { data } = await exportResumePdfPublicApi(resumeId);
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fullName ?? 'Resume'}_Resume.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      throw handleApiError(error, 'Failed to export PDF');
    }
  },

  // Phase 3 — Feature 1: Duplicate resume
  duplicateResume: async (resumeId) => {
    try {
      const { data } = await duplicateResumeApi(resumeId);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to duplicate resume');
    }
  },
};
