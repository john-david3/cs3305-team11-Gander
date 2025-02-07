import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  streamId: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ streamId }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Makes sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video");
      videoElement.classList.add(
        "video-js",
        "vjs-big-play-centered",
        "w-full",
        "h-full",
      );
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: true,
        fluid: true,
        responsive: true,
        // autoplay: true,
        loop: true,
        aspectRatio: "16:9",
        sources: [
          {
            src: `/images/sample_game_video.mp4`,
            // type: "application/x-mpegURL",
            type: "video/mp4",
          },
        ],
      });
    }

    // Dispose the Video.js player when the component unmounts
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamId]);

  return (
    <div
      id="video-container"
      className="min-w-[65vw] w-full h-full flex justify-center items-center bg-gray-900 rounded-lg"
      style={{ gridArea: "1 / 1 / 2 / 2" }}
    >
      <div ref={videoRef} id="video-player" className="w-full max-w-[80vw] self-center" />
    </div>
  );
};

export default VideoPlayer;
