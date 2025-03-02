import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { useCategoryFollow } from "../hooks/useCategoryFollow";
import FollowButton from "../components/Input/FollowButton";
import { useAuthModal } from "../hooks/useAuthModal";


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
                const response = await fetch("/api/categories/your_categories");
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
                <div id="categories-followed" className="grid grid-cols-4 gap-4 p-4 w-full">
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
