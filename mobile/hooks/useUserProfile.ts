import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, useApiClient } from "@/utils/api";
import { User, Post } from "@/types";

export const useUserProfile = (username: string) => {
  const api = useApiClient();

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => userApi.getUserProfile(api, username),
    enabled: !!username,
    select: (response) => ({
      user: response.data.user as User,
      posts: response.data.posts as Post[],
    }),
  });

  return {
    user: profileData?.user || null,
    posts: profileData?.posts || [],
    isLoading,
    error,
    refetch,
  };
};

export const useFollowUser = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (targetUserId: string) => userApi.followUser(api, targetUserId),
    onSuccess: (_, targetUserId) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      
      // Optimistically update the current user's following list
      queryClient.setQueryData(["authUser"], (oldData: any) => {
        if (oldData?.data?.user) {
          const currentUser = oldData.data.user;
          const isFollowing = currentUser.following?.includes(targetUserId);
          
          if (isFollowing) {
            // Remove from following
            return {
              ...oldData,
              data: {
                ...oldData.data,
                user: {
                  ...currentUser,
                  following: currentUser.following?.filter((id: string) => id !== targetUserId) || [],
                },
              },
            };
          } else {
            // Add to following
            return {
              ...oldData,
              data: {
                ...oldData.data,
                user: {
                  ...currentUser,
                  following: [...(currentUser.following || []), targetUserId],
                },
              },
            };
          }
        }
        return oldData;
      });
    },
  });

  return mutation;
};
