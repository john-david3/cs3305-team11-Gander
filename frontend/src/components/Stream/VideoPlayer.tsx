import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
interface VideoPlayerProps {
	streamer?: string;
	extraClasses?: string;
	onStreamDetected?: (isStreamAvailable: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ streamer, extraClasses = "", onStreamDetected }) => {
	const { streamerName: urlStreamerName } = useParams<{
		streamerName: string;
	}>();
	const videoRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<Player | null>(null);

	// Use URL param if available, otherwise fall back to prop
	const streamerName = urlStreamerName || streamer;

	useEffect(() => {
		if (!videoRef.current || !streamerName) {
			console.log("No video ref or streamer name");
			return;
		}

		const setupPlayer = async () => {
			const streamUrl = `/stream/${streamerName}/index.m3u8`;

			if (!playerRef.current) {
				const videoElement = document.createElement("video");
				videoElement.classList.add("video-js", "vjs-big-play-centered", "w-full", "h-full");
				videoElement.setAttribute("playsinline", "true");
				if (videoRef.current) {
					videoRef.current.appendChild(videoElement);
				}

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

				playerRef.current.on("loadeddata", () => {
					if (onStreamDetected) onStreamDetected(true);
				});

				playerRef.current.on("error", () => {
					console.error(`Stream failed to load: ${streamUrl}`);
					if (onStreamDetected) onStreamDetected(false);

					if (videoRef.current) {
						const errorDisplay = videoRef.current.querySelector(".vjs-error-display") as HTMLElement;
						if (errorDisplay) {
							errorDisplay.style.display = "none";
						}

						// Custom error UI
						const errorElement = document.createElement("div");
						errorElement.className =
							"absolute top-0 left-0 right-0 flex flex-col items-center justify-center h-full w-full bg-gray-800 text-white text-center p-4 rounded";
						errorElement.innerHTML = `
							<div class="text-xl mb-2">Stream Currently Unavailable</div>
							${window.location.href.includes("dashboard") ? "" : "<div class='mb - 4'>The streamer may be offline</div>"}
							<h2>Retrying...</h2>
							`;
						videoRef.current.appendChild(errorElement);
					}

					setTimeout(() => {
						console.log("Retrying stream...");
						playerRef.current?.src({
							src: streamUrl,
							type: "application/x-mpegURL",
						});
						playerRef.current?.play();

						// Remove the custom error UI before retrying
						if (videoRef.current) {
							const errorElement = videoRef.current.querySelector(".flex.flex-col");
							if (errorElement) {
								videoRef.current.removeChild(errorElement);
							}
						}
					}, 5000);
				});
			} else {
				playerRef.current.src({
					src: streamUrl,
					type: "application/x-mpegURL",
				});
				playerRef.current.play();
			}
		};

		setupPlayer();

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
			className={`relative ${extraClasses} w-full h-full mx-auto flex justify-center items-center bg-gray-900 rounded-lg`}
		>
			<div ref={videoRef} className="w-full max-w-[160vh] self-center" />
		</div>
	);
};

export default VideoPlayer;
