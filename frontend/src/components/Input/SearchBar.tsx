// In SearchBar.tsx
import React, { useState, useEffect } from "react";
import Input from "./Input";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
	value?: string;
  onSearchResults?: (results: any, query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value = "", onSearchResults }) => {
	const [searchQuery, setSearchQuery] = useState(value);
	const navigate = useNavigate();

	// Update searchQuery when value prop changes
	useEffect(() => {
		setSearchQuery(value);
	}, [value]);

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		try {
			const response = await fetch("/api/search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query: searchQuery }),
			});

			const data = await response.json();

			// If we have a callback for search results, use that instead of navigating
			if (onSearchResults) {
				onSearchResults(data, searchQuery);
			} else {
				// Otherwise navigate to results page with the data
				navigate("/results", {
					state: { searchResults: data, query: searchQuery },
				});
			}
		} catch (error) {
			console.error("Error performing search:", error);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSearch();
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	return (
		<div id="search-bar" className="flex items-center">
			<Input
				type="text"
				placeholder="Search..."
				value={searchQuery}
				onChange={handleSearchChange}
				onKeyDown={handleKeyPress}
				extraClasses="pr-[30px] focus:outline-none focus:border-purple-500 focus:w-[30vw]"
			/>

			<SearchIcon className="-translate-x-[28px] top-1/2 h-6 w-6 text-white cursor-pointer" onClick={handleSearch} />
		</div>
	);
};

export default SearchBar;
