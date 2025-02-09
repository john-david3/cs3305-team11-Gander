import React, { useState } from "react";
import Input from "../Layout/Input";
import Button from "../Layout/Button";

interface ForgotPasswordProps {
    email?: string;
}

const ForgotPasswordForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [errors, setErrors] = useState<ForgotPasswordProps>({});

    const confirmPasswordReset = () => {
        alert(`Email has been sent`);

    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors((prev) => ({ ...prev, email: undefined }));
        }
    };


    const validateEmail = (): boolean => {
        const newErrors: ForgotPasswordProps = {};
        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateEmail()) {
            try {
                const response = await fetch(`/api/user/forgot_password/${email}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "An error has occurred while resetting");
                } else {
                    confirmPasswordReset();
                }
            } catch (error: any) {
                console.error("Password reset error:", error.message);
                setErrors((prev) => ({
                    ...prev,
                    general: error.message || "An unexpected error occurred.",

                }));
            }
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="h-[25em] w-[20em] flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-full m-6">
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        extraClasses={`appearance-none bg-transparent text-black m-5 ${errors.email ? "border-red-500" : ""}`}
                        />
    
                    {errors.email && <p className="text-red-500 mt-2 text-sm">{errors.email}</p>}
    
                    <Button type="submit" extraClasses="text-black">Send Reset Link</Button>
                </form>
            </div>
        </div>
    );
    
};

export default ForgotPasswordForm;
