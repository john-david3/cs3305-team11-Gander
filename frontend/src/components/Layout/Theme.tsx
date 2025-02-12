import React from "react";
import { Sun as SunIcon, Moon as MoonIcon, Droplet as BlueIcon, Leaf as GreenIcon, Flame as OrangeIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const themeIcons = {
  light: <SunIcon size={27} className="text-yellow-400" />,
  dark: <MoonIcon size={27} className="text-white" />,
  blue: <BlueIcon size={27} className="text-blue-500" />,
  green: <GreenIcon size={27} className="text-green-500" />,
  orange: <OrangeIcon size={27} className="text-orange-500" />,
};

const themes = ["light", "dark", "blue", "green", "orange"];

const Theme: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleNextTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
    document.body.setAttribute("data-theme", nextTheme); 
  };

  return (
    <button
      onClick={handleNextTheme}
      className="p-2 text-[1.5rem] flex items-center gap-2 rounded-md border transition-all"
    >
      {themeIcons[theme as keyof typeof themeIcons]} {theme}
      </button>
  );
};

export default Theme;

{/*
${isMode ? 
  `text-white bg-[#3478ef] hover:text-[#3478ef] hover:bg-[#000000]
  border-[#3478ef] hover:border-[##3478ef]` :
`text-yellow-400 bg-white hover:text-yellow-400 hover:bg-white 
  border-yellow-400 hover:border-yellow-400`}
 hover:border-b-4 hover:border-l-4 active:border-b-2 active:border-l-2 transition-all `} */}