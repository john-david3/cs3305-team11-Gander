import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import Footer from "../components/Layout/Footer";

interface Vod {
  vod_id: number;
  title: string;
  datetime: string;
  username: string;
  category_name: string;
  length: number;
  views: number;
}

const Vods: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username?: string }>();
  const { isLoggedIn } = useAuth();
  const [ownedVods, setOwnedVods] = useState<Vod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchVods = async () => {
      try {
        const response = await fetch(`/api/vods/${username}`);
        if (!response.ok) throw new Error(`Failed to fetch VODs: ${response.statusText}`);

        const data = await response.json();
        setOwnedVods(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error fetching VODs.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVods();
  }, [username]);

  if (loading) return <p className="text-center">Loading VODs...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <DynamicPageContent className="h-full">
      <div className="mt-[3em] w-screen h-[100vh] max-h-[500px] flex items-center justify-center">
        <div
          id="follow_page"
          className={`w-[96vw] h-full bg-slate-50/35 rounded-lg overflow-x-hidden flex flex-col text-center scrollbar-hide transition-all duration-500 ease-in-out`}
        >
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{username}'s VODs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedVods.length === 0 ? (
                <p className="col-span-full text-center">No VODs available.</p>
              ) : (
                ownedVods.map((vod) => {
                  const thumbnailUrl = `/vods/${username}/${vod.vod_id}.png`;

                  return (
                    <div
                      key={vod.vod_id}
                      className="mt-5 h-full rounded-lg p-4 bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition"
                      onClick={() => navigate(`/stream/${username}/vods/${vod.vod_id}`)}
                    >
                      {/* Thumbnail */}
                      <img
                        src={thumbnailUrl}
                        alt={`Thumbnail for ${vod.title}`}
                        className="w-full h-[200px] object-cover rounded-md mb-2"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/default-thumbnail.png";
                        }}
                      />
                      {/* Video Info */}
                      <div className="flex flex-col space-y-1">

                        {/* Video Title */}
                        <h2 className="text-white font-bold text-lg">{vod.title}</h2>

                        {/* Channel Name */}
                        <div className="flex items-center space-x-2">
                          <p className="text-white text-sm">{username}</p>
                        </div>

                        {/* Views and Date */}
                        <div className="flex space-x-2 text-white text-sm">
                          <p>{vod.views} views</p>
                          <p>{new Date(vod.datetime).toLocaleString()}</p>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </DynamicPageContent>
  );
};

export default Vods;
