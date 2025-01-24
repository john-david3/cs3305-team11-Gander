import React from "react";
import Navbar from "../components/Layout/Navbar";
import ListRow from "../components/Layout/ListRow";
import { useNavigate } from "react-router-dom";
import { useStreams } from "../context/StreamsContext";

const HomePage: React.FC = () => {
  const { featuredStreams } = useStreams();
  const navigate = useNavigate();

  const handleStreamClick = (streamerId: string) => {
    navigate(`/${streamerId}`);
  };

  return (
    <div
      className="home-page bg-repeat"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <Navbar />

      <ListRow
        title="Live Now"
        description="Streamers that are currently live"
        streams={featuredStreams}
        onStreamClick={handleStreamClick}
      />
      <ListRow
        title="Trending Categories"
        description="Categories that have been 'popping off' lately"
        streams={featuredStreams}
        onStreamClick={handleStreamClick}
      />
    </div>
  );
};

export const PersonalisedHomePage: React.FC = () => {
  const { featuredStreams } = useStreams();
  const navigate = useNavigate();

  const handleStreamClick = (streamerId: string) => {
    navigate(`/${streamerId}`);
  };

  return (
    <div
      className="home-page bg-repeat"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <Navbar />

      <ListRow
        title="Live Now - Recommended"
        description="We think you might like these streams - Streamers recommended for you"
        streams={featuredStreams}
        onStreamClick={handleStreamClick}
      />
      <ListRow
        title="Followed Categories"
        description="Current streams from your followed categories"
        streams={featuredStreams}
        onStreamClick={handleStreamClick}
      />
    </div>
  );
};

export default HomePage;
