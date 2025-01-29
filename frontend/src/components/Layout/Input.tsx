import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  extraClasses?: string;
}

const Input: React.FC<InputProps> = ({
  name,
  type = "text",
  placeholder = "",
  value = "",
  extraClasses = "",
  onChange = () => {},
  ...props // all other HTML input props
}) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
      className={`${extraClasses} p-2 rounded-[1rem] w-[20vw] focus:w-[30vw] bg-black/40 border border-gray-300 focus:border-purple-500 focus:outline-purple-500 text-center text-white text-xl transition-all`}
    />
  );
};

export default Input;
