import {
  enhanceProfessionalSummaryApi,
  enhanceJobDescriptionApi,
  uploadResumeApi,
  importFromLinkedInApi,
  generateCoverLetterApi,
  analyzeATSApi,
} from '@/api/ai';
import handleApiError from '@/lib/handleApiError';
import type {
  ApiResponse,
  ATSAnalysis,
  ATSAnalysisPayload,
  CoverLetterPayload,
  UploadResumePayload,
  ImportLinkedInPayload,
} from '@/types';

export const aiService = {
  enhanceProfessionalSummary: async (
    userContent: string,
  ): Promise<ApiResponse<{ enhancedContent: string }>> => {
    try {
      const { data } = await enhanceProfessionalSummaryApi(userContent);
      return data as ApiResponse<{ enhancedContent: string }>;
    } catch (error) {
      return handleApiError(error, 'Failed to enhance summary');
    }
  },

  enhanceJobDescription: async (
    userContent: string,
  ): Promise<ApiResponse<{ enhancedContent: string }>> => {
    try {
      const { data } = await enhanceJobDescriptionApi(userContent);
      return data as ApiResponse<{ enhancedContent: string }>;
    } catch (error) {
      return handleApiError(error, 'Failed to enhance job description');
    }
  },

  uploadResume: async (
    payload: UploadResumePayload,
  ): Promise<ApiResponse<{ resumeId: string }>> => {
    try {
      const { data } = await uploadResumeApi(payload);
      return data as ApiResponse<{ resumeId: string }>;
    } catch (error) {
      return handleApiError(error, 'Failed to upload resume');
    }
  },

  importFromLinkedIn: async (
    payload: ImportLinkedInPayload,
  ): Promise<ApiResponse<{ resumeId: string }>> => {
    try {
      const { data } = await importFromLinkedInApi(payload);
      return data as ApiResponse<{ resumeId: string }>;
    } catch (error) {
      return handleApiError(error, 'Failed to import LinkedIn profile');
    }
  },

  generateCoverLetter: async (
    payload: CoverLetterPayload,
  ): Promise<ApiResponse<{ coverLetter: string }>> => {
    try {
      const { data } = await generateCoverLetterApi(payload);
      return data as ApiResponse<{ coverLetter: string }>;
    } catch (error) {
      return handleApiError(error, 'Failed to generate cover letter');
    }
  },

  analyzeATS: async ({
    resumeData,
    jobDescription,
  }: ATSAnalysisPayload): Promise<ApiResponse<{ analysis: ATSAnalysis }>> => {
    try {
      const { data } = await analyzeATSApi({
        resumeData: JSON.stringify(resumeData),
        jobDescription,
      });
      return data as ApiResponse<{ analysis: ATSAnalysis }>;
    } catch (error) {
      return handleApiError(error, 'Failed to analyse ATS compatibility');
    }
  },
};
