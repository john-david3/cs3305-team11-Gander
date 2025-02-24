import React, { useEffect, useState } from "react";
import { Sidebar as SidebarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { ToggleButton } from "../Input/Button";

interface Streamer {
  user_id: number;
  username: string;
}

interface Category {
  category_id: number;
  category_name: string;
}

interface SideBarProps {
  extraClasses?: string;
}

const Sidebar: React.FC<SideBarProps> = ({ extraClasses = "" }) => {
  const { showSideBar, setShowSideBar } = useSidebar();
  const navigate = useNavigate();
  const { username, isLoggedIn } = useAuth();
  const [followedStreamers, setFollowedStreamers] = useState<Streamer[]>([]);
  const [followedCategories, setFollowedCategories] = useState<Category[]>([]);

  // Fetch followed streamers
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchFollowedStreamers = async () => {
      try {
        const response = await fetch("/api/user/following");
        if (!response.ok) throw new Error("Failed to fetch followed streamers");
        const data = await response.json();
        setFollowedStreamers(data);
      } catch (error) {
        console.error("Error fetching followed streamers:", error);
      }
    };

    fetchFollowedStreamers();
  }, [isLoggedIn]);

  const handleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  // Keyboard shortcut to toggle sidebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.key === "s" &&
        document.activeElement == document.body &&
        isLoggedIn
      )
        handleSideBar();
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [showSideBar, setShowSideBar, isLoggedIn]);

  // Fetch followed categories
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchFollowedCategories = async () => {
      try {
        const response = await fetch("/api/categories/following");
        if (!response.ok)
          throw new Error("Failed to fetch followed categories");
        const data = await response.json();
        setFollowedCategories(data);
      } catch (error) {
        console.error("Error fetching followed categories:", error);
      }
    };

    fetchFollowedCategories();
  }, [isLoggedIn]);

  return (
    <>
      <ToggleButton
        onClick={() => handleSideBar()}
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
      <div
        id="sidebar"
        className={`fixed top-0 left-0 w-[15vw] h-screen overflow-x-hidden flex flex-col bg-[var(--sideBar-bg)] text-[var(--sideBar-text)] text-center overflow-y-auto scrollbar-hide
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
          <div
            id="streamers-followed"
            className="flex flex-col flex-grow items-center"
          >
            <h2 className="border-b-4 border-t-4 w-[125%] text-2xl cursor-default">
              Streamers
            </h2>
            <div className="flex flex-col flex-grow justify-evenly w-full">
              {followedStreamers.map((streamer: any) => (
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

          <div
            id="categories-followed"
            className="flex flex-col flex-grow items-center"
          >
            <h2 className="border-b-4 border-t-4 w-[125%] text-2xl cursor-default">
              Categories
            </h2>
            <div className="flex flex-col flex-grow justify-evenly w-full">
              {followedCategories.map((category: any) => (
                <button
                  key={`category-${category.category_name}`}
                  className="cursor-pointer bg-black w-full py-2 border border-[--text-color] rounded-lg text-white hover:text-purple-500 transition-colors"
                  onClick={() =>
                    navigate(`/category/${category.category_name}`)
                  }
                >
                  {category.category_name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
