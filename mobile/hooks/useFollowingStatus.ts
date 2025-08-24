import { useMemo } from "react";
import { useCurrentUser } from "./useCurrenUser";

export const useFollowingStatus = (targetUserId: string | undefined) => {
  const { currentUser } = useCurrentUser();

  const isFollowing = useMemo(() => {
    if (!currentUser || !targetUserId) return false;
    return currentUser.following?.includes(targetUserId) || false;
  }, [currentUser, targetUserId]);

  const canFollow = useMemo(() => {
    if (!currentUser || !targetUserId) return false;
    return currentUser._id !== targetUserId;
  }, [currentUser, targetUserId]);

  return {
    isFollowing,
    canFollow,
    currentUser,
  };
};
