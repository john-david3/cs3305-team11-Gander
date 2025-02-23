import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useCategoryFollow() {
  const [isCategoryFollowing, setIsCategoryFollowing] = useState<boolean>(false);
  const { isLoggedIn } = useAuth();

  const checkCategoryFollowStatus = async (categoryName: string) => {
    try {
      const response = await fetch(`/api/user/category/following/${categoryName}`);
      const data = await response.json();
      setIsCategoryFollowing(data.following);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const followCategory = async (categoryName: number) => {
    if (!isLoggedIn) {
      return;
    }
    
    try {
      const response = await fetch(`/api/user/category/follow/${categoryName}`);
      const data = await response.json();
      if (data.success) {
        console.log(`Now following category ${categoryName}`);
        setIsCategoryFollowing(true);
      } else {
        console.error(`Failed to follow category ${categoryName}`);
      }
    } catch (error) {
      console.error("Error following category:", error);
    }
  };

  const unfollowCategory = async (categoryName: number) => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const response = await fetch(`/api/user/category/unfollow/${categoryName}`);
      const data = await response.json();
      if (data.success) {
        console.log(`Unfollowed category ${categoryName}`);
        setIsCategoryFollowing(false);
      } else {
        console.error(`Failed to unfollow category ${categoryName}`);
      }
    } catch (error) {
      console.error("Error unfollowing category:", error);
    }
  };

  return {
    isCategoryFollowing,
    setIsCategoryFollowing,
    checkCategoryFollowStatus,
    followCategory,
    unfollowCategory
  };
}
