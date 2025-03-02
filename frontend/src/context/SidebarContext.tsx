import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import useFetchProfilePicture from "../hooks/useFetchProfilePicture";
import { useEffect } from "react";

interface SidebarContextType {
  showSideBar: boolean;
  setShowSideBar: (show: boolean) => void;
  profileImageUrl: string;
  setProfileImageUrl: (url: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const { username } = useAuth()
  const fetchedProfileImageUrl = useFetchProfilePicture({ username });
  const [showSideBar, setShowSideBar] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    setProfileImageUrl(fetchedProfileImageUrl);
  }, [fetchedProfileImageUrl]);
  

  return (
    <SidebarContext.Provider value={{ showSideBar, setShowSideBar, profileImageUrl, setProfileImageUrl}}>
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
