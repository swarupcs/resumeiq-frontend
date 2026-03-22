import {
  enhanceProfessionalSummaryApi,
  enhanceJobDescriptionApi,
  uploadResumeApi,
  importFromLinkedInApi,
  generateCoverLetterApi,
  analyzeATSApi,
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

  importFromLinkedIn: async ({ linkedInText, title }) => {
    try {
      const { data } = await importFromLinkedInApi({ linkedInText, title });
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to import LinkedIn profile');
    }
  },

  generateCoverLetter: async ({ resumeId, jobDescription }) => {
    try {
      const { data } = await generateCoverLetterApi({ resumeId, jobDescription });
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to generate cover letter');
    }
  },

  // ATS keyword analysis
  analyzeATS: async ({ resumeData, jobDescription }) => {
    try {
      const { data } = await analyzeATSApi({
        resumeData: JSON.stringify(resumeData),
        jobDescription,
      });
      return data;
    } catch (error) {
      throw handleApiError(error, 'Failed to analyse ATS compatibility');
    }
  },
};
