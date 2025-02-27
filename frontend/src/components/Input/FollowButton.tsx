import React, { useEffect, useState } from "react";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useCategoryFollow } from "../../hooks/useCategoryFollow";

interface FollowButtonProps {
    category: {
        category_id: number;
        category_name: string;
        isFollowing: boolean;
    };
}

const FollowButton: React.FC<FollowButtonProps> = ({ category }) => {
    const [isFollowing, setIsFollowing] = useState<boolean | null>(category.isFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const { followCategory, unfollowCategory } = useCategoryFollow();

    useEffect(() => {
        setIsFollowing(category.isFollowing);
    }, [category.isFollowing]);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsLoading(true);

        try {
            if (isFollowing) {
                await unfollowCategory(category.category_name);
                setIsFollowing(false);
            } else {
                await followCategory(category.category_name);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Error toggling follow state:", error);
        }

        setIsLoading(false);
    };

    return (
        <button
            className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition z-[9999]"
            onClick={handleClick}
            disabled={isLoading}
        >
            {isLoading ? (
                <span className="text-white w-5 h-5">⏳</span>
            ) : isFollowing ? (
                <CircleMinus className="text-white w-5 h-5" />
            ) : (
                <CirclePlus className="text-white w-5 h-5" />
            )}
        </button>
    );
};

export default FollowButton;
