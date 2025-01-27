import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Button from "../components/Layout/Button";
import ChatPanel from "../components/Video/ChatPanel";
import CheckoutForm, { Return } from "../components/Checkout/CheckoutForm";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import VideoPlayer from "../components/Video/VideoPlayer";

interface VideoPageProps {
  streamId: number;
}

const VideoPage: React.FC<VideoPageProps> = ({ streamId }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const showReturn = window.location.search.includes("session_id");
  const { streamerName } = useParams<{ streamerName: string }>();
  const { isLoggedIn } = useAuth();

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
    if (streamerName) {
      // Fetch stream data for this streamer
      console.log(`Loading stream for ${streamerName}`);
      // fetch(`/api/get_stream_data/${streamId}`)
    }
  }, [streamerName]);

  return (
    <div id="videoPage" className="w-full">
      <Navbar />

      <div id="container" className="bg-gray-900">
        <VideoPlayer streamId={streamId} />

        {isLoggedIn ? (
          <ChatPanel streamId={streamId} />
        ) : (
          <ChatPanel streamId={streamId} />
        )}

        <div
          id="stream-info"
          className="flex"
          style={{ gridArea: "3 / 1 / 4 / 2" }}
        >
          <Button onClick={() => setShowCheckout(true)} extraClasses="mx-auto mb-4">
            Payment Screen Test
          </Button>
        </div>
      </div>

      {showCheckout && <CheckoutForm onClose={() => setShowCheckout(false)} />}
      {showReturn && <Return />}
    </div>
  );
};

export default VideoPage;
