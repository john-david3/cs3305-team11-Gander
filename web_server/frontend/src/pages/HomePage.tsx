import React, { useState, useEffect } from "react";
// import { data, Link } from "react-router-dom";
// import { Search, User, LogIn } from "lucide-react";

const HomePage: React.FC = () => {
  const [featuredStreams, setFeaturedStreams] = useState([{}]);

  //! ↓↓ runs twice when in development mode
  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_streams")
      .then((response) => response.json())
      .then((data) => {
        setFeaturedStreams(data);
        console.log(data);
      });
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <span>G</span>
          <span>A</span>
          <span>N</span>
          <span>D</span>
          <span>E</span>
          <span>R</span>
        </div>
        <div className="nav-buttons">
          <button className="nav-button">☰</button>
          <button className="nav-button">⚙️</button>
        </div>
      </nav>

      <div className="tagline">Behold, your next great watch!</div>

      <div className="search-container">
        {/* <input type="text" className="search-bar" placeholder="🔍 Search..."> */}
      </div>

      <h2 className="section-title">Live Now</h2>
      <div className="streams-grid">
        {featuredStreams.map((stream: any) => (
          <div className="stream-card">
            <img
              src="/assets/images/dance_game.png"
              alt="Stream thumbnail"
              className="stream-thumbnail"
            />
            <div className="stream-info">
              <div className="streamer">
                <span className="streamer-name">{stream.streamer}</span>
              </div>
              <div className="stream-title">{stream.title}</div>
              <div className="viewer-count">{stream.viewers} viewers</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Trending Categories</h2>
      <div className="categories-grid">
        <div className="category-card"></div>
        <div className="category-card"></div>
        <div className="category-card"></div>
        <div className="category-card"></div>
        <div className="category-card"></div>
      </div>
    </div>
  );
};

export default HomePage;
