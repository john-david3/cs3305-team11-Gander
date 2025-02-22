import React, { useEffect } from "react";
import Logo from "../Layout/Logo";
import Button, { ToggleButton } from "../Input/Button";
import Sidebar from "./Sidebar";
import { Sidebar as SidebarIcon } from "lucide-react";
import {
  LogIn as LogInIcon,
  LogOut as LogOutIcon,
  Settings as SettingsIcon,
  Radio as LiveIcon,
} from "lucide-react";
import SearchBar from "../Input/SearchBar";
import AuthModal from "../Auth/AuthModal";
import { useAuthModal } from "../../hooks/useAuthModal";
import { useAuth } from "../../context/AuthContext";
import QuickSettings from "../Settings/QuickSettings";
import { useSidebar } from "../../context/SidebarContext";
import { useQuickSettings } from "../../context/QuickSettingsContext";

interface NavbarProps {
  variant?: "home" | "default";
}

const Navbar: React.FC<NavbarProps> = ({ variant = "default" }) => {
  const { isLoggedIn } = useAuth();
  const { showAuthModal, setShowAuthModal } = useAuthModal();
  const { showSideBar, setShowSideBar } = useSidebar();
  const { showQuickSettings, setShowQuickSettings } = useQuickSettings();

  const handleLogout = () => {
    console.log("Logging out...");
    fetch("/api/logout")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.reload();
      });
  };

  const handleQuickSettings = () => {
    setShowQuickSettings(!showQuickSettings);
  };

  const handleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  // Keyboard shortcut to toggle sidebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.key === "s" &&
        document.activeElement == document.body &&
        isLoggedIn
      ) {
        handleSideBar();
      }
      if (e.key === "q" && document.activeElement == document.body) {
        handleQuickSettings();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [showSideBar, showQuickSettings, setShowSideBar, isLoggedIn]);

  return (
    <div
      id="navbar"
      className={`flex justify-center items-center w-full ${
        variant === "home"
          ? "h-[45vh] flex-col"
          : "h-[15vh] col-span-2 flex-row"
      }`}
    >
      <Logo variant={variant} />

      {/* Login / Logout Button */}
      <Button
        extraClasses={`absolute top-[2vh] ${
          showSideBar
            ? "left-[16vw] duration-[0.5s]"
            : "left-[20px] duration-[1s]"
        } text-[1rem] flex items-center flex-nowrap`}
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

      {/* Sidebar */}
      {isLoggedIn && (
        <>
          <ToggleButton
            onClick={() => handleSideBar()}
            extraClasses={`absolute group text-[1rem] top-[9vh] ${
              showSideBar
                ? "left-[16vw] duration-[0.5s]"
                : "left-[20px] duration-[1s]"
            } ease-in-out cursor-pointer`}
            toggled={showSideBar}
          >
            <SidebarIcon className="top-[0.20em] left-[10em] z-[90]" />

            {showSideBar && (
              <small className="absolute flex items-center top-0 ml-4 left-0 h-full w-full my-auto group-hover:left-full opacity-0 group-hover:opacity-100 text-white transition-all delay-200">
                Press S
              </small>
            )}
          </ToggleButton>
          <Sidebar />
        </>
      )}

      {/* Quick Settings Sidebar */}
      <ToggleButton
        extraClasses={`absolute group text-[1rem] top-[2vh] ${
          showQuickSettings ? "right-[21vw]" : "right-[20px]"
        } cursor-pointer`}
        onClick={() => handleQuickSettings()}
        toggled={showQuickSettings}
      >
        <SettingsIcon className="h-15 w-15" />

        {showQuickSettings && (
          <small className="absolute flex items-center top-0 mr-4 right-0 h-full w-full my-auto group-hover:right-full opacity-0 group-hover:opacity-100 text-white transition-all delay-200">
            Press Q
          </small>
        )}
      </ToggleButton>
      <QuickSettings />

      <SearchBar />

      {/* Stream Button */}
      {isLoggedIn && !window.location.pathname.includes('go-live') && (
        <Button
          extraClasses={`${
            variant === "home" ? "absolute top-[2vh] right-[10vw]" : ""
          } flex flex-row items-center`}
          onClick={() => window.location.href = "/go-live"}
        >
          <LiveIcon className="h-15 w-15 mr-2" />
          Go Live
        </Button>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default Navbar;
