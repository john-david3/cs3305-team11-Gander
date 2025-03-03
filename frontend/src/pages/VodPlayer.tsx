import React from "react";
import { useParams } from "react-router-dom";

const VodPlayer: React.FC = () => {
  const params = useParams<{ vod_id?: string; username?: string }>();
  const vod_id = params.vod_id || "unknown";
  const username = params.username || "unknown";

  const videoUrl = `/vods/${username}/${vod_id}.mp4`;

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Watching VOD {vod_id}</h1>
      <video controls className="w-full max-w-4xl rounded-lg shadow-lg">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VodPlayer;
