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
    console.log(`Navigating to ${streamId}`);
    navigate(`/${streamerName}`);
  };

  return (
    <div
      id="home-page"
      className="animate-moving_bg h-full"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <Navbar variant="home" />

      <ListRow
        type="stream"
        title={"Live Now" + (variant === "personalised" ? " - Recommended" : "")}
        description={variant === "personalised" ? "We think you might like these streams - Streamers recommended for you" : "Streamers that are currently live"}
        items={featuredStreams}
        onClick={handleStreamClick}
      />
      <ListRow
        type="category"
        title={variant === "personalised" ? "Followed Categories" : "Trending Categories"}
        description={variant === "personalised" ? "Current streams from your followed categories" : "Categories that have been 'popping off' lately"}
        items={featuredCategories}
        onClick={() => {}} //TODO
      />

    </div>
  );
};

export default HomePage;
