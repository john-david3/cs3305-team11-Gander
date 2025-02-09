import React from "react";
import Theme from "./Theme";
import { useTheme } from "../../context/ThemeContext";

const QuickSettings: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed top-0 right-0 w-[250px] h-screen p-4 z-[90] overflow-y-auto"
         style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <h3 className="text-xl">Current Theme: {theme}</h3>
      <Theme />
    </div>
  );
};

export default QuickSettings;
