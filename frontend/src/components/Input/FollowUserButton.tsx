import React, { useEffect, useState } from "react";
import { useFollow } from "../../hooks/useFollow";

interface FollowUserButtonProps {
    user: {
        user_id: number;
        username: string;
        isFollowing: boolean;
    };
}

const FollowUserButton: React.FC<FollowUserButtonProps> = ({ user }) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(user.isFollowing);
    const [isLoading, setIsLoading] = useState(false);

    const { checkFollowStatus, followUser, unfollowUser } = useFollow();

    useEffect(() => {
        setIsFollowing(user.isFollowing);
    }, [user.isFollowing]);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser(user.user_id);
                setIsFollowing(false);
            } else {
                await followUser(user.user_id);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Error toggling follow state:", error);
        }
        setIsLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`px-4 py-2 text-sm rounded-md font-bold transition-all ${
                isFollowing
                    ? "bg-gray-700 hover:bg-red-600 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </button>
    );
};

export default FollowUserButton;
