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
				let processedData = processor(Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []));
				console.log("processedData", processedData);
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
	const url = customUrl || (isLoggedIn ? "/api/streams/recommended" : "/api/streams/popular/4");

	const { data, isLoading, error } = useFetchContent<StreamType>(url, processStreamData, [isLoggedIn, customUrl]);

	return { streams: data, isLoading, error };
}

export function useCategories(customUrl?: string): {
	categories: CategoryType[];
	isLoading: boolean;
	error: string | null;
} {
	const { isLoggedIn } = useAuth();
	const url = customUrl || (isLoggedIn ? "/api/categories/recommended" : "/api/categories/popular/4");

	const { data, isLoading, error } = useFetchContent<CategoryType>(url, processCategoryData, [isLoggedIn, customUrl]);

	return { categories: data, isLoading, error };
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
