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
import CheckoutForm, {Return} from "../components/Checkout/CheckoutForm";

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
  const [showCheckout, setShowCheckout] = useState(false);
  const showReturn = window.location.search.includes("session_id");
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
          className={`grid ${isChatOpen ? "w-[100vw]" : "w-[125vw]"
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

          {/* Stream Data */}
          <div
            id="stream-info"
            className="flex flex-row items-center justify-between gap-4 p-4 bg-[#18181b] text-white text-lg rounded-md shadow-lg"
          >
            {/* Streamer Icon */}
            <div className="flex flex-col items-center mb-[1em]">
              <img
                src="/images/monkey.png"
                alt="streamer"
                className="w-[3em] h-[3em] rounded-full border-[0.15em] border-purple-500"
                onClick={() => navigate(`/user/${streamerName}`)}
              />
              <button
                className="text-white font-bold hover:underline mt-[0.5em]"
                onClick={() => navigate(`/user/${streamerName}`)}
              >
                {streamData ? streamData.streamerName : "Loading..."}
              </button>
            </div>

            {/* Stream Title */}
            <div className="flex flex-col items-start flex-grow">
              <h1 className="text-[0.75em] lg:text-[0.85em] xl:text-[1em] font-bold">
                {streamData ? streamData.streamTitle : "Loading..."}
              </h1>
              <span className="text-[0.75em] lg:text-[0.85em] xl:text-[1em] text-gray-400">
                {streamData ? streamData.categoryName : "Loading..."}
              </span>
            </div>

            {/* Streamer Info */}
            <div className="flex items-center gap-[0.75em] flex-col lg:flex-row">
              <div className="flex flex-col items-center lg:items-start">
                {!isFollowing ? (
                  <button
                    className="bg-purple-600 text-white font-bold px-[1.5em] py-[0.5em] rounded-md hover:bg-purple-700 text-sm"
                    onClick={() => followUser(streamerId, setShowAuthModal)}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="bg-gray-700 text-white font-bold px-[1.5em] py-[0.5em] rounded-md hover:bg-red-600 text-sm"
                    onClick={() => unfollowUser(streamerId, setShowAuthModal)}
                  >
                    Unfollow
                  </button>
                )}
              </div>
            </div>

            {/* Stream Stats */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-[0.5em]">
                <img
                  src="../../../images/icons/user.png"
                  alt="Viewers Icon"
                  className="w-[1em] h-[1em] md:w-[1.2em] md:h-[1.2em]"
                />
                <span className="font-bold text-[1.2em]">{viewerCount}</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[0.75em]">Started</span>
              <span className="text-[0.75em]">
                {streamData
                  ? `${Math.floor((Date.now() - new Date(streamData.startTime).getTime()) / 3600000)} hours ago`
                  : "Loading..."}
              </span>
            </div>

            {/* Subscribe Button */}
            <div className="flex flex-col items-center">
              <button
                className="bg-red-600 text-white font-bold px-[1.5em] py-[0.5em] rounded-md hover:bg-red-700 text-sm"
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowAuthModal(true);
                  } else {
                    setShowCheckout(true);
                  }
                }}
              >
                Subscribe
              </button>
            </div>

          </div>
          {showCheckout && <CheckoutForm onClose={() => setShowCheckout(false)} />}
          {showReturn && <Return />}
          {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
      </div>
    </SocketProvider>
  );
};

export default VideoPage;
