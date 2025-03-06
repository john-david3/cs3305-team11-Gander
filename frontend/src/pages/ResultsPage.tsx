// In ResultsPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../components/Input/SearchBar";
import ListRow from "../components/Layout/ListRow";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import { getCategoryThumbnail } from "../utils/thumbnailUtils";

const ResultsPage: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();

	// Initialize with state from navigation, or empty defaults
	const [searchState, setSearchState] = useState({
		searchResults: location.state?.searchResults || { categories: [], users: [], streams: [] },
		query: location.state?.query || "",
	});

	// Handle new search results
	const handleSearchResults = (results: any, newQuery: string) => {
		console.log("New search results:", results);
		setSearchState({
			searchResults: results,
			query: newQuery,
		});

		// Update URL state without navigation
		window.history.replaceState({ searchResults: results, query: newQuery }, "", "/results");
	};

	useEffect(() => {
		// If location state changes, update our internal state
		if (location.state) {
			setSearchState({
				searchResults: location.state.searchResults,
				query: location.state.query,
			});
		}
	}, [location.state]);

	return (
		<DynamicPageContent id="results-page" navbarVariant="no-searchbar">
			<div className="flex flex-col items-center justify-evenly gap-4 p-4">
				<h1 className="text-3xl font-bold mb-4">Search results for "{searchState.query}"</h1>
				<SearchBar value={searchState.query} onSearchResults={(results, query) => handleSearchResults(results, query)} />

				<div id="results" className="flex flex-col flex-grow gap-10 w-full">
					<ListRow
						key={`stream-results-${searchState.query}`}
						variant="search"
						type="stream"
						items={searchState.searchResults.streams.map((stream: any) => ({
							id: stream.user_id,
							type: "stream",
							title: stream.title,
							username: stream.username,
							streamCategory: stream.category_name,
							viewers: stream.num_viewers,
							thumbnail: stream.thumbnail_url,
						}))}
						title="Streams"
						onItemClick={(streamer_name: string) => (window.location.href = `/${streamer_name}`)}
						extraClasses="min-h-[calc((20vw+20vh)/4)] bg-[var(--liveNow)]"
						itemExtraClasses="w-[calc(12vw+12vh/2)]"
						amountForScroll={4}
					/>

					<ListRow
						key={`category-results-${searchState.query}`}
						variant="search"
						type="category"
						items={searchState.searchResults.categories.map((category: any) => ({
							id: category.category_id,
							type: "category",
							title: category.category_name,
							viewers: 0,
							thumbnail: getCategoryThumbnail(category.category_name),
						}))}
						title="Categories"
						onItemClick={(category_name: string) => navigate(`/category/${category_name}`)}
						titleClickable={true}
						extraClasses="min-h-[calc((20vw+20vh)/4)] bg-[var(--liveNow)]"
						itemExtraClasses="w-[calc(12vw+12vh/2)]"
						amountForScroll={4}
					/>

					<ListRow
						key={`user-results-${searchState.query}`}
						variant="search"
						type="user"
						items={searchState.searchResults.users.map((user: any) => ({
							id: user.user_id,
							type: "user",
							title: `${user.is_live ? "🔴" : ""} ${user.username}`,
							username: user.username,
						}))}
						title="Users"
						onItemClick={(username: string) => (window.location.href = `/user/${username}`)}
						amountForScroll={4}
						extraClasses="min-h-[calc((20vw+20vh)/4)] bg-[var(--liveNow)]"
						itemExtraClasses="w-[calc(12vw+12vh/2)]"
					/>

					<ListRow
						key={`vod-results-${searchState.query}`}
						variant="search"
						type="vod"
						items={searchState.searchResults.vods.map((vod: any) => ({
							id: vod.vod_id,
							type: "vod",
							title: vod.title,
							username: vod.username,
							thumbnail: vod.thumbnail_url,
						}))}
						title="VODs"
						onItemClick={(username, vod_id) => navigate(`/vods/${username}/${vod_id}`)}
						amountForScroll={4}
						extraClasses="min-h-[calc((20vw+20vh)/4)] bg-[var(--liveNow)]"
						itemExtraClasses="w-[calc(12vw+12vh/2)]"
					/>
				</div>
			</div>
		</DynamicPageContent>
	);
};

export default ResultsPage;
