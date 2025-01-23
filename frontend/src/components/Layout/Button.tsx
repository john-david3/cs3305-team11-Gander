import React from "react";

interface ButtonProps {
  title?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  title = "Submit",
  onClick,
}) => {
  return (
    <div>
      <button onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

export default Button;
