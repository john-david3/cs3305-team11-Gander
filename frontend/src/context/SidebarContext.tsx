import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  showSideBar: boolean;
  setShowSideBar: (show: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <SidebarContext.Provider value={{ showSideBar, setShowSideBar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
