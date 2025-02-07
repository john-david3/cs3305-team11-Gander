import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useFollow() {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const { isLoggedIn } = useAuth();

  const checkFollowStatus = async (username: string) => {
    try {
      const response = await fetch(`/api/user/following/${username}`);
      const data = await response.json();
      setIsFollowing(data.following);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const followUser = async (userId: number, setShowAuthModal?: (show: boolean) => void) => {
    if (!isLoggedIn) {
      setShowAuthModal?.(true);
      return;
    }
    
    try {
      const response = await fetch(`/api/user/follow/${userId}`);
      const data = await response.json();
      if (data.success) {
        console.log(`Now following user ${userId}`);
        setIsFollowing(true);
      } else {
        console.error(`Failed to follow user ${userId}`);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async (userId: number, setShowAuthModal?: (show: boolean) => void) => {
    if (!isLoggedIn) {
      setShowAuthModal?.(true);
      return;
    }

    try {
      const response = await fetch(`/api/user/unfollow/${userId}`);
      const data = await response.json();
      if (data.success) {
        console.log(`Unfollowed user ${userId}`);
        setIsFollowing(false);
      } else {
        console.error(`Failed to unfollow user ${userId}`);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return {
    isFollowing,
    setIsFollowing,
    checkFollowStatus,
    followUser,
    unfollowUser
  };
}
