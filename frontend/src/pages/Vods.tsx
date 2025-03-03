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
    <DynamicPageContent>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{username}'s VODs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownedVods.length === 0 ? (
            <p className="col-span-full text-center">No VODs available.</p>
          ) : (
            ownedVods.map((vod) => {
              const thumbnailUrl = `/stream/${username}/vods/${vod.vod_id}.png`;

              return (
                <div
                  key={vod.vod_id}
                  className="border rounded-lg p-4 bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition"
                  onClick={() => navigate(`/stream/${username}/vods/${vod.vod_id}`)}
                >
                  {/* Thumbnail */}
                  <img
                    src={thumbnailUrl}
                    alt={`Thumbnail for ${vod.title}`}
                    className="w-full h-40 object-cover rounded-md mb-2"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/default-thumbnail.png";
                    }}
                  />

                  {/* Video Info */}
                  <h2 className="text-lg font-semibold">{vod.title}</h2>
                  <p className="text-sm">📅 {new Date(vod.datetime).toLocaleString()}</p>
                  <p className="text-sm">🎮 {vod.category_name}</p>
                  <p className="text-sm">⏱ {Math.floor(vod.length / 60)} min</p>
                  <p className="text-sm">👀 {vod.views} views</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DynamicPageContent>
  );
};

export default Vods;
