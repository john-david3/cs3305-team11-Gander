import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { useFollow } from "../hooks/useFollow";
import FollowUserButton from "../components/Input/FollowUserButton";

interface Streamer {
  user_id: number;
  username: string;
}

interface Category {
  category_id: number;
  category_name: string;
}

interface FollowingProps {
  extraClasses?: string;
}

const Following: React.FC<FollowingProps> = ({ extraClasses = "" }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [followedStreamers, setFollowedStreamers] = useState<Streamer[]>([]);
  const [followedCategories, setFollowedCategories] = useState<Category[]>([]);
  const [followingStatus, setFollowingStatus] = useState<{ [key: number]: boolean }>({});

  const { checkFollowStatus, followUser, unfollowUser } = useFollow();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") === "streamers" ? "streamers" : "categories";

  const [activeTab, setActiveTab] = useState<"categories" | "streamers">(initialTab);
  //const [followingStatus, setFollowingStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const newTab = queryParams.get("tab") as "categories" | "streamers";
    if (newTab) {
      setActiveTab(newTab);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchFollowedContent = async () => {
      try {
        const response = await fetch("/api/user/following");
        if (!response.ok) throw new Error("Failed to fetch followed content");

        const data = await response.json();
        if (!Array.isArray(data.streams) || !Array.isArray(data.categories)) {
          throw new Error("API response structure is incorrect");
        }

        setFollowedStreamers(data.streams);
        setFollowedCategories(data.categories);

        // Fetch follow status for streamers
        const updatedStatus: { [key: number]: boolean } = {};
        for (const streamer of data.streams) {
          const status = await checkFollowStatus(streamer.username);
          updatedStatus[streamer.user_id] = Boolean(status);
        }
        setFollowingStatus(updatedStatus);
      } catch (error) {
        console.error("Error fetching followed content:", error);
        setFollowedStreamers([]);
        setFollowedCategories([]);
      }
    };

    if (isLoggedIn) {
      fetchFollowedContent();
    }
  }, [isLoggedIn]);

  return (
    <DynamicPageContent>
      <div
        id="sidebar"
        className={`top-0 left-0 w-screen h-screen overflow-x-hidden flex flex-col bg-[var(--sideBar-bg)] text-[var(--sideBar-text)] text-center overflow-y-auto scrollbar-hide transition-all duration-500 ease-in-out ${extraClasses}`}
      >
        {activeTab === "streamers" && (
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
        )}
      </div>
  


    </DynamicPageContent >
  );
};

export default Following;
