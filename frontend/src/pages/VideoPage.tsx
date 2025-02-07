import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Button, { ToggleButton } from "../components/Layout/Button";
import ChatPanel from "../components/Video/ChatPanel";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthModal } from "../hooks/useAuthModal";
import { useAuth } from "../context/AuthContext";
import { useFollow } from "../hooks/useFollow";
import VideoPlayer from "../components/Video/VideoPlayer";
import { SocketProvider } from "../context/SocketContext";
import AuthModal from "../components/Auth/AuthModal";

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
  const { isFollowing, checkFollowStatus, followUser, unfollowUser } =
    useFollow();
  const { showAuthModal, setShowAuthModal } = useAuthModal();
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

          // Check if the logged-in user is following this streamer
          if (isLoggedIn) checkFollowStatus(data.username);
        })
        .catch((error) => {
          console.error("Error fetching stream data:", error);
        });
    });
  }, [streamerId]);

  // Keyboard shortcut to toggle chat
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "c") {
        setIsChatOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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
            extraClasses="group cursor-pointer absolute top-[70px] right-[20px] text-[1rem] flex items-center flex-nowrap"
          >
            {isChatOpen ? "Hide Chat" : "Show Chat"}
            
            <small className="absolute right-0 left-0 -bottom-0 group-hover:-bottom-5 opacity-0 group-hover:opacity-100 text-white transition-all">Press C</small>
          </ToggleButton>

          <ChatPanel
            streamId={streamerId}
            onViewerCountChange={(count: number) => setViewerCount(count)}
          />

          <div
            id="stream-info"
            className="flex flex-row items-center justify-evenly gap-2 p-8 text-white text-xl"
            style={{ gridArea: "2 / 1 / 3 / 2" }}
          >
            <h1 className="text-3xl text-center font-bold">
              {streamData ? streamData.streamTitle : "Loading..."}
            </h1>
            <div>
              <Button
                extraClasses="flex flex-col items-center font-bold bg-[#ff0000] p-4 px-12 rounded-[3rem] cursor-pointer"
                onClick={() => navigate(`/user/${streamerName}`)}
              >
                <h1>{streamData ? streamData.streamerName : "Loading..."}</h1>
                <img
                  src="/images/monkey.png"
                  alt="streamer"
                  className="w-30 h-10 bg-indigo-500 rounded-full"
                />
              </Button>

              {/* (Un)Follow Button */}
              {!isFollowing ? (
                <Button
                  extraClasses="w-full bg-purple-700 hover:bg-[#28005e]"
                  onClick={() => followUser(streamerId, setShowAuthModal)}
                >
                  Follow
                </Button>
              ) : (
                <Button
                  extraClasses="w-full bg-green-400/30 hover:content-['Unfollow'] hover:border-[#a80000]"
                  onClick={() => unfollowUser(streamerId, setShowAuthModal)}
                >
                  Following
                </Button>
              )}
            </div>
            <div className="flex flex-col items-center font-bold">
              <span className="font-thin">Viewers</span>
              <span>{viewerCount}</span>
            </div>
            <div className="flex flex-col items-center font-bold">
              <span className="font-thin">Started</span>
              <span>
                {streamData
                  ? new Date(streamData.startTime).toLocaleString()
                  : "Loading..."}
              </span>
            </div>
            <div className="flex flex-col items-center font-bold">
              <span className="font-thin">Category</span>
              <span>{streamData ? streamData.categoryName : "Loading..."}</span>
            </div>
          </div>
          {isLoggedIn && (
            <Button extraClasses="mx-auto mb-4">Payment Screen Test</Button>
          )}
        </div>
        {/* {showCheckout && <CheckoutForm onClose={() => setShowCheckout(false)} />} */}
        {/* {showReturn && <Return />} */}
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    </SocketProvider>
  );
};

export default VideoPage;
