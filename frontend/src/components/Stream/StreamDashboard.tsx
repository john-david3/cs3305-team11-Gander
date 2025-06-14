import React, { useState, useEffect } from "react";
import Button from "../../components/Input/Button";
import Input from "../../components/Input/Input";
import { useCategories } from "../../hooks/useContent";
import { X as CloseIcon, Eye as ShowIcon, EyeOff as HideIcon } from "lucide-react";
import { debounce } from "lodash";
import VideoPlayer from "../../components/Stream/VideoPlayer";
import { CategoryType } from "../../types/CategoryType";
import { StreamListItem } from "../../components/Layout/ListItem";
import { getCategoryThumbnail } from "../../utils/thumbnailUtils";
import { StreamType } from "../../types/StreamType";

interface StreamData extends Omit<StreamType, "type" | "username" | "id"> {
	streamKey: string;
}

interface StreamDashboardProps {
	username: string;
	userId: number;
	isLive: boolean;
}

const StreamDashboard: React.FC<StreamDashboardProps> = ({ username, userId, isLive }) => {
	const [streamData, setStreamData] = useState<StreamData>({
		title: "",
		streamCategory: "",
		viewers: 0,
		startTime: "",
		streamKey: "",
	});
	const [timeStarted, setTimeStarted] = useState("");
	const [streamDetected, setStreamDetected] = useState(false);
	const [isCategoryFocused, setIsCategoryFocused] = useState(false);
	const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>([]);
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [thumbnailPreview, setThumbnailPreview] = useState<{
		url: string;
		isCustom: boolean;
	}>({ url: "", isCustom: false });
	const [debouncedCheck, setDebouncedCheck] = useState<Function | null>(null);
	const [showKey, setShowKey] = useState(false);

	const { categories } = useCategories("/api/categories/popular/100");

	useEffect(() => {
		// Set filtered categories when categories load
		if (categories.length > 0) {
			setFilteredCategories(categories);
		}
	}, [categories]);

	useEffect(() => {
		const categoryCheck = debounce((categoryName: string) => {
			const isValidCategory = categories.some((cat: CategoryType) => cat.title.toLowerCase() === categoryName.toLowerCase());

			if (isValidCategory && !thumbnailPreview.isCustom) {
				const defaultThumbnail = getCategoryThumbnail(categoryName);
				setThumbnailPreview({ url: defaultThumbnail, isCustom: false });
			}
		}, 300);

		setDebouncedCheck(() => categoryCheck);

		return () => {
			categoryCheck.cancel();
		};
	}, [categories, thumbnailPreview.isCustom]);

	useEffect(() => {
		if (username) {
			checkStreamStatus();
		}
	}, [username]);

	const checkStreamStatus = async () => {
		try {
			if (isLive) {
				const streamResponse = await fetch(`/api/streams/${userId}/data`, { credentials: "include" });
				const data = await streamResponse.json();
				setStreamData({
					title: data.title,
					streamCategory: data.category_name,
					viewers: data.num_viewers,
					startTime: data.start_time,
					streamKey: data.stream_key,
				});

				const time = Math.floor(
					(Date.now() - new Date(data.start_time).getTime()) / 60000 // Convert to minutes
				);

				if (time < 60) setTimeStarted(`${time}m ago`);
				else if (time < 1440) setTimeStarted(`${Math.floor(time / 60)}h ${time % 60}m ago`);
				else setTimeStarted(`${Math.floor(time / 1440)}d ${Math.floor((time % 1440) / 60)}h ${time % 60}m ago`);
			} else {
				// Just need the stream key if not streaming
				const response = await fetch(`/api/user/${username}/stream_key`, { credentials: "include" });
				const keyData = await response.json();
				setStreamData((prev) => ({
					...prev,
					streamKey: keyData.stream_key,
				}));
			}
		} catch (error) {
			console.error("Error checking stream status:", error);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setStreamData((prev) => ({ ...prev, [name]: value }));

		if (name === "streamCategory") {
			const filtered = categories.filter((cat: CategoryType) => cat.title.toLowerCase().includes(value.toLowerCase()));
			setFilteredCategories(filtered);
			if (debouncedCheck) {
				debouncedCheck(value);
			}
		}
	};

	const handleCategorySelect = (categoryName: string) => {
		console.log("Selected category:", categoryName);
		setStreamData((prev) => ({ ...prev, streamCategory: categoryName }));
		setFilteredCategories([]);
		if (debouncedCheck) {
			debouncedCheck(categoryName);
		}
	};

	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setThumbnail(file);
			setThumbnailPreview({
				url: URL.createObjectURL(file),
				isCustom: true,
			});
		} else {
			setThumbnail(null);
			if (streamData.streamCategory && debouncedCheck) {
				debouncedCheck(streamData.streamCategory);
			} else {
				setThumbnailPreview({ url: "", isCustom: false });
			}
		}
	};

	const clearThumbnail = () => {
		setThumbnail(null);
		if (streamData.streamCategory) {
			console.log("Clearing thumbnail as category is set and default category thumbnail will be used");
			const defaultThumbnail = getCategoryThumbnail(streamData.streamCategory);
			setThumbnailPreview({ url: defaultThumbnail, isCustom: false });
		} else {
			setThumbnailPreview({ url: "", isCustom: false });
		}
	};

	const isFormValid = () => {
		return (
			streamData.title.trim() !== "" &&
			streamData.streamCategory.trim() !== "" &&
			categories.some((cat: CategoryType) => cat.title.toLowerCase() === streamData.streamCategory.toLowerCase()) &&
			streamDetected
		);
	};

	const handlePublishStream = async () => {
		console.log("Starting stream with data:", streamData);

		const formData = new FormData();
		formData.append("data", JSON.stringify(streamData));

		try {
			const response = await fetch("/api/publish_stream", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				console.log("Stream published successfully");
				window.location.reload();
			} else if (response.status === 403) {
				console.error("Unauthorized - Invalid stream key or already streaming");
			} else {
				console.error("Failed to publish stream");
			}
		} catch (error) {
			console.error("Error publishing stream:", error);
		}
	};

	const handleUpdateStream = async () => {
		console.log("Updating stream with data:", streamData);

		const formData = new FormData();
		formData.append("key", streamData.streamKey);
		formData.append("title", streamData.title);
		formData.append("streamCategory", streamData.streamCategory);
		if (thumbnail) {
			formData.append("thumbnail", thumbnail);
		}

		try {
			const response = await fetch("/api/update_stream", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				console.log("Stream updated successfully");
				window.location.reload();
			} else {
				console.error("Failed to update stream");
			}
		} catch (error) {
			console.error("Error updating stream:", error);
		}
	};

	const handleEndStream = async () => {
		console.log("Ending stream...");

		try {
			const response = await fetch("/api/end_stream", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ key: streamData.streamKey }),
			});

			if (response.ok) {
				console.log("Stream ended successfully");
				window.location.reload();
			} else {
				console.error("Failed to end stream");
			}
		} catch (error) {
			console.error("Error ending stream:", error);
		}
	};

	return (
		<div className="flex flex-col flex-grow mx-auto px-4">
			<div className="flex flex-grow gap-8 items-stretch pb-4">
				{/* Left side - Stream Settings */}
				<div className="flex flex-col flex-grow">
					<h2 className="text-center text-2xl font-bold text-white mb-4">Stream Settings</h2>
					<div className="flex flex-col flex-grow justify-evenly space-y-6 bg-gray-800 rounded-lg p-6 shadow-xl">
						<div>
							<label className="block text-white mb-2">Stream Title</label>
							<Input
								name="title"
								value={streamData.title}
								onChange={handleInputChange}
								placeholder="Enter your stream title"
								extraClasses="w-[70%] focus:w-[70%]"
								maxLength={50}
							/>
						</div>

						<div className="relative">
							<label className="block text-white mb-2">Category</label>
							<Input
								name="streamCategory"
								value={streamData.streamCategory}
								onChange={handleInputChange}
								onFocus={() => setIsCategoryFocused(true)}
								onBlur={() => setTimeout(() => setIsCategoryFocused(false), 200)}
								placeholder="Select or type a category"
								extraClasses="w-[70%] focus:w-[70%]"
								maxLength={50}
								autoComplete="off"
								type="search"
							/>
							{isCategoryFocused && filteredCategories.length > 0 && (
								<div className="absolute z-10 w-full bg-gray-700 mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto">
									{filteredCategories.map((category) => (
										<div
											key={category.title}
											className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
											onClick={() => handleCategorySelect(category.title)}
										>
											{category.title}
										</div>
									))}
								</div>
							)}
						</div>

						<div>
							<label className="block text-white mb-2">Stream Thumbnail</label>
							<div className="relative flex flex-row items-center justify-center">
								<input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" id="thumbnail-upload" />
								<label
									htmlFor="thumbnail-upload"
									className="cursor-pointer inline-block bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
								>
									{thumbnail ? "Change Thumbnail" : "Choose Thumbnail"}
								</label>
								<span className="ml-3 text-gray-400">{thumbnail ? thumbnail.name : "No file selected"}</span>
								{thumbnailPreview.isCustom && (
									<button
										onClick={clearThumbnail}
										className="absolute right-0 top-0 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
									>
										<CloseIcon size={16} className="text-white" />
									</button>
								)}
							</div>
							{!thumbnailPreview.isCustom && (
								<p className="text-gray-400 mt-2 text-sm text-center">No thumbnail selected - the default category image will be used</p>
							)}
						</div>

						{isLive && (
							<div className="bg-gray-700 p-4 rounded-lg">
								<h3 className="text-white font-semibold mb-2">Stream Info</h3>
								<p className="text-gray-300">Viewers: {streamData.viewers}</p>
								<p className="text-gray-300">
									Started: {new Date(streamData.startTime!).toLocaleTimeString()}
									{` (${timeStarted})`}
								</p>
							</div>
						)}
						<div className="flex items-center mx-auto p-10 bg-gray-900 w-fit rounded-xl py-4">
							<label className="block text-white mr-8">Stream Key</label>
							<Input type={showKey ? "text" : "password"} value={streamData.streamKey} readOnly extraClasses="w-fit pr-[30px]" disabled />
							<button type="button" onClick={() => setShowKey(!showKey)} className="-translate-x-[30px] top-1/2 h-6 w-6 text-white">
								{showKey ? <HideIcon className="h-6 w-6" /> : <ShowIcon className="h-6 w-6" />}
							</button>
						</div>

						<div className="flex flex-col w-fit mx-auto items-center justify-center pt-6 gap-6">
							<div className="flex gap-8">
								<Button
									onClick={isLive ? handleUpdateStream : handlePublishStream}
									disabled={!isFormValid()}
									extraClasses="text-2xl px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLive ? "Update Stream" : "Start Streaming"}
								</Button>
								{isLive && (
									<Button onClick={handleEndStream} extraClasses="text-2xl px-8 py-4 hover:text-red-500 hover:border-red-500">
										End Stream
									</Button>
								)}
							</div>
							{!streamDetected && (
								<p className="text-red-500 text-sm">No stream input detected. Please start streaming using your broadcast software.</p>
							)}
						</div>
					</div>
				</div>

				{/* Right side - Preview */}
				<div className="w-[25vw] flex flex-col">
					<h2 className="text-center text-2xl font-bold text-white mb-4">Stream Preview</h2>
					<div className="flex flex-col gap-4 bg-gray-800 rounded-lg p-4 w-full h-fit flex-grow justify-around">
						<div className="flex flex-col">
							<VideoPlayer streamer={username ?? undefined} extraClasses="border border-white" onStreamDetected={setStreamDetected} />
						</div>
						<div className="flex flex-col">
							<StreamListItem
								id={1}
								title={streamData.title || "Stream Title"}
								username={username || ""}
								streamCategory={streamData.streamCategory || "Category"}
								viewers={streamData.viewers}
								thumbnail={thumbnailPreview.url || `/stream/${username}/index.png`}
								onItemClick={() => {
									window.open(`/${username}`, "_blank");
								}}
								extraClasses="max-w-[20vw]"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StreamDashboard;
