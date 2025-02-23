import React from "react";
import PasswordResetForm from "../components/Auth/PasswordResetForm";
import { useParams } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const handlePasswordReset = (success: boolean) => {
    if (success) {
      alert("Password reset successful!");
      window.location.href = "/";
    } else {
      alert("Password reset failed.");
    }
  };

  if (!token) {
    return (
      <p className="text-red-500 text-center mt-4">Invalid or missing token.</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <PasswordResetForm onSubmit={handlePasswordReset} token={token} />
    </div>
  );
};

export default ResetPasswordPage;
