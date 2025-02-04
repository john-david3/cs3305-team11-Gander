import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import { useParams } from "react-router-dom";

interface UserProfileData {
  username: string;
  bio: string;
  followerCount: number;
  isPartnered: boolean;
}

const UserPage: React.FC = () => {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const { username } = useParams();

  useEffect(() => {
    // Fetch user profile data
    fetch(`/api/get_streamer_data/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setProfileData({
          username: data.username,
          bio: data.bio || "This user hasn't written a bio yet.",
          followerCount: data.num_followering || 0,
          isPartnered: data.isPartnered || false,
        });
      })
      .catch((err) => console.error("Error fetching profile data:", err));
  }, [username]);

  if (!profileData) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Profile Section - Left Third */}
          <div className="col-span-1 bg-gray-800 rounded-lg p-6 shadow-lg">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
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

              <h1 className="text-3xl font-bold mb-2">
                {profileData.username}
              </h1>

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

              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg mb-4 transition-colors">
                Follow
              </button>
            </div>

            {/* Bio Section */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">
                About {profileData.username}
              </h2>
              <p className="text-gray-300 whitespace-pre-wrap">
                {profileData.bio}
              </p>
            </div>

            {/* Additional Stats */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-sm text-gray-400">Total Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-sm text-gray-400">Following</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="col-span-2 bg-gray-800 rounded-lg p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Past Broadcasts</h2>
            <div className="text-gray-400 flex h-full rounded-none">
              No past broadcasts found
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
