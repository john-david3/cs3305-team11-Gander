import React, { useEffect, useState } from "react";
import { SidebarIcon } from "lucide-react";
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
  const { showSideBar, setShowSideBar, profileImageUrl } = useSidebar();
  const navigate = useNavigate();
  const { username, isLoggedIn } = useAuth();
  const [followedStreamers, setFollowedStreamers] = useState<Streamer[]>([]);
  const [followedCategories, setFollowedCategories] = useState<Category[]>([]);
  const [justToggled, setJustToggled] = useState(false);

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
    setJustToggled(true);
    setTimeout(() => setJustToggled(false), 200);
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
        extraClasses={`absolute group text-[1rem] top-[9vh] ${showSideBar
            ? "left-[16vw] duration-[0.5s]"
            : "left-[20px] duration-[1s]"
          } ease-in-out cursor-pointer z-[50]`}
        toggled={showSideBar}
      >
        <SidebarIcon className="h-[2vw] w-[2vw]" />

        {!showSideBar && !justToggled && (
          <small className="absolute flex items-center top-0 ml-2 left-0 h-full my-auto w-fit text-nowrap font-bold my-auto group-hover:left-full opacity-0 group-hover:opacity-100 group-hover:bg-black/30 p-1 rounded-md text-white transition-all">
            Press S
          </small>
        )}
      </ToggleButton>
      <div
        id="sidebar"
        className={`fixed top-0 left-0 w-[15vw] h-screen overflow-x-hidden flex flex-col bg-[var(--sideBar-bg)] text-[var(--sideBar-text)] text-center overflow-y-auto scrollbar-hide
        transition-all duration-500 ease-in-out ${showSideBar ? "translate-x-0" : "-translate-x-full"
          } ${extraClasses}`}
      >
        {/* Profile Info */}
        <div className="flex flex-row items-center border-b-4 border-[var(--profile-border)] justify-evenly bg-[var(--sideBar-profile-bg)] py-[1em]">
          <img
            src={profileImageUrl}
            alt="profile picture"
            className="w-[3em] h-[3em] rounded-full border-[0.15em] border-purple-500 cursor-pointer"
            style={{ backgroundColor: 'white' }}
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
                  className="cursor-pointer bg-black w-full py-2 border border-[--text-color] rounded-lg text-white hover:text-purple-500 font-bold transition-colors"
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

            {/* Followed Categories */}
            <div
              id="categories-followed"
              className="grid grid-cols-1 gap-4 p-4 w-full"
            >
              {followedCategories.map((category) => {
                return (
                  <div
                    key={category.category_id}
                    className="group relative flex flex-col items-center justify-center h-full max-h-[50px] border border-[--text-color]
                     rounded-lg overflow-hidden hover:shadow-lg transition-all text-white hover:text-purple-500 cursor-pointer"
                    onClick={() =>
                      window.location.href = `/category/${category.category_name}`
                    }
                  >
                    <img
                      src={`/images/category_thumbnails/${category.category_name
                        .toLowerCase()
                        .replace(/ /g, "_")}.webp`}
                      alt={category.category_name}
                      className="w-full h-28 object-cover group-hover:blur-[3px] transition-all"
                    />
                    <div className="absolute bottom-2 bg-black bg-opacity-60 font-bold w-full text-center py-1">
                      {category.category_name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
