import React from "react";
import PasswordResetForm from "../components/Auth/PasswordResetForm";
import { useParams, useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    // If the token is missing, handle the error (e.g., redirect or show a message)
    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mb-4">Invalid Token</h1>
                <p className="text-red-500">The reset token is missing or invalid.</p>
                <button
                    onClick={() => navigate("/login")}
                    className="text-blue-500 underline mt-4"
                >
                    Go back to Login
                </button>
            </div>
        );
    }

    const handlePasswordReset = () => {

    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <PasswordResetForm onSubmit={handlePasswordReset} token={token} />
        </div>
    );
};

export default ForgotPasswordPage;
