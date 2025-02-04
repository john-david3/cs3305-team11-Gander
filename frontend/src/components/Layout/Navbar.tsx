import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Button, { ToggleButton } from "./Button";
import Sidebar from "./Sidebar";
import { Sidebar as SidebarIcon } from "lucide-react";
import {
  Search as SearchIcon,
  LogIn as LogInIcon,
  LogOut as LogOutIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import Input from "./Input";
import AuthModal from "../Auth/AuthModal";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  variant?: "home" | "default";
  isChatOpen?: boolean;
  toggleChat?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  variant = "default",
  isChatOpen,
  toggleChat,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isLoggedIn } = useAuth();
  const isVideoPage = location.pathname.includes("/EduGuru");

  useEffect(() => {
    if (showAuthModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAuthModal]);

  const handleLogout = () => {
    console.log("Logging out...");
    fetch("/api/logout")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.reload();
      });
  };

  return (
    <div
      id="navbar"
      className={`flex justify-center items-center ${variant === "home" ? "h-[45vh] flex-col" : "h-[15vh] col-span-2 flex-row"}`}
    >
      <Logo variant={variant} />
      <Button
        extraClasses="absolute top-[20px] left-[20px] text-[1rem] flex items-center flex-nowrap"
        onClick={() => (isLoggedIn ? handleLogout() : setShowAuthModal(true))}
      >
        {isLoggedIn ? (
          <>
            <LogOutIcon className="h-15 w-15 mr-1" />
            Logout
          </>
        ) : (
          <>
            <LogInIcon className="h-15 w-15 mr-1" />
            Login / Register
          </>
        )}
      </Button>

      {isLoggedIn && (
        <>
          <Button extraClasses="absolute top-[75px] left-[20px]">
            <SidebarIcon className="h-15 w-15 mr-1" />
          </Button>
          <Sidebar />
        </>
      )}

      <Button
        extraClasses="absolute top-[20px] right-[20px] text-[1rem] flex items-center flex-nowrap"
        onClick={() => console.log("Settings - TODO")}
      >
        <SettingsIcon className="h-15 w-15 mr-1" />
        Quick Settings
      </Button>
      {isVideoPage && (
        <ToggleButton
          onClick={toggleChat}
          toggled={isChatOpen}
          extraClasses="absolute top-[80px] right-[20px] text-[1rem] flex items-center flex-nowrap"
        >
          {isChatOpen ? "Hide Chat" : "Show Chat"}
        </ToggleButton>
      )}

      <div id="search-bar" className="flex items-center">
        <Input
          type="text"
          placeholder="Search..."
          extraClasses="pr-[30px] focus:outline-none focus:border-purple-500 focus:w-[30vw]"
        />

        <SearchIcon className="-translate-x-[28px] top-1/2 h-6 w-6 text-white" />
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default Navbar;
