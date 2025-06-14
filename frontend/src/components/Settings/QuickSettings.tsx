import React from "react";
import ThemeSetting from "./ThemeSetting";
import { useQuickSettings } from "../../context/QuickSettingsContext";
import Screenshot from "../Functionality/Screenshot";
import BrightnessControl from "../Functionality/BrightnessControl";

const QuickSettings: React.FC = () => {
  const { showQuickSettings } = useQuickSettings();

  return (
    <div
      className={`fixed top-0 right-0 w-[20vw] h-screen p-4 flex flex-col items-center overflow-y-hidden overflow-x-hidden ${
        showQuickSettings ? "opacity-100 z-[90]" : "opacity-0 z-[-1]"
      } transition-all duration-300 ease-in-out pt-0  bg-[var(--quickBar-bg)] text-[var(--quickBar-text)]`}
    >
      <div
        className="w-[20vw] p-[1em] flex flex-col items-center bg-[var(--quickBar-title-bg)] text-[var(--quickBar-title)]
      border-b-[0.25em] border-[var(--quickBar-border)] "
      >
        <h1 className="text-[2rem] font-black">Quick Settings</h1>
      </div>
      <div id="quick-settings-menu" className="flex flex-col my-8 gap-4 mb-20">
        <ThemeSetting />
      </div>
      <Screenshot />
      <BrightnessControl />
    </div>
  );
};

export default QuickSettings;
