import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  extraClasses?: string;
  children?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  name,
  type = "text",
  placeholder = "",
  value = "",
  extraClasses = "",
  onChange = () => { },
  onKeyDown = () => { },
  children,
  ...props // all other HTML input props
}) => {
  return (
    <>
    <div className="flex flex-col items-center">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...props}
        className={`${extraClasses} relative p-2 rounded-[1rem] w-[20vw] focus:w-[21vw] bg-black/40 border border-gray-300 focus:border-purple-500 focus:outline-purple-500 text-center text-white text-xl transition-all`}
      />

    </div>
    </>
    
  );
};

export default Input;
