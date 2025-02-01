import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Button from "../components/Layout/Button";
import ChatPanel from "../components/Video/ChatPanel";
// import CheckoutForm, { Return } from "../components/Checkout/CheckoutForm";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import VideoPlayer from "../components/Video/VideoPlayer";
import { SocketProvider } from "../context/SocketContext";

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
  categoryName: string;
}

const VideoPage: React.FC<VideoPageProps> = ({ streamId }) => {
  const { isLoggedIn } = useAuth();
  const { streamerName } = useParams<{ streamerName: string }>();
  const [streamData, setStreamData] = useState<StreamDataProps>();
  // const [showCheckout, setShowCheckout] = useState(false);
  // const showReturn = window.location.search.includes("session_id");
  // const navigate = useNavigate();

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
    fetch(
      `/api/get_stream_data/${streamerName}${
        streamId == 0 ? "" : `/${streamId}`
      }`
    ).then((res) => {
      if (!res.ok) {
        console.error("Failed to load stream data:", res.statusText);
      }
      res
        .json()
        .then((data) => {
          // Transform snake_case to camelCase
          const transformedData: StreamDataProps = {
            streamId: streamId,
            streamerName: data.username,
            streamerId: data.user_id,
            streamTitle: data.title,
            startTime: data.start_time,
            viewerCount: data.num_viewers,
            categoryName: data.category_name,
          };
          setStreamData(transformedData);
        })
        .catch((error) => {
          console.error("Error fetching stream data:", error);
        });
    });
  }, [streamId, streamerName]);

  return (
    <SocketProvider>
      <div id="videoPage" className="w-full">
        <Navbar />
        <div id="container" className="bg-gray-900">
          <VideoPlayer streamId={streamId} />
          <div
            id="chat"
            className="relative top-0 right-0 bg-gray-800 bg-opacity-75 text-white p-4 w-1/3 h-full z-10 overflow-y-auto"
          >
            <ChatPanel streamId={streamId} />
          </div>
          <div
            id="stream-info"
            className="flex flex-col gap-2 p-4 text-white"
            style={{ gridArea: "3 / 1 / 4 / 2" }}
          >
            <h1 className="text-2xl font-bold">
              {streamData ? streamData.streamTitle : "Loading..."}
            </h1>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Streamer:</span>
                <span>
                  {streamData ? streamData.streamerName : "Loading..."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Viewer Count:</span>
                <span>{streamData ? streamData.viewerCount : "0"}</span>
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
