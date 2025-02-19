import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Input/Button";

interface ForgotPasswordProps {
  email?: string;
}

interface SubmitProps {
  onSubmit: () => void;
}

const ForgotPasswordForm: React.FC<SubmitProps> = ({ onSubmit }) => {
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
    <div className="mb-2">
      <div className="flex flex-col items-center p-[2.5rem]">
      <h1 className="text-white text-[1.5em] font-[800] md:text-[1.75em] lg:text-[2em]">Forgot Password</h1>
      <div className="mt-10 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-[10em] min-w-[14em] border border-white/10 sm:max-w-[16em] md:max-w-[18em] lg:max-w-[20em]">
          <form
            onSubmit={handleSubmit}
            id="forgot-password-form"
            className="flex flex-col"
          >
            <div className="relative w-full">
              {errors.general && (
                <p className="absolute top-[-1.5em] text-red-500 text-sm text-center w-full">
                  {errors.general}
                </p>
              )}

              {errors.email && (
                <p className="absolute top-[-1.5em] text-red-500 text-sm text-center w-full">
                  {errors.email}
                </p>
              )}
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                extraClasses={`w-full mb-[1.5em] p-[0.5rem] ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            <Button type="submit">Send Link</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
