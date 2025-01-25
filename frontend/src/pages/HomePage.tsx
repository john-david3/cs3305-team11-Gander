import React from "react";
import Navbar from "../components/Layout/Navbar";
import StreamListRow from "../components/Layout/StreamListRow";
import { useNavigate } from "react-router-dom";
import { useStreams } from "../context/StreamsContext";

const HomePage: React.FC = () => {
  const { featuredStreams, featuredCategories } = useStreams();
  const navigate = useNavigate();

  const handleStreamClick = (streamId: number, streamerName: string) => {
    console.log(`Navigating to ${streamId}`);
    navigate(`/${streamerName}`);
  };

  return (
    <div
      id="home-page"
      className="bg-repeat"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <Navbar variant="home" />

      <StreamListRow
        title="Live Now"
        description="Streamers that are currently live"
        streams={featuredStreams}
        onStreamClick={handleStreamClick}
      />
      <StreamListRow
        title="Trending Categories"
        description="Categories that have been 'popping off' lately"
        streams={featuredCategories}
        onStreamClick={() => {}} //TODO
      />
    </div>
  );
};

export const PersonalisedHomePage: React.FC = () => {
  const { featuredStreams, featuredCategories } = useStreams();
  const navigate = useNavigate();

  const handleStreamClick = (streamId: number, streamerName: string) => {
    console.log(`Navigating to ${streamId}`);
    navigate(`/${streamerName}`);
  };

  return (
    <div
      id="personalised-home-page"
      className="bg-repeat"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <Navbar variant="home" />
      {/*//TODO Extract StreamListRow away to ListRow so that it makes sense for categories to be there also */}
      <StreamListRow
        title="Live Now - Recommended"
        description="We think you might like these streams - Streamers recommended for you"
        streams={featuredStreams}
        onStreamClick={handleStreamClick}
      />
      <StreamListRow
        title="Followed Categories"
        description="Current streams from your followed categories"
        streams={featuredCategories}
        onStreamClick={() => {}} //TODO
      />
    </div>
  );
};

export default HomePage;
