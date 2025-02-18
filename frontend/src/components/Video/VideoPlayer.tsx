import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer: React.FC = () => {
  const { streamerName } = useParams<{ streamerName: string }>(); // Get streamerName from URL
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<videojs.Player | null>(null);

  useEffect(() => {
    if (!videoRef.current || !streamerName) return;

    const streamUrl = `/stream/${streamerName}/index.m3u8`; // Updated URL with streamerName

    if (!playerRef.current) {
      const videoElement = document.createElement("video");
      videoElement.classList.add("video-js", "vjs-big-play-centered", "w-full", "h-full");
      videoElement.setAttribute("playsinline", "true");
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: true,
        muted: true,
        fluid: true,
        responsive: true,
        aspectRatio: "16:9",
        liveui: true,
        sources: [
          {
            src: streamUrl,
            type: "application/x-mpegURL",
          },
        ],
      });

      // Handle stream errors & retry
      playerRef.current.on("error", () => {
        console.error(`Stream failed to load: ${streamUrl}`);
        setTimeout(() => {
          console.log("Retrying stream...");
          playerRef.current?.src({ src: streamUrl, type: "application/x-mpegURL" });
          playerRef.current?.play();
        }, 5000);
      });
    } else {
      playerRef.current.src({ src: streamUrl, type: "application/x-mpegURL" });
      playerRef.current.play();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamerName]);

  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-900 rounded-lg">
      <div ref={videoRef} className="w-full max-w-[160vh] self-center" />
    </div>
  );
};

export default VideoPlayer;
