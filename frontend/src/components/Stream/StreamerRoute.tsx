import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPage from "../../pages/VideoPage";
import UserPage from "../../pages/UserPage";

const StreamerRoute: React.FC = () => {
  const { streamerName } = useParams<{ streamerName: string }>();
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkStreamStatus = async () => {
      try {
        const response = await fetch(`/api/streamer/${streamerName}/status`);
        const data = await response.json();
        setIsLive(data.is_live);
      } catch (error) {
        console.error("Error checking stream status:", error);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStreamStatus();

    // Poll for live status changes
    const interval = setInterval(checkStreamStatus, 20000); // Check every 20 seconds

    return () => clearInterval(interval);
  }, [streamerName]);

  if (isLoading) {
    return <div className="h-screen w-screen flex text-6xl items-center justify-center" >Loading...</div>; // Or your loading component
  }

  // streamId=0 is a special case for the streamer's latest stream
  return isLive ? <VideoPage streamId={0} /> : (streamerName ? <UserPage username={streamerName} /> : <div>Error: Streamer not found</div>);
};

export default StreamerRoute;
