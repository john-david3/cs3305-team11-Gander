import React, { useState, useEffect } from "react";
import { useSidebar } from "../../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

const Sidebar: React.FC<SideBarProps> = ({ extraClasses }) => {
  const { showSideBar } = useSidebar();
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
    <div
      id="sidebar"
      className={`fixed top-0 left-0 w-[15vw] h-screen flex flex-col bg-[var(--sideBar-bg)] text-[var(--sideBar-text)] text-center overflow-y-auto scrollbar-hide
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

      <div id="following" className="flex flex-col flex-grow justify-evenly gap-4 p-[1rem]">
        <div className="bg-[var(--follow-bg)] rounded-[1em] hover:scale-105 transition-all ease-in-out duration-300"
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--follow-shadow)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
        >
        <h1 className="text-[var(--follow-text)] font-bold text-2xl p-[0.75rem] cursor-default">Following</h1>
        </div>
        <div id="streamers-followed" className="flex-grow">
          <h2 className="border-b-4 border-t-4 text-2xl cursor-default">Streamers</h2>
          <ul className="mt-2 space-y-2">
            {followedStreamers.map((streamer) => (
              <li
                key={streamer.user_id}
                className="cursor-pointer bg-black py-2 rounded-lg text-white hover:text-purple-500 transition-colors"
                onClick={() => navigate(`/user/${streamer.username}`)}
              >
                {streamer.username}
              </li>
            ))}
          </ul>
        </div>

        <div id="categories-followed" className="flex-grow">
          <h2 className="border-b-4 border-t-4 text-[1.5rem] cursor-default">Categories</h2>
          <ul className="mt-2 space-y-2">
            {followedCategories.map((category) => (
              <li
                key={category.category_id}
                className="cursor-pointer bg-black py-2 rounded-lg text-white hover:text-purple-500 transition-colors"
                onClick={() => navigate(`/category/${category.category_name}`)}
              >
                {category.category_name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
