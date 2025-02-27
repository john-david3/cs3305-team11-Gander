import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CircleMinus, CirclePlus } from "lucide-react";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { fetchContentOnScroll } from "../hooks/fetchContentOnScroll";
import { useCategoryFollow } from "../hooks/useCategoryFollow";
import { ListItemProps as StreamData } from "../components/Layout/ListItem";
import LoadingScreen from "../components/Layout/LoadingScreen";
import FollowButton from "../components/Input/FollowButton";

interface Category {
    isFollowing: boolean;
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
    const { checkCategoryFollowStatus, followCategory, unfollowCategory } = useCategoryFollow();

    useEffect(() => {
        if (categoryName) checkCategoryFollowStatus(categoryName);
    }, [categoryName]);


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

    useEffect(() => {
        toggleFollow;
    })

    const toggleFollow = async (categoryId: number, categoryName: string) => {
        // Find the current category state from followedCategories
        const category = followedCategories.find(cat => cat.category_id === categoryId);
        if (!category) return;

        const currentFollowState = category.isFollowing; // Use the actual state instead of isCategoryFollowing

        try {
            // Set local state per category (independent button states)
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

            // Update only the clicked category
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

    return (
        <DynamicPageContent>
            <div
                id="sidebar"
                className={`top-0 left-0 w-screen h-screen overflow-x-hidden flex flex-col bg-[var(--sideBar-bg)] text-[var(--sideBar-text)] text-center overflow-y-auto scrollbar-hide transition-all duration-500 ease-in-out ${extraClasses}`}
            >
                {/* Followed Categories */}
                <div id="categories-followed" className="grid grid-cols-3 gap-4 p-4 w-full">
                    {followedCategories.map((category) => {
                        return (
                            <div
                                key={category.category_id}
                                className="relative flex flex-col items-center justify-center border border-[--text-color] rounded-lg overflow-hidden hover:shadow-lg transition-all"
                                onClick={() => navigate(`/category/${category.category_name}`)}
                            >
                                <FollowButton category={category}/>
                                <img
                                    src={`/images/category_thumbnails/${category.category_name.toLowerCase().replace(/ /g, "_")}.webp`}
                                    alt={category.category_name}
                                    className="w-full h-28 object-cover"
                                />
                                <div className="absolute bottom-2 bg-black bg-opacity-60 w-full text-center text-white py-1">
                                    {category.category_name}
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </DynamicPageContent>
    );
};

export default FollowedCategories;
