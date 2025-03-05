// hooks/useContent.ts
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { StreamType } from "../types/StreamType";
import { CategoryType } from "../types/CategoryType";
import { UserType } from "../types/UserType";
import { VodType } from "../types/VodType";
import { getCategoryThumbnail } from "../utils/thumbnailUtils";

const processVodData = (data: any[]): VodType[] => {
	return data.map((vod) => ({
		type: "vod",
		vod_id: vod.vod_id,
		title: vod.title,
		username: vod.username,
		datetime: formatDate(vod.datetime),
		category_name: vod.category_name,
		length: formatDuration(vod.length),
		views: vod.views,
		thumbnail: vod.thumbnail, //TODO
	}));
};

// Helper function to process API data into our consistent types
const processStreamData = (data: any[]): StreamType[] => {
	if (!data || data.length === 0 || !data[0] || !data[0].user_id) return [];
	return data.map((stream) => ({
		type: "stream",
		id: stream.user_id,
		title: stream.title,
		username: stream.username,
		streamCategory: stream.category_name,
		viewers: stream.num_viewers,
		thumbnail: getCategoryThumbnail(stream.category_name, stream.thumbnail),
	}));
};

const processCategoryData = (data: any[]): CategoryType[] => {
	return data.map((category) => ({
		type: "category",
		id: category.category_id,
		title: category.category_name,
		viewers: category.num_viewers,
		thumbnail: getCategoryThumbnail(category.category_name),
	}));
};

const processUserData = (data: any[]): UserType[] => {
	return data.map((user) => ({
		type: "user",
		id: user.user_id,
		title: user.username,
		username: user.username,
		isLive: user.is_live,
		viewers: 0, // This may need to be updated based on your API
		thumbnail: user.thumbnail || "/images/pfps/default.webp",
	}));
};

