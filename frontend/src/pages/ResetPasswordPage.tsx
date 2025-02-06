import React from "react";
import PasswordResetForm from "../components/Auth/PasswordResetForm";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const handlePasswordReset = () => {

    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <PasswordResetForm onSubmit={handlePasswordReset} token={token} />
        </div>
    );
};

export default ResetPasswordPage;
