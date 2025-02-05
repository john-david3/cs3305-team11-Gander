import React from "react";
import Navbar from "../components/Layout/Navbar";
import ListRow from "../components/Layout/ListRow";
import { useNavigate } from "react-router-dom";
import { useStreams } from "../context/StreamsContext";

interface HomePageProps {
  variant?: "default" | "personalised";
}

const HomePage: React.FC<HomePageProps> = ({ variant = "default" }) => {
  const { featuredStreams, featuredCategories } = useStreams();
  const navigate = useNavigate();

  const handleStreamClick = (streamId: number, streamerName: string) => {
    console.log(`Navigating to stream ${streamId}`);
    navigate(`/${streamerName}`);
  };

  const handleCategoryClick = (categoryID: number, categoryName: string) => {
    console.log(`Navigating to category ${categoryID}`);
    navigate(`category/${categoryName}`);
  };

  return (
    <div
      id="home-page"
      className="animate-moving_bg h-full"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <Navbar variant="home" />

      {/* If Personalised_HomePage, display Streams recommended for the logged-in user. Else, live streams with the most viewers. */}
      <ListRow
        type="stream"
        title={
          "Live Now" + (variant === "personalised" ? " - Recommended" : "")
        }
        description={
          variant === "personalised"
            ? "We think you might like these streams - Streamers recommended for you"
            : "Streamers that are currently live"
        }
        items={featuredStreams}
        onClick={handleStreamClick}
      />

      {/* If Personalised_HomePage, display Categories the logged-in user follows. Else, trending categories. */}
      <ListRow
        type="category"
        title={
          variant === "personalised"
            ? "Followed Categories"
            : "Trending Categories"
        }
        description={
          variant === "personalised"
            ? "Current streams from your followed categories"
            : "Categories that have been 'popping off' lately"
        }
        items={featuredCategories}
        onClick={handleCategoryClick}
      />
    </div>
  );
};

export default HomePage;
