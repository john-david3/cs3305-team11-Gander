import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoPage from "../../pages/VideoPage";
import LoadingScreen from "../Layout/LoadingScreen";

const StreamerRoute: React.FC = () => {
  const { streamerName } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [streamId, setStreamId] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStreamStatus = async () => {
      try {
        const response = await fetch(`/api/user/${streamerName}/status`);
        const data = await response.json();
        setIsLive(Boolean(data.is_live));
        setStreamId(data.user_id);
      } catch (error) {
        console.error("Error checking stream status:", error);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStreamStatus();

    // Poll for live status changes
    const interval = setInterval(checkStreamStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [streamerName]);

  if (isLoading) return <LoadingScreen />;

  // streamId=0 is a special case for the streamer's latest stream
  if (isLive) {
    return <VideoPage streamerId={streamId} />;
  }

  if (streamerName) {
    navigate(`/user/${streamerName}`);
    return null;
  }

  return <div>Streamer not found</div>;
};

export default StreamerRoute;
