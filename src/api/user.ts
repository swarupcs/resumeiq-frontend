import axiosInstance from '@/config/axiosConfig';

export const getUserResumesApi = async () => {
  const res = await axiosInstance.get('/user/resumes');
  return (res.data as { data: { resumes: unknown[] } }).data.resumes;
};

export const getMeApi = () => axiosInstance.get('/user/me');

export const getProfileApi = () => axiosInstance.get('/user/profile');

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const updateProfileApi = (payload: UpdateProfilePayload) =>
  axiosInstance.patch('/user/profile', payload);
