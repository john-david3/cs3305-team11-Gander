import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { useFollow } from "../hooks/useFollow";
import { useAuthModal } from "../hooks/useAuthModal";
import FollowUserButton from "../components/Input/FollowUserButton";

interface Streamer {
  user_id: number;
  username: string;
}

interface FollowingStreamerProps {
  extraClasses?: string;
}

const FollowUsers: React.FC<FollowingStreamerProps> = ({ extraClasses = "" }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [followedStreamers, setFollowedStreamers] = useState<Streamer[]>([]);
  const [followingStatus, setFollowingStatus] = useState<{ [key: number]: boolean }>({}); // Store follow status for each streamer

  const { isFollowing, checkFollowStatus, followUser, unfollowUser } =
    useFollow();

  useEffect(() => {
    const fetchFollowedStreamers = async () => {
      try {
        const response = await fetch("/api/user/following");
        if (!response.ok) throw new Error("Failed to fetch followed streamers");
        const data = await response.json();
        setFollowedStreamers(data);

        const updatedStatus: { [key: number]: boolean } = {};
        for (const streamer of data || []) {
          const status = await checkFollowStatus(streamer.username);
          updatedStatus[streamer.user_id] = Boolean(status);
        }
        setFollowingStatus(updatedStatus);

        console.log("Fetched Follow Status:", updatedStatus); // Log the status
      } catch (error) {
        console.error("Error fetching followed streamers:", error);
      }
    };

    if (isLoggedIn) {
      fetchFollowedStreamers();
    }
  }, [isLoggedIn]);


  const handleFollowToggle = async (userId: number) => {
    const isCurrentlyFollowing = followingStatus[userId];

    if (isCurrentlyFollowing) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }

    // Update local state for this specific streamer
    setFollowingStatus((prev) => ({
      ...prev,
      [userId]: !isCurrentlyFollowing, // Toggle based on previous state
    }));
  };

  return (
    <DynamicPageContent>
      <div
        id="sidebar"    
        className={`top-0 left-0 w-screen h-screen overflow-x-hidden flex flex-col bg-[var(--sideBar-bg)] text-[var(--sideBar-text)] text-center overflow-y-auto scrollbar-hide transition-all duration-500 ease-in-out ${extraClasses}`}
      >
        <div
          id="followed-users"
          className={`grid grid-cols-2 gap-4 p-4 w-full`}>
          {followedStreamers.map((streamer: any) => (
            <div
              key={`streamer-${streamer.username}`}
              className="cursor-pointer bg-black w-full py-2 border border-[--text-color] rounded-lg text-white hover:text-purple-500 font-bold transition-colors"
            /*onClick={() => navigate(`/user/${streamer.username}`)}*/
            >
              {streamer.username}
              <FollowUserButton
                user={{
                  user_id: streamer.user_id,
                  username: streamer.username,
                  isFollowing: followingStatus[streamer.user_id] || true,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </DynamicPageContent>
  );
};

export default FollowUsers;