import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Input/Button";

interface UnsubscribeData {
  email: string;
}

interface SubmitProps {
  onSubmit: (success: boolean) => void;
  token: string;
}

const UnsubscribeForm: React.FC<SubmitProps> = ({ onSubmit, token }) => {

  const [subData, setSubData] = useState<UnsubscribeData>({
    email: "",
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
    const response = await fetch(
        `/api/user/unsubscribe/${token}`,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(subData),
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Are you sure you want to unsubscribe?</p>
      <p>Think of all the great news you could still receive..</p>

      <Button type="submit">Unsubscribe</Button>
    </form>
  );
};

export default UnsubscribeForm;
