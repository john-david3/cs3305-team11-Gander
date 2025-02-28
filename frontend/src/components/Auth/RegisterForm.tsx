import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Input/Button";
import { useAuth } from "../../context/AuthContext";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string; // For general authentication errors
}

interface SubmitProps {
  onSubmit: () => void;
}

const RegisterForm: React.FC<SubmitProps> = ({ onSubmit }) => {
  const { setIsLoggedIn } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      if (!formData[key as keyof RegisterFormData]) {
        newErrors[key as keyof FormErrors] = "This field is required";
      }
    });

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();

    if (validateForm()) {
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.account_created) {
          //TODO Handle successful registration (e.g., redirect or show success message)
          console.log("Registration Successful! Account created successfully");
          setIsLoggedIn(true);
          window.location.reload();
        } else {
          // Handle validation errors from server
          if (data.error_fields) {
            const newErrors: FormErrors = {};
            for (const field of data.error_fields) {
              newErrors[field as keyof FormErrors] = data.message;
            }
            setErrors(newErrors);
          } else {
            // If no specific fields are indicated, set a general error
            setErrors({
              general: data.message || "An error occurred during registration",
            });
          }
        }
      } catch (error) {
        console.error("Error Registering:", error);
        setErrors({
          general: "An error occurred during registration",
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center h-full overflow-hidden">
        <h1 className="flex flex-col text-white text-[1.5em] font-[800] md:text-[1.75em] lg:text-[2em]">
          Register
        </h1>
        <form
          onSubmit={handleSubmit}
          id="register-form"
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
            extraClasses={`w-full focus:w-[120%] p-3 ${
              errors.username ? "border-red-500" : ""
            }`}
          />
  
          {errors.email && (
            <p className="text-red-500 text-center text-[0.75em]">
              {errors.email}
            </p>
          )}
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            extraClasses={`w-full focus:w-[120%] p-3 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
  
          {errors.password && (
            <p className="text-red-500 text-center text-[0.75em]">
              {errors.password}
            </p>
          )}
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            extraClasses={`w-full focus:w-[120%] p-3 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
  
          {errors.confirmPassword && (
            <p className="text-red-500 text-center text-[0.75em]">
              {errors.confirmPassword}
            </p>
          )}
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            extraClasses={`w-full focus:w-[120%] p-3 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
  
          <Button type="submit">Register</Button>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
