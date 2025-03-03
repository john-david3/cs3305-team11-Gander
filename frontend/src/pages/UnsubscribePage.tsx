import React from "react";
import PasswordResetForm from "../components/Auth/UnsubscribeForm";
import { useParams } from "react-router-dom";

const UnsubscribePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const handleUnsubscribe = (success: boolean) => {
    if (success) {
      alert("Succesfully Unsubscribed from Newsletter!");
      window.location.href = "/";
    } else {
      alert("Unsubscribe failed, lol.");
    }
  };

  if (!token) {
    return (
      <p className="text-red-500 text-center mt-4">Invalid or missing token.</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Unsubscribe from Newsletter</h1>
      <PasswordResetForm onSubmit={handleUnsubscribe} token={token} />
    </div>
  );
};

export default UnsubscribePage;
