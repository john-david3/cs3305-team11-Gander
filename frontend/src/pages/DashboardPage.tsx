import React, { useState, useEffect } from "react";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { useAuth } from "../context/AuthContext";
import StreamDashboard from "../components/Stream/StreamDashboard";
import { CircleDotIcon as RecordIcon, SquarePlayIcon as PlaybackIcon, Undo2Icon } from "lucide-react";
import VodsDashboard from "../components/Stream/VodsDashboard";
import { useVods } from "../hooks/useContent";

interface DashboardPageProps {
	tab?: "dashboard" | "stream" | "vod";
}

const DashboardPage: React.FC<DashboardPageProps> = ({ tab = "dashboard" }) => {
	const { username, isLive, userId } = useAuth();
	const { vods } = useVods(`/api/vods/${username}`);
	const [selectedTab, setSelectedTab] = useState<"dashboard" | "stream" | "vod">(tab);

	const colors = {
		stream: "red-500",
		vod: "green-500",
		dashboard: "white",
	};

	return (
		<DynamicPageContent className="flex flex-col min-h-screen bg-gradient-radial from-purple-600 via-blue-900 to-black">
			<div id="dashboard" className="flex flex-col justify-evenly items-center h-full text-white">
				<div className="flex w-full px-[10vw]">
					{selectedTab != "dashboard" && (
						<Undo2Icon
							size={50}
							className={`absolute cursor-pointer hover:text-${colors[selectedTab]} transition-all`}
							onClick={() => setSelectedTab("dashboard")}
						/>
					)}
					<h1 className="text-5xl w-full cursor-default text-center">
						Welcome <em className="text-[--bg-color] font-black">{username}</em>
					</h1>
				</div>
				<h2 className={`text-${colors[selectedTab]} cursor-default text-4xl text-center font-bold bg-black/30 rounded-full px-4 py-2 my-4`}>
					{selectedTab === "stream" ? "Streaming" : selectedTab === "vod" ? "VODs" : "Dashboard"}
				</h2>

				{selectedTab == "dashboard" ? (
					<div id="tab-select" className="flex justify-evenly items-center h-full w-full text-[calc((4vh+4vw)/2)] font-bold">
						<div
							id="stream-tab"
							className={`relative ${
								isLive ? "bg-[#ff0000] hover:bg-[#ff0000]/80" : "bg-black/30 hover:bg-black/40"
							} flex flex-col justify-evenly items-center text-center w-[50vh] h-[50vh] rounded-xl cursor-pointer hover:scale-105 transition-all bg-`}
							onClick={() => setSelectedTab("stream")}
						>
							{isLive && (
								<div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-white text-[#ff0000] text-[2rem] font-black tracking-widest py-1 sm:px-5 px-4 z-30 flex items-center justify-center rounded-tr-xl rounded-bl-xl rounded-tl-xl rounded-br-xl">
									LIVE
								</div>
							)}
							<RecordIcon color={isLive ? "white" : "red"} size={100} />
							<h1>Streaming</h1>
						</div>
						<div
							id="vod-tab"
							className="relative flex flex-col justify-evenly items-center bg-black/30 hover:bg-black/40 text-white w-[50vh] h-[50vh] rounded-xl cursor-pointer hover:scale-105 transition-all"
							onClick={() => vods.length > 0 && setSelectedTab("vod")}
						>
							<PlaybackIcon size={100} />
							<h1 className="text-white">VODs</h1>
							<h3 className={`${vods.length > 0 ? "text-white" : "text-gray-600"} absolute bottom-5 text-sm`}>
								{vods.length} VOD{vods.length != 1 && "s"} available
							</h3>
						</div>
					</div>
				) : selectedTab === "stream" && username && userId ? (
					<StreamDashboard username={username} userId={userId} isLive={isLive} />
				) : (
					<VodsDashboard vods={vods} />
				)}
			</div>
		</DynamicPageContent>
	);
};

export default DashboardPage;
