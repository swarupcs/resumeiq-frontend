import {
  getUserResumesApi,
  updateProfileApi,
  type UpdateProfilePayload,
} from '@/api/user';
import handleApiError from '@/lib/handleApiError';
import type { ResumeListItem, ApiResponse, User } from '@/types';

export const userService = {
  getUserResumes: async (): Promise<ResumeListItem[]> => {
    try {
      return (await getUserResumesApi()) as ResumeListItem[];
    } catch (error) {
      return handleApiError(error, 'Failed to get user resumes');
    }
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<ApiResponse<{ user: User }>> => {
    try {
      const { data } = await updateProfileApi(payload);
      return data as ApiResponse<{ user: User }>;
    } catch (error) {
      return handleApiError(error, 'Failed to update profile');
    }
  },
};
