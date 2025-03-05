import React from "react";
import { SunIcon, MoonIcon, DropletIcon, LeafIcon, FlameIcon, MoonStarIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const themeConfig = {
  light: {
    icon: SunIcon,
    color: "text-yellow-400",
    background: "bg-white",
    hoverBg: "hover:bg-gray-100",
    label: "Light Theme",
  },
  dark: {
    icon: MoonIcon,
    color: "text-white",
    background: "bg-gray-800",
    hoverBg: "hover:bg-gray-700",
    label: "Dark Theme",
  },
  midnight: {
    icon: MoonStarIcon,
    color: "text-white",
    background: "bg-black",
    hoverBg: "hover:bg-black/30",
    label: "Midnight Theme",
  },
  blue: {
    icon: DropletIcon,
    color: "text-blue-500",
    background: "bg-blue-50",
    hoverBg: "hover:bg-blue-100",
    label: "Blue Theme",
  },
  green: {
    icon: LeafIcon,
    color: "text-green-500",
    background: "bg-green-50",
    hoverBg: "hover:bg-green-100",
    label: "Green Theme",
  },
  orange: {
    icon: FlameIcon,
    color: "text-orange-500",
    background: "bg-orange-50",
    hoverBg: "hover:bg-orange-100",
    label: "Orange Theme",
  },
} as const;

const themes = Object.keys(themeConfig) as Array<keyof typeof themeConfig>;

const ThemeSetting: React.FC = () => {
  const { theme, setTheme } = useTheme() as {
    theme: keyof typeof themeConfig;
    setTheme: (theme: keyof typeof themeConfig) => void;
  };

  const handleNextTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
    document.body.setAttribute("data-theme", nextTheme);
  };

  const currentTheme = themeConfig[theme as keyof typeof themeConfig];
  const Icon = currentTheme.icon;

  return (
    <div className="flex flex-row gap-4">
      <h3 className="text-xl flex-grow">Current Theme: </h3>
      <button
        onClick={handleNextTheme}
        className={`flex-grow 
        group px-4 py-2 rounded-lg
        flex items-center gap-3
        border border-gray-200
        ${currentTheme.background}
        ${currentTheme.hoverBg}
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
      `}
        aria-label={`Switch theme. Current theme: ${currentTheme.label}`}
      >
        <Icon
          size={25}
          className={`${currentTheme.color} transition-transform group-hover:scale-110`}
        />
        <span className="capitalize font-medium">{theme}</span>
      </button>
    </div>
  );
};

export default ThemeSetting;
