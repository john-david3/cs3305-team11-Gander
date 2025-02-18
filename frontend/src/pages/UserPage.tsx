import React, { useState, useEffect } from "react";
import Navbar from "../components/Navigation/Navbar";
import AuthModal from "../components/Auth/AuthModal";
import { useAuthModal } from "../hooks/useAuthModal";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import ListItem from "../components/Layout/ListItem";
import { useFollow } from "../hooks/useFollow";
import { useNavigate } from "react-router-dom";
import Button from "../components/Input/Button";
import DynamicPageContent from "../components/Layout/DynamicPageContent";

interface UserProfileData {
  id: number;
  username: string;
  bio: string;
  followerCount: number;
  isPartnered: boolean;
  isLive: boolean;
  currentStreamTitle?: string;
  currentStreamCategory?: string;
  currentStreamViewers?: number;
  currentStreamStartTime?: string;
  currentStreamThumbnail?: string;
}

const UserPage: React.FC = () => {
  const [userPageVariant, setUserPageVariant] = useState<
    "personal" | "streamer" | "user" | "admin"
  >("user");
  const [profileData, setProfileData] = useState<UserProfileData>();
  const { isFollowing, checkFollowStatus, followUser, unfollowUser } =
    useFollow();
  const { showAuthModal, setShowAuthModal } = useAuthModal();
  const { username: loggedInUsername } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();

  const bgColors = {
    personal: "",
    streamer: "bg-gradient-radial from-[#ff00f1] via-[#0400ff] to-[#ff0000]", // offline streamer
    user: "bg-gradient-radial from-[#ff00f1] via-[#0400ff] to-[#ff00f1]",
    admin:
      "bg-gradient-to-r from-[rgb(255,0,0)] via-transparent to-[rgb(0,0,255)]",
  };

  useEffect(() => {
    // Fetch user profile data
    fetch(`/api/user/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setProfileData({
          id: data.user_id,
          username: data.username,
          bio: data.bio || "This user hasn't written a bio yet.",
          followerCount: data.num_followers || 0,
          isPartnered: data.isPartnered || false,
          isLive: data.is_live,
          currentStreamTitle: "",
          currentStreamCategory: "",
          currentStreamViewers: 0,
          currentStreamThumbnail: "",
        });

        if (data.is_live) {
          // Fetch stream data for this streamer
          fetch(`/api/streams/${data.user_id}/data`)
            .then((res) => res.json())
            .then((streamData) => {
              setProfileData((prevData) => {
                if (!prevData) return prevData;
                return {
                  ...prevData,
                  currentStreamTitle: streamData.title,
                  currentStreamCategory: streamData.category_id,
                  currentStreamViewers: streamData.num_viewers,
                  currentStreamStartTime: streamData.start_time,
                  currentStreamThumbnail:
                    streamData.thumbnail ||
                    `/images/thumbnails/categories/${streamData.category_name
                      .toLowerCase()
                      .replace(/ /g, "_")}.webp`,
                };
              });
              let variant: "user" | "streamer" | "personal" | "admin";
              if (username === loggedInUsername) variant = "personal";
              else if (streamData.title) variant = "streamer";
              // else if (data.isAdmin) variant = "admin";
              else variant = "user";
              setUserPageVariant(variant);
            })
            .catch((err) => console.error("Error fetching stream data:", err));
        }
      })
      .catch((err) => {
        console.error("Error fetching profile data:", err);
        navigate("/404");
      });

    // Check if the *logged-in* user is following this user
    if (loggedInUsername && username) checkFollowStatus(username);
  }, [username]);

  if (!profileData) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }
  return (
    <DynamicPageContent
      className={`min-h-screen ${
        profileData.isLive
          ? "bg-gradient-radial from-[#ff00f1] via-[#0400ff] to-[#2efd2d]"
          : bgColors[userPageVariant]
      } text-white flex flex-col`}
    >
      
      <div className="flex justify-evenly justify-self-center items-center h-full px-4 py-8">
        <div className="grid grid-cols-3 w-full gap-8">
          {/* Profile Section - Left Third */}
          <div
            id="profile"
            className="col-span-1 bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6">
                <img
                  src="/images/monkey.png"
                  alt={`${profileData.username}'s profile`}
                  className="w-full h-full object-cover"
                />

                {profileData.isPartnered && (
                  <div className="absolute bottom-2 right-2 bg-purple-600 rounded-full p-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Username & Follower Count */}
              <h1 className="text-3xl font-bold mb-2">
                {profileData.username}
              </h1>
              <small className="text-green-400">
                {userPageVariant.toUpperCase()}
              </small>

              {/* Follower Count */}
              {userPageVariant === "streamer" && (
                <>
                  <div className="flex items-center space-x-2 mb-6">
                    <span className="text-gray-400">
                      {profileData.followerCount.toLocaleString()} followers
                    </span>
                    {profileData.isPartnered && (
                      <span className="bg-purple-600 text-white text-sm px-2 py-1 rounded">
                        Partner
                      </span>
                    )}
                  </div>

                  {/* (Un)Follow Button */}
                  {!isFollowing ? (
                    <Button
                      extraClasses="w-full bg-purple-700 hover:bg-[#28005e]"
                      onClick={() =>
                        followUser(profileData.id, setShowAuthModal)
                      }
                    >
                      Follow
                    </Button>
                  ) : (
                    <Button
                      extraClasses="w-full bg-[#a80000]"
                      onClick={() =>
                        unfollowUser(profileData?.id, setShowAuthModal)
                      }
                    >
                      Unfollow
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Bio Section */}
            <div className="mt-6 text-center">
              <h2 className="text-xl font-semibold mb-3">
                About {profileData.username}
              </h2>
              <p className="text-gray-300 whitespace-pre-wrap">
                {profileData.bio}
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div
            id="content"
            className="col-span-2 bg-gray-800 rounded-lg p-6 grid grid-rows-[auto_1fr] text-center items-center justify-center"
          >
            {userPageVariant === "streamer" && (
              <>
                {/* ↓↓ Current Stream ↓↓ */}
                {profileData.isLive && (
                  <div className="mb-8">
                    <h2 className="text-2xl bg-[#ff0000] border py-4 px-12 font-black mb-4 rounded-[4rem]">
                      Currently Live!
                    </h2>
                    <ListItem
                      id={profileData.id}
                      type="stream"
                      title={profileData.currentStreamTitle || ""}
                      streamer=""
                      viewers={profileData.currentStreamViewers || 0}
                      thumbnail={profileData.currentStreamThumbnail}
                      onItemClick={() => {
                        navigate(`/${profileData.username}`);
                      }}
                    />
                  </div>
                )}
                {/* ↓↓ VODS ↓↓ */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Past Broadcasts</h2>
                  <div className="text-gray-400 rounded-none">
                    No past broadcasts found
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </DynamicPageContent>
  );
};

export default UserPage;
