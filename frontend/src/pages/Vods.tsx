import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import DynamicPageContent from "../components/Layout/DynamicPageContent";

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
      <div className="mt-[3em] w-screen flex justify-center">
        <div
          id="vods-container"
          className="w-[96vw] bg-slate-50/35 rounded-lg p-4 overflow-x-auto whitespace-nowrap scrollbar-hide"
        >
          <h1 className="text-2xl font-bold text-center mb-4">{username}'s VODs</h1>
          
          {/* Horizontal Scrollable VOD List */}
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {ownedVods.length === 0 ? (
              <p className="text-center w-full">No VODs available.</p>
            ) : (
              ownedVods.map((vod) => {
                const thumbnailUrl = `/vods/${username}/${vod.vod_id}.png`;

                return (
                  <div
                    key={vod.vod_id}
                    className="w-[30.8vw] h-[30vh] flex-shrink-0 bg-gray-800 text-white rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition"
                    onClick={() => navigate(`/stream/${username}/vods/${vod.vod_id}`)}
                  >
                    {/* Thumbnail */}
                    <img
                      src={thumbnailUrl}
                      alt={`Thumbnail for ${vod.title}`}
                      className="w-full h-[150px] object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-thumbnail.png";
                      }}
                    />

                    {/* Video Info */}
                    <div className="mt-2">
                      <h2 className="text-lg font-bold">{vod.title}</h2>
                      <p className="text-sm text-gray-300">{username}</p>
                      <p className="text-sm text-gray-400">{vod.views} views</p>
                      <p className="text-xs text-gray-400">{new Date(vod.datetime).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DynamicPageContent>
  );
};

export default Vods;
