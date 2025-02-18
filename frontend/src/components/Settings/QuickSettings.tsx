import React from "react";
import ThemeSetting from "./ThemeSetting";
import { useTheme } from "../../context/ThemeContext";
import { useQuickSettings } from "../../context/QuickSettingsContext";

const QuickSettings: React.FC = () => {
  const { theme } = useTheme();
  const { showQuickSettings } = useQuickSettings();

  return (
    <div
      className={`fixed top-0 right-0 w-[20vw] h-screen p-4 flex flex-col items-center overflow-y-auto ${
        showQuickSettings ? "opacity-100 z-[90]" : "opacity-0 z-[-1]"
      } transition-all duration-300 ease-in-out`}
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <h1 className="text-[2rem] font-black">Quick Settings</h1>
      <div id="quick-settings-menu" className="flex flex-col flex-grow my-8 gap-4">
        <ThemeSetting />
      </div>
    </div>
  );
};

export default QuickSettings;
