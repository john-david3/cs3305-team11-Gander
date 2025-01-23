import React, { useState, useEffect } from "react";
import Button from "../components/Layout/Button";
import CheckoutForm, { Return } from "../components/Checkout/CheckoutForm";

const VideoPage: React.FC = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const showReturn = window.location.search.includes("session_id");

  useEffect(() => {
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

  return (
    <div className="text-5xl text-red-600 flex flex-col justify-evenly align-center h-screen text-center">
      <h1>
        Hello! Welcome to the soon-to-be-awesome Video Page where you'll watch
        the best streams ever!
      </h1>
      <Button
        title="Payment Screen Test"
        onClick={() => setShowCheckout(true)}
      />

      {showCheckout && <CheckoutForm onClose={() => setShowCheckout(false)} />}
      {showReturn && <Return />}
    </div>
  );
};

export default VideoPage;
