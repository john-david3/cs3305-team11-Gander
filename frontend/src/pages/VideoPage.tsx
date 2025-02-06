import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Button, { ToggleButton } from "../components/Layout/Button";
import ChatPanel from "../components/Video/ChatPanel";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import VideoPlayer from "../components/Video/VideoPlayer";
import { SocketProvider } from "../context/SocketContext";

interface VideoPageProps {
  streamerId: number;
}

interface StreamDataProps {
  streamTitle: string;
  streamerName: string;
  startTime: string;
  categoryName: string;
}

const VideoPage: React.FC<VideoPageProps> = ({ streamerId }) => {
  const { isLoggedIn } = useAuth();
  const { streamerName } = useParams<{ streamerName: string }>();
  const [streamData, setStreamData] = useState<StreamDataProps>();
  const [viewerCount, setViewerCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(true);
  // const [showCheckout, setShowCheckout] = useState(false);
  // const showReturn = window.location.search.includes("session_id");
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Prevent scrolling when checkout is open
  //   if (showCheckout) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "unset";
  //   }
  //   // Cleanup function to ensure overflow is restored when component unmounts
  //   return () => {
  //     document.body.style.overflow = "unset";
  //   };
  // }, [showCheckout]);
  useEffect(() => {
    // Fetch stream data for this streamer
    fetch(`/api/streams/${streamerId}/data`).then((res) => {
      if (!res.ok) {
        console.error("Failed to load stream data:", res.statusText);
      }
      res
        .json()
        .then((data) => {
          // Transform snake_case to camelCase
          const transformedData: StreamDataProps = {
            streamerName: data.username,
            streamTitle: data.title,
            startTime: data.start_time,
            categoryName: data.category_name,
          };
          setStreamData(transformedData);
        })
        .catch((error) => {
          console.error("Error fetching stream data:", error);
        });
    });
  }, [streamerId]);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <SocketProvider>
      <div id="videoPage" className="w-full">
        <Navbar />

        <div
          id="container"
          className={`grid ${
            isChatOpen ? "w-[100vw]" : "w-[125vw]"
          } grid-rows-[auto_1fr] bg-gray-900 h-full grid-cols-[auto_25vw] transition-all`}
        >
          <div className="relative">
            <VideoPlayer streamId={streamerId} />
          </div>

          <ToggleButton
            onClick={toggleChat}
            toggled={isChatOpen}
            extraClasses="absolute top-[70px] right-[20px] text-[1rem] flex items-center flex-nowrap"
          >
            {isChatOpen ? "Hide Chat" : "Show Chat"}
          </ToggleButton>

          <ChatPanel
            streamId={streamerId}
            onViewerCountChange={(count: number) => setViewerCount(count)}
          />

          <div
            id="stream-info"
            className="flex flex-col gap-2 p-4 text-white"
            style={{ gridArea: "2 / 1 / 3 / 2" }}
          >
            <h1 className="text-2xl font-bold">
              {streamData ? streamData.streamTitle : "Loading..."}
            </h1>
            <div className="flex flex-col gap-2">
              <div
                id="streamer"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate(`/user/${streamerName}`)}
              >
                <img
                  src="/images/monkey.png"
                  alt="streamer"
                  className="w-10 h-10 bg-indigo-500 rounded-full"
                />
                <span>
                  {streamData ? streamData.streamerName : "Loading..."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Viewer Count:</span>
                <span>{viewerCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Started At:</span>
                <span>
                  {streamData
                    ? new Date(streamData.startTime).toLocaleString()
                    : "Loading..."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Category ID:</span>
                <span>
                  {streamData ? streamData.categoryName : "Loading..."}
                </span>
              </div>
            </div>
            {isLoggedIn && (
              <Button extraClasses="mx-auto mb-4">Payment Screen Test</Button>
            )}
          </div>
        </div>
        {/* {showCheckout && <CheckoutForm onClose={() => setShowCheckout(false)} />} */}
        {/* {showReturn && <Return />} */}
      </div>
    </SocketProvider>
  );
};

export default VideoPage;
