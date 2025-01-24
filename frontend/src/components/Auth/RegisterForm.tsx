import React, { useState } from "react";
import Input from "../Layout/Input";
import Button from "../Layout/Button";
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
}

const RegisterForm: React.FC = () => {
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
        console.log(`sending data: ${JSON.stringify(formData)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || `Registration failed. ${response.body}`
          );
        }

        if (data.account_created) {
          //TODO Handle successful registration (e.g., redirect or show success message)
          console.log("Registration Successful! Account created successfully");
          setIsLoggedIn(true);
          window.location.reload();
        } else {
          // Handle validation errors from server
          const serverErrors: FormErrors = {};
          if (data.errors) {
            Object.entries(data.errors).forEach(([field, message]) => {
              serverErrors[field as keyof FormErrors] = message as string;
            });
            setErrors(serverErrors);
          }
        }
      } catch (error) {
        console.error("Registration error:", error);
        //TODO Show user-friendly error message via Alert component maybe
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="register-form h-[100%] flex flex-col h-full justify-evenly items-center"
    >
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
      {errors.email && (
        <p className="text-red-500 mt-3 text-sm">{errors.email}</p>
      )}
      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        extraClasses={`${errors.email ? "border-red-500" : ""}`}
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
      {errors.confirmPassword && (
        <p className="text-red-500 mt-3 text-sm">{errors.confirmPassword}</p>
      )}
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        extraClasses={`${errors.confirmPassword ? "border-red-500" : ""}`}
      />
      <Button type="submit">Register</Button>
    </form>
  );
};

export default RegisterForm;
