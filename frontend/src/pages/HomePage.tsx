import React from "react";
import Navbar from "../components/Layout/Navbar";
import StreamListRow from "../components/Layout/StreamListRow";
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
      className="animate-moving_bg"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <Navbar variant="home" />

      {/*//TODO Extract StreamListRow away, to ListRow so that it makes sense for categories to be there also */}

      <StreamListRow
        title={"Live Now" + (variant === "personalised" ? " - Recommended" : "")}
        description={variant === "personalised" ? "We think you might like these streams - Streamers recommended for you" : "Streamers that are currently live"}
        streams={featuredStreams}
        onStreamClick={handleStreamClick}
      />
      <StreamListRow
        title={variant === "personalised" ? "Followed Categories" : "Trending Categories"}
        description={variant === "personalised" ? "Current streams from your followed categories" : "Categories that have been 'popping off' lately"}
        streams={featuredCategories}
        onStreamClick={() => {}} //TODO
      />

    </div>
  );
};

export default HomePage;
