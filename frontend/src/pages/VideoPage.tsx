import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Button from "../components/Layout/Button";
import ChatPanel from "../components/Video/ChatPanel";
import CheckoutForm, { Return } from "../components/Checkout/CheckoutForm";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import VideoPlayer from "../components/Video/VideoPlayer";

interface VideoPageProps {
  streamId: number;
}

interface StreamDataProps {
  streamId: number;
  streamTitle: string;
  streamerName: string;
  streamerId: number;
  startTime: string;
  viewerCount: number;
  categoryId: number;
}

const VideoPage: React.FC<VideoPageProps> = ({ streamId }) => {
  const { isLoggedIn } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const showReturn = window.location.search.includes("session_id");
  const { streamerName } = useParams<{ streamerName: string }>();
  const [streamData, setStreamData] = useState<StreamDataProps>();
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent scrolling when checkout is open
    if (showCheckout) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function to ensure overflow is restored when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCheckout]);
  useEffect(() => {
    // Fetch stream data for this streamer
    fetch(
      `/api/get_stream_data/${streamerName}${
        streamId == 0 ? "" : `/${streamId}`
      }`
    ).then((res) => {
      if (!res.ok) {
        console.error("Failed to load stream data:", res.statusText);
      }
      res.json().then((data) => {
        // if (!data.validStream) navigate(`/`);
        console.log(`Loading stream data for ${streamerName}`);
        setStreamData({
          streamId: data.streamId,
          streamTitle: data.streamTitle,
          streamerName: data.streamerName,
          streamerId: data.streamerId,
          startTime: data.startTime,
          viewerCount: data.viewerCount,
          categoryId: data.categoryId,
        });
      });
    });
  }, [streamId, streamerName]);

  return (
    <div id="videoPage" className="w-full">
      <Navbar />

      <div id="container" className="bg-gray-900">
        <VideoPlayer streamId={streamId} />

        <ChatPanel streamId={streamId} />

        <div
          id="stream-info"
          className="flex"
          style={{ gridArea: "3 / 1 / 4 / 2" }}
        >
          {isLoggedIn && (
            <Button
              onClick={() => setShowCheckout(true)}
              extraClasses="mx-auto mb-4"
            >
              Payment Screen Test
            </Button>
          )}
        </div>
      </div>

      {showCheckout && <CheckoutForm onClose={() => setShowCheckout(false)} />}
      {showReturn && <Return />}
    </div>
  );
};

export default VideoPage;
