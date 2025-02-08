import React, { useState } from "react";
import Logo from "./Logo";
import Button from "./Button";
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
import { useAuthModal } from "../../hooks/useAuthModal";
import { useAuth } from "../../context/AuthContext";
import QuickSettings from "./QuickSettings";

interface NavbarProps {
  variant?: "home" | "default";
}

const Navbar: React.FC<NavbarProps> = ({ variant = "default" }) => {
  const { isLoggedIn } = useAuth();
  const { showAuthModal, setShowAuthModal } = useAuthModal();
  const [showSideBar, setShowSideBar] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    fetch("/api/logout")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.reload();
      });
  };

  const handleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <div
      id="navbar"
      className={`flex justify-center items-center ${variant === "home"
          ? "h-[45vh] flex-col"
          : "h-[15vh] col-span-2 flex-row"
        }`}
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
          <Button
            onClick={() => handleSideBar()}
            extraClasses={`absolute ${showSideBar
                ? `fixed top-[20px] left-[20px] p-2 text-[1.5rem] text-white hover:text-white
          bg-black/30 hover:bg-purple-500/80 rounded-md border border-gray-300 hover:border-white h
          over:border-b-4 hover:border-l-4 active:border-b-2 active:border-l-2 transition-all `
                : "top-[75px] left-[20px]"
              } transition-all duration-300 z-[99]`}
          >
            <SidebarIcon className="top-[0.20em] left-[10em] mr-1 z-[90]" />
          </Button>
          <div
            className={`fixed top-0 left-0 w-[250px] h-screen bg-[var(--sideBar-LightBG)] text-[var(--sideBar-LightText)] z-[90] overflow-y-auto scrollbar-hide
              transition-transform transition-opacity duration-500 ease-in-out ${showSideBar ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
              }`}
          >
            <Sidebar />
          </div>
        </>
      )}

      <Button
        extraClasses="absolute top-[20px] right-[20px] text-[1rem] flex items-center flex-nowrap"
        onClick={() => console.log("Settings - TODO")}
      >
        <SettingsIcon className="h-15 w-15 mr-1" />
        Quick Settings
      </Button>
      
        <div
          className={`fix top-0 right-0 w-250px h-screen overflow-y-auto scrollbar-hide transition-opacity duration-500 ease-in-out ${showQuickSettings ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`
          }
        >
          <QuickSettings />
        </div>

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
