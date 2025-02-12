import React, { useState } from "react";
import Input from "./Input";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
<<<<<<< HEAD
  //const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const navigate = useNavigate();

  // Debounce the search query
  {/*
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]); */}

  // Perform search when debounced query changes
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }), // <-- Fixed payload
      });

      const data = await response.json();
      console.log("Search results:", data);

      navigate("/results", { state: { searchResults: data, query: searchQuery } });

      // Handle the search results here
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Key pressed:", e.key); // Debugging

      e.preventDefault(); // Prevent unintended form submission
      handleSearch(); // Trigger search when Enter key is pressed
    }
  };

=======

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
>>>>>>> 571cb9c0f570358236daeed97c2e969a85cd8d1e

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
<<<<<<< HEAD
        onKeyDown={handleKeyPress}
        extraClasses="pr-[30px] focus:outline-none focus:border-purple-500 focus:w-[30vw]"
      />

      

=======
        onKeyDown={handleKeyDown}
        extraClasses="pr-[30px] focus:outline-none focus:border-purple-500 focus:w-[30vw]"
      />
>>>>>>> 571cb9c0f570358236daeed97c2e969a85cd8d1e
      <SearchIcon className="-translate-x-[28px] top-1/2 h-6 w-6 text-white" />
    </div>
  );
};

export default SearchBar;
