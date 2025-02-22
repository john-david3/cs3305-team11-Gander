import React, { useState } from "react";
import Input from "../Input/Input";
import Button, { ToggleButton } from "../Input/Button";
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
          //TODO: Handle successful login (e.g., redirect to home page)
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
      <div className="flex flex-col items-center p-10">
        <h1 className="flex flex-col text-white text-[1.5em] font-[800] md:text-[1.75em] lg:text-[2em]">Login</h1>
        <div className="mt-10 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-[10em] min-w-[14em] border border-white/10 sm:max-w-[16em] md:max-w-[18em] lg:max-w-[20em]">

          <form
            onSubmit={handleSubmit}
            id="login-form"
            className="flex flex-col"
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
              extraClasses={`w-full mb-[2em] p-3 ${
                errors.username ? "border-red-500" : ""
              }`}
            />

            {errors.password && (
              <p className="text-red-500 text-center text-[0.75em]">
                {errors.password}
              </p>
            )}

            <div className="mb-[2em]">
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
              <div className="flex">
                <label className="flex w-full items-center justify-start cursor-pointer w-10px">
                  <input
                    type="checkbox"
                    className="accent-purple-600 w-3 h-3 mr-1"
                  />
                  <span className="text-[0.5em] xl:text-[0.75em]">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="flex w-full justify-end items-center justify-items-end text-[0.5em] xl:text-[0.75em] text-white font-semibold hover:scale-[1.05] transition-all ease-in"
                  onClick={onForgotPassword}
                >
                  <ForgotIcon size={16} className="flex flex-row mr-1" />
                  <span> Forgot Password </span>
                </button>
              </div>
            </div>
            <Button type="submit">Login</Button>
          </form>

          <div className="flex flex-col flex-items justify-evenly items-center w-full h-[5em]">
            <GoogleLogin />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
