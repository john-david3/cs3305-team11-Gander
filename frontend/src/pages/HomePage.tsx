import React from "react";
import Navbar from "../components/Layout/Navbar";
import ListRow from "../components/Layout/ListRow";
import { useNavigate } from "react-router-dom";
import { useStreams, useCategories } from "../context/ContentContext";

interface HomePageProps {
  variant?: "default" | "personalised";
}

const HomePage: React.FC<HomePageProps> = ({ variant = "default" }) => {
  const { streams } = useStreams();
  const { categories } = useCategories();
  const navigate = useNavigate();

  const handleStreamClick = (streamerName: string) => {
    navigate(`/${streamerName}`);
  };

  const handleCategoryClick = (categoryName: string) => {
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
          "Streams - Live Now" + (variant === "personalised" ? " - Recommended" : "")
        }
        description={
          variant === "personalised"
            ? "We think you might like these streams - Streamers recommended for you"
            : "Streamers that are currently live"
        }
        items={streams}
        onClick={handleStreamClick}
        extraClasses="bg-red-950/60"
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
        items={categories}
        onClick={handleCategoryClick}
        extraClasses="bg-green-950/60"
      />
    </div>
  );
};

export default HomePage;
