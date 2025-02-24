import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Input/Button";
import SearchBar from "../components/Input/SearchBar";
import ListRow from "../components/Layout/ListRow";
import DynamicPageContent from "../components/Layout/DynamicPageContent";

const ResultsPage: React.FC = ({}) => {
  const [overflow, setOverflow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, query } = location.state || {
    searchResults: { categories: [], users: [], streams: [] },
    query: "",
  };

  useEffect(() => {
    const checkHeight = () => {
      setOverflow(
        document.documentElement.scrollHeight + 20 > window.innerHeight
      );
    };

    checkHeight();
    window.addEventListener("resize", checkHeight);

    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  if (
    searchResults.categories.length === 0 &&
    searchResults.users.length === 0 &&
    searchResults.streams.length === 0
  ) {
    return (
      <DynamicPageContent
        id="results-page"
        navbarVariant="no-navbar"
        className="flex flex-col items-center justify-evenly min-h-[70vh] my-[15vh] p-4"
      >
        <h1 className="text-3xl font-bold mb-4">
          Search results for "{query}"
        </h1>
        <SearchBar value={query} />
        <h3 className="text-2xl text-gray-400">Nothing Found</h3>
        <div className="flex gap-8">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DynamicPageContent>
    );
  }

  return (
    <DynamicPageContent id="results-page" navbarVariant="no-navbar">
      <div className="flex flex-col items-center justify-evenly min-h-[96vh] p-4">
        <h1 className="text-3xl font-bold mb-4">
          Search results for "{query}"
        </h1>
        <SearchBar value={query} />

        <div id="results" className="flex flex-col flex-grow w-full">
          {searchResults.streams.length > 0 && (
            <ListRow
              variant="search"
              type="stream"
              items={searchResults.streams.map((stream: any) => ({
                id: stream.user_id,
                type: "stream",
                title: stream.title,
                username: stream.username,
                streamCategory: stream.category_name,
                viewers: stream.num_viewers,
                thumbnail: stream.thumbnail_url,
              }))}
              title="Streams"
              onItemClick={(streamer_name: string) =>
                (window.location.href = `/${streamer_name}`)
              }
              itemExtraClasses="min-w-[calc(12vw+12vh/2)]"
              amountForScroll={3}
            />
          )}

          {searchResults.categories.length > 0 && (
            <ListRow
              variant="search"
              type="category"
              items={searchResults.categories.map((category: any) => ({
                id: category.category_id,
                type: "category",
                title: category.category_name,
                viewers: 0,
                thumbnail: `/images/category_thumbnails/${category.category_name
                  .toLowerCase()
                  .replace(/ /g, "_")}.webp`,
              }))}
              title="Categories"
              onItemClick={(category_name: string) =>
                navigate(`/category/${category_name}`)
              }
              titleClickable={true}
              itemExtraClasses="min-w-[calc(12vw+12vh/2)]"
              amountForScroll={3}
            />
          )}

          {searchResults.users.length > 0 && (
            <ListRow
              variant="search"
              type="user"
              items={searchResults.users.map((user: any) => ({
                id: user.user_id,
                type: "user",
                title: `${user.is_live ? "🔴" : ""} ${user.username}`,
                viewers: 0,
                username: user.username,
                thumbnail: user.profile_picture,
              }))}
              title="Users"
              onItemClick={(username: string) =>
                (window.location.href = `/user/${username}`)
              }
              amountForScroll={3}
              itemExtraClasses="min-w-[calc(12vw+12vh/2)]"
            />
          )}
        </div>

        <div
          className={`${
            overflow && "absolute top-[5vh] right-[2vw]"
          } flex gap-[2vw]`}
        >
          <Button
            extraClasses="text-[2vw]"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
          <Button extraClasses="text-[2vw]" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </DynamicPageContent>
  );
};

export default ResultsPage;
