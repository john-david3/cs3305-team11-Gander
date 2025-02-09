import React, { useState } from "react";
import Input from "../Layout/Input";
import Button from "../Layout/Button";
import { useAuth } from "../../context/AuthContext";

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
}

const LoginForm: React.FC<SubmitProps> = ({ onSubmit }) => {
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
    <div className="h-[100%] flex flex-col justify-evenly items-center">
    <h1 className="text-white text-lg"> Login </h1>
    <form
      onSubmit={handleSubmit}
      id="login-form"
      className="h-[100%] flex flex-col justify-evenly items-center"
    >
      {errors.general && (
        <p className="text-red-500 text-sm text-center">{errors.general}</p>
      )}

      {errors.username && (
        <p className="text-red-500 mt-3 text-sm">{errors.username}</p>
      )}
      <Input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleInputChange}
        extraClasses={`${errors.username ? "border-red-500" : ""}`}
      />

      {errors.password && (
        <p className="text-red-500 mt-3 text-sm">{errors.password}</p>
      )}
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        extraClasses={`${errors.password ? "border-red-500" : ""}`}
      />

      <Button type="submit">Login</Button>
    </form>
    </div>
    </>
  );
};

export default LoginForm;
