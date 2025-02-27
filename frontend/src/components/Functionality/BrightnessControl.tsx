import React from "react";
import { useBrightness } from "../../context/BrightnessContext";

const BrightnessControl: React.FC = () => {
  const { brightness, setBrightness } = useBrightness();

  const handleBrightnessChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    {
      /* Set brightness based on the value. Calls BrightnessContext too */
    }
    setBrightness(Number(event.target.value));
  };

  return (
    
    <div id="slider" className="flex flex-col items-center p-4 mt-7 bg-[var(--slider-bg)] rounded-xl">
      <h2 className="text-lg font-semibold mb-2 text-[var(--slider-header)]">Brightness Control</h2>
      {/* Changes based on the range of input */}
      <input
        type="range"
        min="0"
        max="200"
        value={brightness}
        onChange={handleBrightnessChange}
        className="w-60 cursor-pointer"
      />

      <p className="mt-2 text-sm text-[var(--slider-text)]">Brightness: {brightness}%</p>
    </div>
  );
};

export default BrightnessControl;
