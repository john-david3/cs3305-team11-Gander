import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "home" | "default";
}

const Logo: React.FC<LogoProps> = ({ variant = "default" }) => {
  const gradient =
    "bg-gradient-to-br from-yellow-400 via-red-500 to-indigo-500 text-transparent bg-clip-text group-hover:mx-1 transition-all";
  return (
    <Link to="/" className="cursor-pointer">
      <div id="logo" className={`group py-3 text-center font-bold hover:scale-110 transition-all ${variant === "home" ? "text-[12vh]" : "text-[4vh]"}`}>
        <h6 className="text-sm bg-gradient-to-br from-blue-400 via-green-500 to-indigo-500 font-black text-transparent bg-clip-text">
          Go on, have a...
        </h6>
        <div className="flex w-fit min-w-[30vw] justify-center leading-none transition-all">
          <span className={gradient}>G</span>
          <span className={gradient}>A</span>
          <span className={gradient}>N</span>
          <span className={gradient}>D</span>
          <span className={gradient}>E</span>
          <span className={gradient}>R</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
