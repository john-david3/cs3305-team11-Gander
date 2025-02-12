import React, { useState } from "react";
import Input from "./Input";
import { Search as SearchIcon } from "lucide-react";

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery }),
        });

        const data = await response.json();
        console.log("Search results:", data);
        // Handle the search results here
      } catch (error) {
        console.error("Error performing search:", error);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div id="search-bar" className="flex items-center">
      <Input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        extraClasses="pr-[30px] focus:outline-none focus:border-purple-500 focus:w-[30vw]"
      />
      <SearchIcon className="-translate-x-[28px] top-1/2 h-6 w-6 text-white" />
    </div>
  );
};

export default SearchBar;
