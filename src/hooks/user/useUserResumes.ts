import { useQuery, useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import { setCredentials } from '@/features/authSlice';
import type { UpdateProfilePayload } from '@/api/user';

export const useUserResumes = () =>
  useQuery({
    queryKey: ['userResume'],
    queryFn: userService.getUserResumes,
  });

export const useUpdateProfile = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateProfile(payload),
    onSuccess: (data) => {
      if (data.data?.user) {
        dispatch(setCredentials({
          success: true, statusCode: 200,
          message: 'Profile updated', data: { user: data.data.user },
        }));
      }
      toast.success('Profile updated successfully');
    },
    onError: () => toast.error('Failed to update profile'),
  });
};
