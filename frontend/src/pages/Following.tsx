import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import { ToggleButton } from "../components/Input/Button";
import { Sidebar as SidebarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { CategoryType } from "../types/CategoryType";

// Define TypeScript interfaces
interface Streamer {
  user_id: number;
  username: string;
}

interface FollowingProps {
  extraClasses?: string;
}

const Following: React.FC<FollowingProps> = ({ extraClasses = "" }) => {
  const { showSideBar, setShowSideBar } = useSidebar();
  const navigate = useNavigate();
  const { username, isLoggedIn } = useAuth();
  const [followedStreamers, setFollowedStreamers] = useState<Streamer[]>([]);

  // Fetch followed streamers
  useEffect(() => {
    const fetchFollowedStreamers = async () => {
      try {
        const response = await fetch("/api/user/following");
        if (!response.ok) throw new Error("Failed to fetch followed streamers");
        const data = await response.json();
        setFollowedStreamers(data.streamers || []);
      } catch (error) {
        console.error("Error fetching followed streamers:", error);
      }
    };

    if (isLoggedIn) {
      fetchFollowedStreamers();
    }
  }, [isLoggedIn]);

  // Handle sidebar toggle
  const handleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <ToggleButton
        onClick={handleSideBar}
        extraClasses={`absolute group text-[1rem] top-[9vh] ${
          showSideBar
            ? "left-[16vw] duration-[0.5s]"
            : "left-[20px] duration-[1s]"
        } ease-in-out cursor-pointer z-[50]`}
        toggled={showSideBar}
      >
        <SidebarIcon className="h-[2vw] w-[2vw]" />

        {showSideBar && (
          <small className="absolute flex items-center top-0 ml-4 left-0 h-full w-full my-auto group-hover:left-full opacity-0 group-hover:opacity-100 text-white transition-all delay-200">
            Press S
          </small>
        )}
      </ToggleButton>

      {/* Sidebar Container */}
      <div
        id="sidebar"
        className={`top-0 left-0 w-screen h-screen overflow-x-hidden flex flex-col bg-[var(--sideBar-bg)] text-[var(--sideBar-text)] text-center overflow-y-auto scrollbar-hide
        transition-all duration-500 ease-in-out ${
          showSideBar ? "translate-x-0" : "-translate-x-full"
        } ${extraClasses}`}
      >
        {/* Profile Info */}
        <div className="flex flex-row items-center border-b-4 border-[var(--profile-border)] justify-evenly bg-[var(--sideBar-profile-bg)] py-[1em]">
          <img
            src="/images/monkey.png"
            alt="profile picture"
            className="w-[3em] h-[3em] rounded-full border-[0.15em] border-purple-500 cursor-pointer"
            onClick={() => navigate(`/user/${username}`)}
          />
          <div className="text-center flex flex-col items-center justify-center">
            <h5 className="font-thin text-[0.85rem] cursor-default text-[var(--sideBar-profile-text)]">
              Logged in as
            </h5>
            <button
              className="font-black text-[1.4rem] hover:underline"
              onClick={() => navigate(`/user/${username}`)}
            >
              <div className="text-[var(--sideBar-profile-text)]">
                {username}
              </div>
            </button>
          </div>
        </div>

        {/* Following Section */}
        <div
          id="following"
          className="flex flex-col flex-grow justify-evenly p-4 gap-4"
        >
          <div
            className="bg-[var(--follow-bg)] rounded-[1em] hover:scale-105 transition-all ease-in-out duration-300"
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "var(--follow-shadow)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <h1 className="text-[2vw] font-bold text-2xl p-[0.75rem] cursor-default">
              Following
            </h1>
          </div>

          {/* Streamers Followed */}
          <div
            id="streamers-followed"
            className="flex flex-col flex-grow items-center"
          >
            <h2 className="border-b-4 border-t-4 w-[125%] text-2xl cursor-default">
              Streamers
            </h2>
            <div className="flex flex-col flex-grow justify-evenly w-full">
              {followedStreamers.map((streamer) => (
                <button
                  key={`streamer-${streamer.username}`}
                  className="cursor-pointer bg-black w-full py-2 border border-[--text-color] rounded-lg text-white hover:text-purple-500 transition-colors"
                  onClick={() => navigate(`/user/${streamer.username}`)}
                >
                  {streamer.username}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Following;
