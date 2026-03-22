import {
  enhanceProfessionalSummaryApi,
  enhanceJobDescriptionApi,
  uploadResumeApi,
  importFromLinkedInApi,
  generateCoverLetterApi,
} from '@/api/ai.js';
import handleApiError from '@/lib/handleApiError.js';

export const aiService = {
  enhanceProfessionalSummary: async (userContent) => {
    try {
      const { data } = await enhanceProfessionalSummaryApi(userContent);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to enhance professional summary');
    }
  },

  enhanceJobDescription: async (userContent) => {
    try {
      const { data } = await enhanceJobDescriptionApi(userContent);
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to enhance job description');
    }
  },

  uploadResume: async ({ resumeText, title }) => {
    try {
      const { data } = await uploadResumeApi({ resumeText, title });
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to upload resume');
    }
  },

  // Phase 5 — Feature 1: LinkedIn import
  importFromLinkedIn: async ({ linkedInText, title }) => {
    try {
      const { data } = await importFromLinkedInApi({ linkedInText, title });
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to import LinkedIn profile');
    }
  },

  // Phase 5 — Feature 4: Cover letter generator
  generateCoverLetter: async ({ resumeId, jobDescription }) => {
    try {
      const { data } = await generateCoverLetterApi({ resumeId, jobDescription });
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to generate cover letter');
    }
  },
};