// Generic fetch hook that can be used for any content type
export function useFetchContent<T>(
	url: string,
	processor: (data: any[]) => T[],
	dependencies: any[] = []
): { data: T[]; isLoading: boolean; error: string | null } {
	const [data, setData] = useState<T[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(url);

				if (!response.ok) {
					throw new Error(`Error fetching data: ${response.status}`);
				}

				const rawData = await response.json();
				let processedData = processor(Array.isArray(rawData) ? rawData : rawData ? [rawData] : []);
				setData(processedData);
				setError(null);
			} catch (err) {
				console.error("Error fetching content:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, dependencies);

	return { data, isLoading, error };
}

// Specific hooks for each content type
export function useStreams(customUrl?: string): {
	streams: StreamType[];
	isLoading: boolean;
	error: string | null;
} {
	const { isLoggedIn } = useAuth();
	const [streams, setStreams] = useState<StreamType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStreams = async () => {
			setIsLoading(true);
			try {
				// Always fetch the recommended streams if logged in
				if (isLoggedIn && !customUrl) {
					const recommendedResponse = await fetch("/api/streams/recommended");
					if (!recommendedResponse.ok) {
						throw new Error(`Error fetching recommended streams: ${recommendedResponse.status}`);
					}

					const recommendedData = await recommendedResponse.json();
					const processedRecommended = processStreamData(recommendedData);

					// If we have at least 4 recommended streams, use just those
					if (processedRecommended.length >= 4) {
						setStreams(processedRecommended);
					}
					// If we have fewer than 4, fetch popular streams to fill the gap
					else {
						const popularResponse = await fetch(`/api/streams/popular/8`);

						if (!popularResponse.ok) {
							throw new Error(`Error fetching popular streams: ${popularResponse.status}`);
						}

						const popularData = await popularResponse.json();
						const processedPopular = processStreamData(popularData);

						// Combine recommended and popular, ensuring no duplicates
						const combinedStreams = [...processedRecommended];

						// Add popular streams if they're not already in recommended
						for (const popularStream of processedPopular) {
							if (!combinedStreams.some((stream) => stream.id === popularStream.id)) {
								combinedStreams.push(popularStream);
							}
						}

						setStreams(combinedStreams);
					}
				}
				// For custom URL or not logged in, use the original approach
				else {
					const url = customUrl || "/api/streams/popular/4";
					const response = await fetch(url);

					if (!response.ok) {
						throw new Error(`Error fetching streams: ${response.status}`);
					}

					const data = await response.json();

					// Make sure it is 100% ARRAY NOT OBJECT
					const formattedData = Array.isArray(data) ? data : [data];
					setStreams(processStreamData(formattedData));
				}

				setError(null);
			} catch (err) {
				console.error("Error in useStreams:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
				// Fallback to popular streams on error
				if (!customUrl) {
					try {
						const fallbackResponse = await fetch("/api/streams/popular/4");
						if (fallbackResponse.ok) {
							const fallbackData = await fallbackResponse.json();
							setStreams(processStreamData(fallbackData));
						}
					} catch (fallbackErr) {
						console.error("Error fetching fallback streams:", fallbackErr);
					}
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchStreams();
	}, [isLoggedIn, customUrl]);
	return { streams, isLoading, error };
}

export function useCategories(customUrl?: string): {
	categories: CategoryType[];
	isLoading: boolean;
	error: string | null;
} {
	const { isLoggedIn } = useAuth();
	const [categories, setCategories] = useState<CategoryType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCategories = async () => {
			setIsLoading(true);
			try {
				// Always fetch the recommended categories if logged in
				if (isLoggedIn && !customUrl) {
					const recommendedResponse = await fetch("/api/categories/recommended");
					if (!recommendedResponse.ok) {
						throw new Error(`Error fetching recommended categories: ${recommendedResponse.status}`);
					}

					const recommendedData = await recommendedResponse.json();
					const processedRecommended = processCategoryData(recommendedData);

					// If we have at least 4 recommended categories, use just those
					if (processedRecommended.length >= 4) {
						setCategories(processedRecommended);
					}
					// If we have fewer than 4, fetch popular categories to fill the gap
					else {
						const popularResponse = await fetch(`/api/categories/popular/8`);

						if (!popularResponse.ok) {
							throw new Error(`Error fetching popular categories: ${popularResponse.status}`);
						}

						const popularData = await popularResponse.json();
						const processedPopular = processCategoryData(popularData);

						// Get IDs of recommended categories to avoid duplicates
						const recommendedIds = processedRecommended.map((cat) => cat.id);

						// Filter popular categories to only include ones not in recommended
						const uniquePopularCategories = processedPopular.filter((popularCat) => !recommendedIds.includes(popularCat.id));

						// Combine with recommended categories first to maintain priority
						const combinedCategories = [...processedRecommended, ...uniquePopularCategories];

						setCategories(combinedCategories);
					}
				}
				// For custom URL or not logged in, use the original approach
				else {
					const url = customUrl || "/api/categories/popular/4";
					const response = await fetch(url);

					if (!response.ok) {
						throw new Error(`Error fetching categories: ${response.status}`);
					}

					const data = await response.json();
					setCategories(processCategoryData(data));
				}

				setError(null);
			} catch (err) {
				console.error("Error in useCategories:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
				// Fallback to popular categories on error
				if (!customUrl) {
					try {
						const fallbackResponse = await fetch("/api/categories/popular/4");
						if (fallbackResponse.ok) {
							const fallbackData = await fallbackResponse.json();
							setCategories(processCategoryData(fallbackData));
						}
					} catch (fallbackErr) {
						console.error("Error fetching fallback categories:", fallbackErr);
					}
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchCategories();
	}, [isLoggedIn, customUrl]);

	return { categories, isLoading, error };
}

export function useVods(customUrl?: string): {
	vods: VodType[];
	isLoading: boolean;
	error: string | null;
} {
	const url = customUrl || "api/vods/all";
	const { data, isLoading, error } = useFetchContent<VodType>(url, processVodData, [customUrl]);

	return { vods: data, isLoading, error };
}

export function useUsers(customUrl?: string): {
	users: UserType[];
	isLoading: boolean;
	error: string | null;
} {
	const url = customUrl || "/api/users/popular";

	const { data, isLoading, error } = useFetchContent<UserType>(url, processUserData, [customUrl]);

	return { users: data, isLoading, error };
}

// Format duration from seconds to HH:MM:SS
const formatDuration = (seconds: number): string => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	}
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Format date to a more readable format
const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
