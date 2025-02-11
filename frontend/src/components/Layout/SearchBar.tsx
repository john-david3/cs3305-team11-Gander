import React, { useState, useEffect } from "react";
import Input from "./Input";
import { Search as SearchIcon } from "lucide-react";

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const fetchSearchResults = async () => {
        try {
          const response = await fetch("/api/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: debouncedQuery }), // <-- Fixed payload
          });
  
          const data = await response.json();
          console.log("Search results:", data);
          // Handle the search results here
        } catch (error) {
          console.error("Error performing search:", error);
        }
      };
  
      fetchSearchResults(); // Call the async function
    }
  }, [debouncedQuery]);
  

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
        extraClasses="pr-[30px] focus:outline-none focus:border-purple-500 focus:w-[30vw]"
      />

      <SearchIcon className="-translate-x-[28px] top-1/2 h-6 w-6 text-white" />
    </div>
  );
};

export default SearchBar;
