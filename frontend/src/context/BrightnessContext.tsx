import React, { createContext, useContext, useEffect, useState } from "react";

interface BrightnessContextType {
  brightness: number;
  setBrightness: (value: number) => void;
}

const BrightnessContext = createContext<BrightnessContextType | undefined>(undefined);

export const Brightness: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brightness, setBrightness] = useState<number>(100);

  useEffect(() => {
    // Apply brightness to the entire page
    document.body.style.filter = `brightness(${brightness}%)`;
  }, [brightness]);

  return (
    <BrightnessContext.Provider value={{ brightness, setBrightness }}>
      {children}
    </BrightnessContext.Provider>
  );
};

export const useBrightness = (): BrightnessContextType => {
  const context = useContext(BrightnessContext);
  if (!context) {
    throw new Error("useBrightness must be used within a BrightnessProvider");
  }
  return context;
};
