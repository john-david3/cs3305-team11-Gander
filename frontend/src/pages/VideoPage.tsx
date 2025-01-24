import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Button from "../components/Layout/Button";
import CheckoutForm, { Return } from "../components/Checkout/CheckoutForm";
import { useParams } from "react-router-dom";

const VideoPage: React.FC = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const showReturn = window.location.search.includes("session_id");
  const { streamerName } = useParams<{ streamerName: string }>();

  useEffect(() => {
    // Prevent scrolling when checkout is open
    if (showCheckout) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function to ensure overflow is restored when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCheckout]);
  useEffect(() => {
    if (streamerName) {
      // Fetch stream data for this streamer
      console.log(`Loading stream for ${streamerName}`);
      // fetch(`/api/streams/${streamerName}`)
    }
  }, [streamerName]);

  return (
    <div className="text-5xl text-red-600 flex flex-col justify-evenly align-center h-screen text-center">
      <Navbar />

      <h1>
        Hello! Welcome to the soon-to-be-awesome Video Page where you'll watch
        the best streams ever!
      </h1>
      <Button onClick={() => setShowCheckout(true)}>Payment Screen Test</Button>

      {showCheckout && <CheckoutForm onClose={() => setShowCheckout(false)} />}
      {showReturn && <Return />}
    </div>
  );
};

export default VideoPage;
