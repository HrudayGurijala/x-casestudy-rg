import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { useCurrentUser } from "./useCurrenUser";

export const useProfileData = () => {
  const api = useApiClient();
  const { currentUser, isLoading: isCurrentUserLoading, refetch: refetchCurrentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profileData"],
    queryFn: async () => {
      if (!currentUser?.username) return null;
      const response = await userApi.getUserProfile(api, currentUser.username);
      return response.data;
    },
    enabled: !!currentUser?.username,
  });

  const refetchAll = async () => {
    await Promise.all([
      refetchCurrentUser(),
      refetchProfile(),
      queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
    ]);
  };

  return {
    currentUser,
    profileData,
    isLoading: isCurrentUserLoading || isProfileLoading,
    refetchAll,
    refetchCurrentUser,
    refetchProfile,
  };
};
