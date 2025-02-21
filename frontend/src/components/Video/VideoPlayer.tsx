import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
interface VideoPlayerProps {
  streamer?: string;
  extraClasses?: string;
  onStreamDetected?: (isStreamAvailable: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamer,
  extraClasses,
  onStreamDetected,
}) => {
  const { streamerName: urlStreamerName } = useParams<{
    streamerName: string;
  }>();
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<videojs.Player | null>(null);

  // Use URL param if available, otherwise fall back to prop
  const streamerName = urlStreamerName || streamer;

  useEffect(() => {
    if (!videoRef.current || !streamerName) return;

    const streamUrl = `/stream/${streamerName}/index.m3u8`;

    if (!playerRef.current) {
      const videoElement = document.createElement("video");
      videoElement.classList.add(
        "video-js",
        "vjs-big-play-centered",
        "w-full",
        "h-full"
      );
      videoElement.setAttribute("playsinline", "true");
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: false,
        autoplay: true,
        muted: false,
        fluid: true,
        responsive: true,
        aspectRatio: "16:9",
        liveui: false,
        sources: [
          {
            src: streamUrl,
            type: "application/x-mpegURL",
          },
        ],
      });

      playerRef.current.on('loadeddata', () => {
        if (onStreamDetected) onStreamDetected(true);
      });

      playerRef.current.on("error", () => {
        console.error(`Stream failed to load: ${streamUrl}`);
        if (onStreamDetected) onStreamDetected(false);
        setTimeout(() => {
          console.log("Retrying stream...");
          playerRef.current?.src({
            src: streamUrl,
            type: "application/x-mpegURL",
          });
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
    <div
      id="video-player"
      className={`${extraClasses} w-full h-full mx-auto flex justify-center items-center bg-gray-900 rounded-lg`}
    >
      <div ref={videoRef} className="w-full max-w-[160vh] self-center" />
    </div>
  );
};

export default VideoPlayer;
