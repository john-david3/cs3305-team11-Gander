import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import { CircleMinus, CirclePlus, Sidebar as SidebarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { fetchContentOnScroll } from "../hooks/fetchContentOnScroll";
import Button from "../components/Input/Button";
import { useCategoryFollow } from "../hooks/useCategoryFollow";
import { ListItemProps as StreamData } from "../components/Layout/ListItem";
import LoadingScreen from "../components/Layout/LoadingScreen";

interface Category {
    isFollowing: any;
    category_id: number;
    category_name: string;
}

interface FollowedCategoryProps {
    extraClasses?: string;
}

const FollowedCategories: React.FC<FollowedCategoryProps> = ({ extraClasses = "" }) => {
    const navigate = useNavigate();
    const { username, isLoggedIn } = useAuth();
    const [followedCategories, setFollowedCategories] = useState<Category[]>([]);
    const { categoryName } = useParams<{ categoryName: string }>();
    const [streams, setStreams] = useState<StreamData[]>([]);
    const listRowRef = useRef<any>(null);
    const isLoading = useRef(false);
    const [streamOffset, setStreamOffset] = useState(0);
    const [noStreams, setNoStreams] = useState(12);
    const [hasMoreData, setHasMoreData] = useState(true);
    const {
        isCategoryFollowing,
        checkCategoryFollowStatus,
        followCategory,
        unfollowCategory,
    } = useCategoryFollow();

    const toggleFollow = async (categoryId: number, categoryName: string) => {
        try {
            setFollowedCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category.category_id === categoryId
                        ? {
                            ...category,
                            isFollowing: !category.isFollowing
                        }
                        : category
                )
            );

            const category = followedCategories.find(cat => cat.category_id === categoryId);

            if (category?.isFollowing) {
                await unfollowCategory(categoryName);
            } else {
                await followCategory(categoryName);
            }
        } catch (error) {
            console.error("Error toggling follow state:", error);
        }
    };

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

    useEffect(() => {
        if (categoryName) checkCategoryFollowStatus(categoryName);
    }, [categoryName]);

    if (hasMoreData && !streams.length) return <LoadingScreen />;

    return (
        <>
            <DynamicPageContent>
                <div className={`top-0 left-0 w-screen h-screen flex flex-col bg-[var(--sideBar-bg)] text-[var(--sideBar-text)] text-center overflow-y-auto scrollbar-hide transition-all duration-500 ease-in-out ${extraClasses}`}>
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

                    <div id="categories-followed" className="grid grid-cols-3 gap-4 p-4 w-full">
                        {followedCategories.map((category: Category) => (
                            <div
                                key={category.category_id}
                                className="relative flex flex-col items-center justify-center border border-[--text-color] rounded-lg overflow-hidden hover:shadow-lg transition-all"
                            >
                                <Button
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition z-[9999]"
                                    onClick={() => toggleFollow(category.category_id, category.category_name)}
                                >
                                    {category.isFollowing ? (
                                        <CircleMinus className="text-white w-5 h-5" />
                                    ) : (
                                        <CirclePlus className="text-white w-5 h-5" />
                                    )}
                                </Button>

                                <img
                                    src={`/images/category_thumbnails/${category.category_name.toLowerCase().replace(/ /g, "_")}.webp`}
                                    alt={category.category_name}
                                    className="w-full h-28 object-cover"
                                />
                                <div className="absolute bottom-2 bg-black bg-opacity-60 w-full text-center text-white py-1">
                                    {category.category_name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DynamicPageContent>
        </>
    );
};

export default FollowedCategories;
