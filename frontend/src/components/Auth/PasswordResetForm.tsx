import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Input/Button";

interface ResetPasswordData {
  newPassword: string;
  confirmNewPassword: string;
}

interface ResetPasswordErrors {
  newPasswordError?: string;
  confirmNewPasswordError?: string;
}

interface SubmitProps {
  onSubmit: (success: boolean) => void;
  token: string;
}

const PasswordResetForm: React.FC<SubmitProps> = ({ onSubmit, token }) => {
  const [errors, setErrors] = useState<ResetPasswordErrors>({});

  const [resetData, setResetData] = useState<ResetPasswordData>({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateResetForm = (): boolean => {
    const newErrors: ResetPasswordErrors = {};

    Object.keys(resetData).forEach((key) => {
      if (!resetData[key as keyof ResetPasswordData]) {
        newErrors[key as keyof ResetPasswordErrors] = "Confirm your password";
      }
    });
    if (resetData.newPassword.length < 8) {
      newErrors.newPasswordError =
        "Password must be at least 8 characters long";
    }
    if (resetData.newPassword !== resetData.confirmNewPassword) {
      newErrors.confirmNewPasswordError = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateResetForm()) {
      try {
        const response = await fetch(
          `/api/user/reset_password/${token}/${resetData.newPassword}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(resetData),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          onSubmit(false);
          throw new Error(
            data.error || "An error has occurred while resetting"
          );
        } else {
          onSubmit(true);
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
    <form onSubmit={handleSubmit}>
      <Input
        name="newPassword"
        type="password"
        placeholder="New Password"
        value={resetData.newPassword}
        onChange={handlePasswordChange}
        extraClasses={`${errors.newPasswordError ? "border-red-500" : ""}`}
      />

      {errors.confirmNewPasswordError && (
        <p className="text-red-500 mt-3 text-sm">
          {errors.confirmNewPasswordError}
        </p>
      )}
      <Input
        name="confirmNewPassword"
        type="password"
        placeholder="Confirm Password"
        value={resetData.confirmNewPassword}
        onChange={handlePasswordChange}
        extraClasses={`${
          errors.confirmNewPasswordError ? "border-red-500" : ""
        }`}
      />

      <Button type="submit">Reset Password</Button>
    </form>
  );
};

export default PasswordResetForm;
