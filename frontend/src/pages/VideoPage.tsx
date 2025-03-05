import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthModal from "../components/Auth/AuthModal";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import ChatPanel from "../components/Stream/ChatPanel";
import VideoPlayer from "../components/Stream/VideoPlayer";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import { SocketProvider } from "../context/SocketContext";
import { useAuthModal } from "../hooks/useAuthModal";
import { useFollow } from "../hooks/useFollow";
import { useChat } from "../context/ChatContext";
import { StreamType } from "../types/StreamType";

// Lazy load the CheckoutForm component
const CheckoutForm = lazy(() => import("../components/Checkout/CheckoutForm"));

interface VideoPageProps {
	streamerId: number;
}

const VideoPage: React.FC<VideoPageProps> = ({ streamerId }) => {
	const { isLoggedIn, username } = useAuth();
	const { streamerName } = useParams<{ streamerName: string }>();
	const [streamData, setStreamData] = useState<StreamType>();
	const [viewerCount, setViewerCount] = useState(0);
	const { showSideBar } = useSidebar();
	const { isFollowing, checkFollowStatus, followUser, unfollowUser } = useFollow();
	const { showAuthModal, setShowAuthModal } = useAuthModal();
	const [isStripeReady, setIsStripeReady] = useState(false);
	const [showCheckout, setShowCheckout] = useState(false);
	const { showChat } = useChat();
	const navigate = useNavigate();
	const [timeStarted, setTimeStarted] = useState("");

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

	// Increment minutes of stream time every minute
	useEffect;

	useEffect(() => {
		// Fetch stream data for this streamer
		fetch(`/api/streams/${streamerId}/data`).then((res) => {
			if (!res.ok) {
				console.error("Failed to load stream data:", res.statusText);
			}
			res
				.json()
				.then((data) => {
					const transformedData: StreamType = {
						type: "stream",
						id: data.stream_id,
						username: data.username,
						title: data.title,
						startTime: data.start_time,
						streamCategory: data.category_name,
						viewers: data.viewers,
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

	// Time counter using DD:HH:MM:SS format
	useEffect(() => {
		if (!streamData?.startTime) return;

		// Initial calculation
		const startTime = new Date(streamData.startTime).getTime();

		const calculateTimeDifference = () => {
			// Get the difference in seconds
			const diffInSeconds = Math.floor((Date.now() - startTime) / 1000);

			// Calculate days, hours, minutes, seconds
			const days = Math.floor(diffInSeconds / 86400);
			const hours = Math.floor((diffInSeconds % 86400) / 3600);
			const minutes = Math.floor((diffInSeconds % 3600) / 60);
			const seconds = diffInSeconds % 60;

			// Format as DD:HH:MM:SS
			setTimeStarted(
				`${days.toString().padStart(2, "0")}:${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
					.toString()
					.padStart(2, "0")}`
			);
		};

		// Calculate immediately
		calculateTimeDifference();

		// Set up interval to update every second
		const intervalId = setInterval(calculateTimeDifference, 1000);

		// Clean up interval on component unmount
		return () => clearInterval(intervalId);
	}, [streamData?.startTime]); // Re-run if startTime changes

	// Load Stripe in the background when component mounts
	useEffect(() => {
		const loadStripe = async () => {
			await import("@stripe/stripe-js");
			setIsStripeReady(true);
		};
		loadStripe();
	}, []);

	return (
		<SocketProvider>
			<DynamicPageContent className="w-full min-h-screen">
				<div
					id="container"
					className={`bg-gray-900 h-full grid ${
						showChat
							? showSideBar
								? "w-[85vw] duration-[1s]"
								: "w-[100vw] duration-[0.5s]"
							: showSideBar
							? "w-[110vw] duration-[1s]"
							: "w-[125vw] duration-[0.5s]"
					} grid-rows-[auto_1fr] grid-cols-[auto_25vw] transition-all ease-in-out`}
				>
					<div className="relative">
						<VideoPlayer />
					</div>

					<ChatPanel streamId={streamerId} onViewerCountChange={(count: number) => setViewerCount(count)} />

					{/* Stream Data */}
					<div
						id="stream-info"
						className="flex flex-row items-center justify-between gap-4 p-4 bg-[#18181b] text-white text-lg rounded-md shadow-lg"
					>
						{/* Streamer Icon */}
						<div className="flex flex-col items-center mb-[1em]">
							<img
								src={`/user/${streamerName}/profile_picture`}
								onError={(e) => {
									e.currentTarget.src = "/images/pfps/default.png";
									e.currentTarget.onerror = null;
								}}
								alt="streamer"
								className="w-[3em] h-[3em] rounded-full border-[0.15em] border-purple-500 cursor-pointer"
								onClick={() => navigate(`/user/${streamerName}`)}
								style={{ backgroundColor: 'white' }}
							/>
							<button className="text-white font-bold hover:underline mt-[0.5em]" onClick={() => navigate(`/user/${streamerName}`)}>
								{streamerName}
							</button>
						</div>

						{/* Stream Title */}
						<div className="flex flex-col items-start flex-grow">
							<h2 className="text-[0.75em] lg:text-[0.85em] xl:text-[1em] font-bold">{streamData ? streamData.title : "Loading..."}</h2>
							<a
								href={streamData ? `/category/${streamData.streamCategory}` : "#"}
								className="text-[0.75em] lg:text-[0.85em] xl:text-[1em] text-gray-400"
							>
								{streamData ? streamData.streamCategory : "Loading..."}
							</a>
						</div>

						{/* Streamer Info */}
						<div className="flex items-center gap-[0.75em] flex-col lg:flex-row">
							<div className="group flex flex-col items-center lg:items-start">
								{!isFollowing && username === streamerName ? (
									<button
										className="bg-purple-600 text-white font-bold px-[1.5em] py-[0.5em] rounded-md hover:bg-purple-700 text-sm"
										onClick={() => followUser(streamerId, setShowAuthModal)}
									>
										Follow
									</button>
								) : (
									<button
										className="bg-gray-700 text-white font-bold px-[1.5em] py-[0.5em] rounded-md hover:bg-red-600 text-sm transition-all"
										onClick={() => unfollowUser(streamerId, setShowAuthModal)}
									>
										<span className="group-hover:hidden">Following</span>
										<span className="hidden group-hover:block">Unfollow</span>
									</button>
								)}
							</div>
						</div>

						{/* Stream Stats */}
						<div className="flex flex-col items-center">
							<div className="flex items-center gap-[0.5em]">
								<img src="/images/icons/user.png" alt="Viewers Icon" className="w-[1em] h-[1em] md:w-[1.2em] md:h-[1.2em]" />
								<span className="font-bold text-[1.2em]">{viewerCount}</span>
							</div>
						</div>

						<div className="flex flex-col items-center p-4 min-w-fit">
							<span className="text-[0.75em]">{streamData ? timeStarted : "Loading..."}</span>
						</div>

						{/* Subscribe Button */}
						<div className="flex flex-col items-center">
							<button
								className={`bg-red-600 text-white font-bold px-[1.5em] py-[0.5em] rounded-md 
    ${isStripeReady ? "hover:bg-red-700" : "opacity-20 cursor-not-allowed"} transition-all`}
								onClick={() => {
									if (!isLoggedIn) {
										setShowAuthModal(true);
									} else if (isStripeReady) {
										setShowCheckout(true);
									}
								}}
							>
								{isStripeReady ? "Subscribe" : "Loading..."}
							</button>
						</div>
					</div>
					{showCheckout && (
						<Suspense fallback={<div>Loading checkout...</div>}>
							<CheckoutForm onClose={() => setShowCheckout(false)} streamerID={streamerId} />
						</Suspense>
					)}
					{/* {showReturn && <Return />} */}
					{showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
				</div>
			</DynamicPageContent>
		</SocketProvider>
	);
};

export default VideoPage;
