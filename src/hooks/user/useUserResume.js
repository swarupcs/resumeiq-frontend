import { userService } from "@/services/user.service.js";
import { useQuery } from "@tanstack/react-query";


export const useUserResume = () => {
    return useQuery({
      queryKey: ['userResume'],
      queryFn: userService.getUserResumes,
      // staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

