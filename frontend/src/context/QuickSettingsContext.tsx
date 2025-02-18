import { createContext, useContext, useState, ReactNode } from "react";

interface QuickSettingsContextType {
  showQuickSettings: boolean;
  setShowQuickSettings: (show: boolean) => void;
}

const QuickSettingsContext = createContext<
  QuickSettingsContextType | undefined
>(undefined);

export function QuickSettingsProvider({ children }: { children: ReactNode }) {
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  return (
    <QuickSettingsContext.Provider
      value={{ showQuickSettings, setShowQuickSettings }}
    >
      {children}
    </QuickSettingsContext.Provider>
  );
}

export function useQuickSettings() {
  const context = useContext(QuickSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useQuickSettings must be used within a QuickSettingsProvider"
    );
  }
  return context;
}
