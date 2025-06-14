import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Input/Button";
import { useAuth } from "../../context/AuthContext";
import GoogleLogin from "./OAuth";
import { CircleHelp as ForgotIcon } from "lucide-react";

interface LoginFormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string; // For general authentication errors
}

//Speed up border animation
interface SubmitProps {
  onSubmit: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<SubmitProps> = ({ onSubmit, onForgotPassword }) => {
  const { setIsLoggedIn } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Check for empty fields
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof LoginFormData]) {
        newErrors[key as keyof FormErrors] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    onSubmit();
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.logged_in) {
          console.log("Login successful! Details: ", data);
          setIsLoggedIn(true);
          window.location.reload();
        } else {
          // Handle authentication errors from server
          if (data.error_fields) {
            const newErrors: FormErrors = {};
            for (const field of data.error_fields) {
              newErrors[field as keyof FormErrors] = data.message;
            }
            setErrors(newErrors);
          } else {
            // If no specific fields are indicated, set a general error
            setErrors({
              general: data.message || "An error occurred during login",
            });
          }
        }
      } catch (error) {
        console.error("Error logging in:", error);
        setErrors({
          general: "An error occurred during login",
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center h-full overflow-hidden">
        <h1 className="flex flex-col text-white text-[1.5em] font-[800] md:text-[1.75em] lg:text-[2em]">
          Login
        </h1>
        <form
          onSubmit={handleSubmit}
          id="login-form"
          className="flex flex-col justify-evenly flex-grow mt-[4vh] bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full border border-white/10 sm:max-w-[16em] md:max-w-[18em] lg:max-w-[20em] overflow-auto"
        >
          {errors.general && (
            <p className="text-red-500 text-sm text-center text-[0.75em]">
              {errors.general}
            </p>
          )}

          {errors.username && (
            <p className="text-red-500 text-center text-[0.75em]">
              {errors.username}
            </p>
          )}
          <Input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            extraClasses={`w-full p-3 ${
              errors.username ? "border-red-500" : ""
            }`}
          />

          {errors.password && (
            <p className="text-red-500 text-center text-[0.75em]">
              {errors.password}
            </p>
          )}

          <div className="pb-4">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              extraClasses={`w-full p-3 ${
                errors.password ? "border-red-500" : ""
              }`}
            ></Input>
            <div className="flex justify-end">
              <button
                type="button"
                className="flex items-center w-fit text-white font-semibold hover:scale-105 mt-2 transition-all ease-in"
                onClick={onForgotPassword}
              >
                <ForgotIcon size={16} className="flex flex-row mr-1" />
                <span className="text-[0.6rem] 2lg:text-[0.75rem]">
                  Forgot Password
                </span>
              </button>
            </div>
          </div>
          <Button type="submit">Login</Button>
          <GoogleLogin />
        </form>
      </div>
    </>
  );
};

export default LoginForm;
