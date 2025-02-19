import React, { useState, useEffect } from "react";
import Navbar from "../components/Navigation/Navbar";
import AuthModal from "../components/Auth/AuthModal";
import { useAuthModal } from "../hooks/useAuthModal";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import ListItem from "../components/Layout/ListItem";
import { useFollow } from "../hooks/useFollow";
import { useNavigate } from "react-router-dom";
import Button, { EditButton } from "../components/Input/Button";
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
                    `/images/category_thumbnails/${streamData.category_name
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
      className={`min-h-screen ${profileData.isLive
        ? "bg-gradient-radial from-[#ff00f1] via-[#0400ff] to-[#2efd2d]"
        : bgColors[userPageVariant]
        } text-white flex flex-col`}
    >

      <div className="flex justify-evenly justify-self-center items-center h-full px-4 py-8 max-w-[80vw] w-full">

        <div className="grid grid-cols-4 grid-rows-[0.1fr_1.5fr] w-full gap-8">
          {/* Profile Section - TOP  */}


          <div id="profile"
            className="col-span-4 row-span-1 h-full bg-[var(--user-bg)] 
        rounded-[30px] p-3 shadow-lg 
        relative flex flex-col items-center">

            {/* Border Overlay (Always on Top) */}
            <div className="absolute left-[0.5px] inset-0 border-[5px] border-[var(--user-borderBg)] rounded-[20px] z-20"></div>


            {/* Background Box */}
            <div className="absolute flex top-0 left-[0.5px] w-[99.8%] h-[5vh] min-h-[1em] max-h-[10em] rounded-t-[25.5px] 
                 bg-[var(--user-box)] z-10 flex-shrink justify-center"
              style={{ boxShadow: 'var(--user-box-shadow)' }}
            >
              <div className="absolute top-4 w-[99.8%] h-[1.5vh] min-h-[10px] max-h-[2em]  bg-[var(--user-box-strip)]"></div>

            </div>
            {/* Profile Picture */}
            <div className="relative -top-[40px] sm:-top-[90px] w-[16vw] h-[16vw] sm:w-[20vw] sm:h-[20vw] max-w-[10em] max-h-[10em]
               rounded-full overflow-hidden flex-shrink-0 border-4 border-[var(--user-pfp-border)] inset-0 z-20"
              style={{ boxShadow: 'var(--user-pfp-border-shadow)' }}>
              <img
                src="/images/monkey.png"
                alt={`${profileData.username}'s profile`}
                className="sm:w-[full] h-full object-cover rounded-full
                "
              />
            </div>

            {/* Username - Now Directly Below PFP */}
            <h1 className="text-[1.5em] sm:text-[2em] font-bold -mt-[45px] sm:-mt-[90px] text-center">
              {profileData.username}
            </h1>





            {/* Follower Count  */}
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

                {/* (Un)Follow Button  */}
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

          <div
            id="settings"
            className="col-span-1 bg-[var(--user-sideBox)] rounded-lg p-6 grid grid-rows-[auto_1fr] text-center items-center justify-center"
          >
            {/* User Type (e.g., "USER") */}
            <small className="text-green-400">{userPageVariant.toUpperCase()}</small>

            Bio Section
            <div className="mt-6 text-center">
              <h2 className="text-xl font-semibold mb-3">About {profileData.username}</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{profileData.bio}</p>
            </div>
          </div>

          {/* Content Section */}
          <div
            id="content"
            className="col-span-2 bg-[var(--user-contentBox)] rounded-lg p-6 grid grid-rows-[auto_1fr] text-center items-center justify-center"
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

          <div
            id="mini"
            className="bg-[var(--user-sideBox)] col-span-1 bg-gray-800 rounded-lg  text-center items-center justify-center
  flex flex-col flex-grow gap-4 p-[2rem]"
          >
            <div
              className="bg-[var(--follow-bg)] rounded-[1em] hover:scale-105 transition-all ease-in-out duration-300 
                 flex items-center justify-center w-full p-4"
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--follow-shadow)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
                <p className="text-[var(--follow-text)] whitespace-pre-wrap">Following www</p>
                
            </div>
          </div>


        </div>
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}


    </DynamicPageContent>
  );
};

export default UserPage;
