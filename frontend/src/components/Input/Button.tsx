import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  extraClasses?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  children = "Submit",
  extraClasses = "",
  onClick,
}) => {
  return (
    <button
      type={type}
      className={`${extraClasses} p-2 text-[1.5rem] text-white hover:text-purple-600 bg-black/30 hover:bg-black/80 rounded-md border border-gray-300 hover:border-purple-500 hover:border-b-4 hover:border-l-4 active:border-b-2 active:border-l-2 transition-all`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface EditButtonProps extends ButtonProps {
}

export const EditButton: React.FC<EditButtonProps> = ({
  children = "",
  extraClasses = "",
  onClick,
}) => {
  return (
    <button
      className={`${extraClasses} p-[0.5em] bg-yellow-500 hover:bg-black rounded-[3rem] border-2 border-white shadow-lg transition-all duration-300`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};  

interface ToggleButtonProps extends ButtonProps {
  toggled?: boolean;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  children = "Toggle",
  extraClasses = "",
  onClick,
  toggled = false,
}) => {
  toggled
    ? (extraClasses += " cursor-default bg-purple-600")
    : (extraClasses +=
        " cursor-pointer hover:text-purple-600 hover:bg-black/80 hover:border-purple-500 hover:border-b-4 hover:border-l-4");
  return (
    <button
      className={`${extraClasses} p-2 text-[1.5rem] text-white bg-black/30 rounded-[1rem] border border-gray-300 transition-all`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
