import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// Initialize Stripe once
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const Return: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    if (sessionId) {
      fetch(`/api/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        });
    }
  }, []);

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
};

// Main CheckoutForm component
interface CheckoutFormProps {
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const fetchClientSecret = () => {
    return fetch(`/api/create-checkout-session`, {
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
        className="fixed z-10 inset-0 w-screen h-screen backdrop-blur-sm"
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
