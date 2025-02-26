import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Input/Button";
import SearchBar from "../components/Input/SearchBar";
import ListRow from "../components/Layout/ListRow";
import DynamicPageContent from "../components/Layout/DynamicPageContent";

const ResultsPage: React.FC = ({ }) => {
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

  return (
    <DynamicPageContent id="results-page" navbarVariant="no-searchbar">
      <div className="flex flex-col items-center justify-evenly gap-4 p-4">
        <h1 className="text-3xl font-bold mb-4">
          Search results for "{query}"
        </h1>
        <SearchBar value={query} />

        <div id="results" className="flex flex-col flex-grow gap-10 w-full">
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
            extraClasses="min-h-[calc((20vw+20vh)/4)] bg-[var(--liveNow)]"
            itemExtraClasses="min-w-[calc(12vw+12vh/2)]"
            amountForScroll={3}
          />

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
            extraClasses="min-h-[calc((20vw+20vh)/4)] bg-[var(--liveNow)]"
            itemExtraClasses="min-w-[calc(12vw+12vh/2)]"
            amountForScroll={3}
          />

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
            extraClasses="min-h-[calc((20vw+20vh)/4)] bg-[var(--liveNow)]"
            itemExtraClasses="min-w-[calc(12vw+12vh/2)]"
          />
        </div>

        <div
          className={`${overflow && "absolute top-[5vh] right-[2vw]"
            } flex gap-[2vw]`}
        >
        </div>
      </div>
    </DynamicPageContent>
  );
};

export default ResultsPage;
