import React, { useEffect } from "react";
import Logo from "../Layout/Logo";
import Button, { ToggleButton } from "../Input/Button";
import { LogInIcon, LogOutIcon, SettingsIcon, Radio as LiveIcon } from "lucide-react";
import SearchBar from "../Input/SearchBar";
import AuthModal from "../Auth/AuthModal";
import { useAuthModal } from "../../hooks/useAuthModal";
import { useAuth } from "../../context/AuthContext";
import QuickSettings from "../Settings/QuickSettings";
import { useSidebar } from "../../context/SidebarContext";
import { useQuickSettings } from "../../context/QuickSettingsContext";
import Sidebar from "./Sidebar";

interface NavbarProps {
	variant?: "home" | "no-searchbar" | "default";
}

const Navbar: React.FC<NavbarProps> = ({ variant = "default" }) => {
	const { isLoggedIn } = useAuth();
	const { showAuthModal, setShowAuthModal } = useAuthModal();
	const { showSideBar } = useSidebar();
	const { showQuickSettings, setShowQuickSettings } = useQuickSettings();
	const [justToggled, setJustToggled] = React.useState(false);

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
		setJustToggled(true);
		setTimeout(() => setJustToggled(false), 200);
	};

	// Keyboard shortcut to toggle sidebar
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "q" && document.activeElement == document.body) handleQuickSettings();
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [showQuickSettings]);

	return (
		<div
			id="navbar"
			className={`relative flex justify-evenly items-center ${variant === "home" ? "h-[45vh] flex-col" : "h-[15vh] col-span-2 flex-row"}`}
		>
			{isLoggedIn && window.innerWidth > 900 && <Sidebar />}
			<Logo extraClasses={variant != "home" && showSideBar && !window.location.pathname.includes("dashboard") ? "scale-0" : "duration-[3s]"} variant={variant} />
			{/* Login / Logout Button */}
			<Button
				extraClasses={`absolute top-[2vh] ${
					showSideBar ? "left-[16vw] duration-[0.5s]" : "left-[20px] duration-[1s]"
				} text-[1rem] flex items-center flex-nowrap z-[99]`}
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
			{/* Quick Settings Sidebar */}
			<ToggleButton
				extraClasses={`absolute group text-[1rem] top-[2vh] ${showQuickSettings ? "right-[21vw]" : "right-[20px]"} cursor-pointer z-[20]`}
				onClick={() => handleQuickSettings()}
				toggled={showQuickSettings}
			>
				<SettingsIcon className="h-[2vw] w-[2vw]" />
				{!showQuickSettings && !justToggled && (
					<small className="absolute flex items-center top-0 mr-2 right-0 h-full w-fit text-nowrap font-bold my-auto group-hover:right-full opacity-0 group-hover:opacity-100 group-hover:bg-black/30 p-1 rounded-md text-white transition-all">
						Press Q
					</small>
				)}
			</ToggleButton>
			<QuickSettings />

			{variant != "no-searchbar" && <SearchBar />}

			{/* Stream Button */}
			{isLoggedIn && !window.location.pathname.includes("dashboard") && (
				<Button
					extraClasses={`${variant === "home" ? "absolute top-[2vh] right-[10vw]" : ""} flex flex-row items-center`}
					onClick={() => (window.location.href = "/dashboard")}
				>
					<LiveIcon className="h-15 w-15 mr-2" />
					Stream Dashboard
				</Button>
			)}

			{showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
		</div>
	);
};

export default Navbar;
