import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CircleMinus, CirclePlus } from "lucide-react";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { fetchContentOnScroll } from "../hooks/fetchContentOnScroll";
import { useCategoryFollow } from "../hooks/useCategoryFollow";
import { ListItemProps as StreamData } from "../components/Layout/ListItem";
import LoadingScreen from "../components/Layout/LoadingScreen";

interface Category {
    isFollowing: boolean;
    category_id: number;
    category_name: string;
    isLoading?: boolean;
}

interface FollowedCategoryProps {
    extraClasses?: string;
}

const FollowedCategories: React.FC<FollowedCategoryProps> = ({ extraClasses = "" }) => {
    const navigate = useNavigate();
    const { username, isLoggedIn } = useAuth();
    const [followedCategories, setFollowedCategories] = useState<Category[]>([]);
    const { categoryName } = useParams<{ categoryName: string }>();
    const { checkCategoryFollowStatus, followCategory, unfollowCategory } = useCategoryFollow();

    useEffect(() => {
        if (categoryName) checkCategoryFollowStatus(categoryName);
    }, [categoryName]);

    const toggleFollow = async (categoryId: number, categoryName: string, currentFollowState: boolean) => {
        try {
            // Set local loading state per category
            setFollowedCategories(prevCategories =>
                prevCategories.map(cat =>
                    cat.category_id === categoryId ? { ...cat, isLoading: true } : cat
                )
            );

            if (currentFollowState) {
                await unfollowCategory(categoryName);
            } else {
                await followCategory(categoryName);
            }

            // Toggle only the clicked button state
            setFollowedCategories(prevCategories =>
                prevCategories.map(cat =>
                    cat.category_id === categoryId
                        ? { ...cat, isFollowing: !currentFollowState, isLoading: false }
                        : cat
                )
            );
        } catch (error) {
            console.error("Error toggling follow state:", error);

            // Reset loading state in case of error
            setFollowedCategories(prevCategories =>
                prevCategories.map(cat =>
                    cat.category_id === categoryId ? { ...cat, isLoading: false } : cat
                )
            );
        }
    };

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchFollowedCategories = async () => {
            try {
                const response = await fetch("/api/categories/following");
                if (!response.ok) throw new Error("Failed to fetch followed categories");
                const data = await response.json();
                setFollowedCategories(data);
            } catch (error) {
                console.error("Error fetching followed categories:", error);
            }
        };

        fetchFollowedCategories();
    }, [isLoggedIn]);

    return (
        <DynamicPageContent>
            <div
                id="sidebar"
                className={`top-0 left-0 w-screen h-screen overflow-x-hidden flex flex-col bg-[var(--sideBar-bg)] text-[var(--sideBar-text)] text-center overflow-y-auto scrollbar-hide transition-all duration-500 ease-in-out ${extraClasses}`}
            >
                {/* Followed Categories */}
                <div id="categories-followed" className="grid grid-cols-3 gap-4 p-4 w-full">
                    {followedCategories.map((category: Category) => (
                        <div
                            key={category.category_id}
                            className="relative flex flex-col items-center justify-center border border-[--text-color] rounded-lg overflow-hidden hover:shadow-lg transition-all"
                            onClick={() => navigate(`/category/${category.category_name}`)}
                        >
                            <button
                                className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition z-[9999]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFollow(category.category_id, category.category_name, category.isFollowing);
                                }}
                                disabled={category.isLoading}
                            >
                                {category.isLoading ? (
                                    <span className="text-white w-5 h-5">⏳</span>
                                ) : category.isFollowing ? (
                                    <CircleMinus className="text-white w-5 h-5" />
                                ) : (
                                    <CirclePlus className="text-white w-5 h-5" />
                                )}
                            </button>

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
    );
};

export default FollowedCategories;
