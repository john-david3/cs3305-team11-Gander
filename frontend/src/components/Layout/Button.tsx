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
      <button className="underline bg-blue-600/30 p-4 rounded-[5rem] transition-all hover:text-[3.2rem]" onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

export default Button;
