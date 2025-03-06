import React, { useEffect, useState, useRef } from "react";
import { SidebarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { ToggleButton } from "../Input/Button";
import { getCategoryThumbnail } from "../../utils/thumbnailUtils";

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
    const { username, isLoggedIn, profilePicture } = useAuth();
    const [followedStreamers, setFollowedStreamers] = useState<Streamer[]>([]);
    const [followedCategories, setFollowedCategories] = useState<Category[]>([]);
    const [justToggled, setJustToggled] = useState(false);
    const sidebarId = useRef(Math.floor(Math.random() * 1000000));

    // Fetch followed streamers & categories
    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchFollowData = async () => {
            try {
                const response = await fetch("/api/user/following");
                if (!response.ok) throw new Error("Failed to fetch followed content");
                const data = await response.json();
                setFollowedStreamers(data.streams);
                setFollowedCategories(data.categories);
            } catch (error) {
                console.error("Error fetching followed content:", error);
            }
        };

        fetchFollowData();
    }, [isLoggedIn]);

    const handleSideBar = () => {
        setShowSideBar(!showSideBar);
        setJustToggled(true);
        setTimeout(() => setJustToggled(false), 200);
    };

    // Keyboard shortcut to toggle sidebar
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "s" && document.activeElement == document.body && isLoggedIn) handleSideBar();
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [showSideBar, setShowSideBar, isLoggedIn]);

    return (
        <>
            <ToggleButton
                onClick={() => handleSideBar()}
                extraClasses={`absolute group text-[1rem] top-[9vh] ${showSideBar ? "left-[16vw] duration-[0.5s]" : "left-[20px] duration-[1s]"
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
                id={`sidebar-${sidebarId.current}`}
                className={`fixed top-0 left-0 w-[15vw] h-screen overflow-x-hidden flex flex-col bg-[var(--sideBar-bg)] text-[var(--sideBar-text)] text-center overflow-y-auto scrollbar-hide
        transition-all duration-500 ease-in-out ${showSideBar ? "translate-x-0" : "-translate-x-full"} z-50 ${extraClasses}`}
            >
                {/* Profile Info */}
                <div className="flex flex-row items-center border-b-4 border-[var(--profile-border)] justify-evenly bg-[var(--sideBar-profile-bg)] py-[1em]">
                    <img
                        src={profilePicture || `/user/${username}/profile_picture`}
                        onError={(e) => {
                            e.currentTarget.src = "/images/pfps/default.png";
                            e.currentTarget.onerror = null;
                        }}
                        alt="profile picture"
                        className="w-[3em] h-[3em] object-cover rounded-full border-[0.15em] border-purple-500 cursor-pointer"
                        onClick={() => navigate(`/user/${username}`)}
                        style={{ backgroundColor: 'white' }}
                    />
                    <div className="text-center flex flex-col items-center justify-center">
                        <h5 className="font-thin text-[0.85rem] cursor-default text-[var(--sideBar-profile-text)]">Logged in as</h5>
                        <button className="font-black text-[1.4rem] hover:underline" onClick={() => navigate(`/user/${username}`)}>
                            <div className="text-[var(--sideBar-profile-text)]">{username}</div>
                        </button>
                    </div>
                </div>

                <div id="following" className="flex flex-col flex-grow justify-evenly p-4 gap-4">
                    <div
                        className="bg-[var(--follow-bg)] rounded-[1em] hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer"
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--follow-shadow)")}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                        onClick={() => (window.location.href = `/user/${username}/following?tab=streamers`)}
                    >
                        <h1 className="text-[2vw] font-bold text-2xl p-[0.75rem]">Following</h1>
                    </div>
                    <div id="streamers-followed" className="flex flex-col flex-grow items-center">
                        <h2 className="border-b-2 border-t-2 w-[125%] text-2xl cursor-default mb-5">Streamers</h2>
                        <div className="flex flex-col flex-grow justify-evenly w-full">
                            {followedStreamers.map((streamer) => (
                                <div
                                    key={`${sidebarId.current}-streamer-${streamer.username}`}
                                    className="flex items-center gap-3 cursor-pointer bg-[var(--streamer-box)] w-full py-2 px-3 rounded-lg font-bold transition hover:scale-105 ease-in-out duration-300 "
                                    onClick={() => navigate(`/user/${streamer.username}`)}
                                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--streamer-shadow)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                                >
                                    <img
                                        src={`/user/${streamer.username}/profile_picture`}
                                        alt={`${streamer.username}'s Profile`}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex flex-1 items-center justify-center text-[var(--streamer-text)]">{streamer.username}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div id="categories-followed" className="flex flex-col flex-grow items-center">
                        <h2 className="border-b-2 border-t-2 w-[125%] text-2xl cursor-default">Categories</h2>

                        {/* Followed Categories */}
                        <div id="categories-followed" className="grid grid-cols-1 gap-4 p-4 w-full">
                            {followedCategories.map((category) => {
                                return (
                                    <div
                                        key={`${sidebarId.current}-category-${category.category_id}`}
                                        className="group relative flex flex-col items-center justify-center w-full h-full max-h-[50px] border border-[--text-color]
                     rounded-lg overflow-hidden hover:shadow-lg transition-all text-white hover:text-purple-500 cursor-pointer"
                                        onClick={() => (window.location.href = `/category/${category.category_name}`)}
                                    >
                                        <img
                                            src={getCategoryThumbnail(category.category_name)}
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
