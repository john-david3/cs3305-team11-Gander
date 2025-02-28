import React, { useState, useEffect } from "react";
import type { Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

interface CheckoutFormProps {
  streamerID: number;
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ streamerID, onClose }) => {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      const { loadStripe } = await import("@stripe/stripe-js");
      setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
    };
    initializeStripe();
  }, []);

  const fetchClientSecret = () => {
    return fetch(`/api/create-checkout-session?streamer_id=${streamerID}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  };

  const options = { fetchClientSecret };

  return (
    <>
      <div
        id="blurring-layer"
        className="fixed z-50 inset-0 w-screen h-screen backdrop-blur-sm"
      ></div>
      <div
        id="modal-container"
        className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 h-[70vh] m-auto w-fit py-[50px] px-[100px] rounded-[2rem]"
      >
        <button
          onClick={onClose}
          className="absolute top-[1rem] right-[3rem] text-[2rem] text-white hover:text-red-500 font-black hover:text-[2.5rem] transition-all"
        >
          ✕
        </button>
        <div
          className="bg-white p-6 w-full max-w-2xl relative h-full rounded-[2rem]"
          style={{ width: "clamp(300px, 60vw, 800px)" }}
        >
          <div id="checkout" className="h-full overflow-auto min-w-[30vw]">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
