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
    <div className="flex flex-col items-center p-4">
      <h2 className="text-lg font-semibold mb-2">Brightness Control</h2>
      {/* Changes based on the range of input */}
      <input
        type="range"
        min="0"
        max="200"
        value={brightness}
        onChange={handleBrightnessChange}
        className="w-60 cursor-pointer"
      />

      <p className="mt-2 text-sm">Brightness: {brightness}%</p>
    </div>
  );
};

export default BrightnessControl;
