import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import ListRow from "../components/Layout/ListRow";
// import { data, Link } from "react-router-dom";

const handleStreamClick = (streamId: string) => {
  // Handle navigation to stream page
  console.log(`Navigating to stream ${streamId}`);
};

interface StreamItem {
  id: number;
  title: string;
  streamer: string;
  viewers: number;
  thumbnail?: string;
}

const HomePage: React.FC = () => {
  const [featuredStreams, setFeaturedStreams] = useState<StreamItem[]>([]);
  const [loggedInStatus, setLoggedInStatus] = useState<boolean>(false);

  // ↓↓ runs twice when in development mode
  useEffect(() => {
    fetch("/api/get_login_status")
      .then((response) => response.json())
      .then((data) => {
        setLoggedInStatus(data);
        console.log(data);
      });
    fetch("/api/get_streams")
      .then((response) => response.json())
      .then((data: StreamItem[]) => {
        setFeaturedStreams(data);
        console.log(data);
      });
  }, []);

  return (
    <div
      className="home-page bg-repeat"
      style={{ backgroundImage: "url(/images/background-pattern.svg)" }}
    >
      <Navbar logged_in={loggedInStatus} />

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

export default HomePage;
