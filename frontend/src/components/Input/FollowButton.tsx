import React, { useEffect, useState } from "react";
import { CircleMinus, CirclePlus, Pencil } from "lucide-react";
import { useCategoryFollow } from "../../hooks/useCategoryFollow";


interface FollowButtonProps {
    category: {
        category_id: number;
        category_name: string;
        isFollowing: boolean;
    };
}

const FollowButton: React.FC<FollowButtonProps> = ({ category }) => {
    const [mode, setMode] = useState<"pencil" | "minus" | "plus">("pencil");
    const [isFollowing, setIsFollowing] = useState<boolean | null>(category.isFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const { followCategory, unfollowCategory } = useCategoryFollow();
    const [showTip, setTip] = useState(false);


    useEffect(() => {
        setIsFollowing(category.isFollowing);
    }, [category.isFollowing]);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsLoading(true);

        try {
            // Cycle between modes
            setMode((prevMode) => {
                if (prevMode === "pencil") return "minus";
                if (prevMode === "minus") return "plus";
                return "minus";
            });
        } catch (error) {
            console.error("Error toggling state:", error);
        }

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
        <div>
            <button
                className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition z-[1]"
                onClick={handleClick}
                disabled={isLoading}
                onMouseEnter={() => setTip(true)}
                onMouseLeave={() => setTip(false)}
            >
                {isLoading ? (
                    <span className="text-white w-5 h-5">⏳</span>
                ) : mode === "pencil" ? (
                    <Pencil className="text-white w-5 h-5" />
                ) : mode === "minus" ? (
                    <CircleMinus className="text-white w-5 h-5" />
                ) : (
                    <CirclePlus className="text-white w-5 h-5" />
                )}
            </button>

            {/* Tooltip */}
            {showTip && mode === "pencil" && (
                <div className="absolute top-10 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md">
                    Edit category
                </div>
            )}

            {showTip && mode === "minus" && (
                <div className="absolute top-10 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md">
                    Unfollow Category
                </div>
            )}

            {showTip && mode === "plus" && (
                <div className="absolute top-10 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md">
                    Follow Category
                </div>
            )}
        </div>
    );
};
export default FollowButton;
