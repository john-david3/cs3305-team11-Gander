import { useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StreamerRoute from "./components/Stream/StreamerRoute";
import NotFoundPage from "./pages/NotFoundPage";
import UserPage from "./pages/UserPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/AllCategoriesPage";
import ResultsPage from "./pages/ResultsPage";
import { SidebarProvider } from "./context/SidebarContext";
import { QuickSettingsProvider } from "./context/QuickSettingsContext";
import DashboardPage from "./pages/DashboardPage";
import { Brightness } from "./context/BrightnessContext";
import LoadingScreen from "./components/Layout/LoadingScreen";
import Following from "./pages/FollowingPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import VodsPage from "./pages/VodsPage";
import VodPlayer from "./pages/VodPlayer";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState<string | null>(null);
	const [userId, setUserId] = useState<number | null>(null);
	const [isLive, setIsLive] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [profilePicture, setProfilePicture] = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/user/login_status")
			.then((response) => response.json())
			.then((data) => {
				setUserId(data.user_id);
				setIsLoggedIn(data.status);
				setUsername(data.username);
			})
			.catch((error) => {
				console.error("Error fetching login status:", error);
				setIsLoggedIn(false);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		if (isLoggedIn) {
			checkUserStatus();
		}
	}, [username]);

	const checkUserStatus = async () => {
		if (!username) return;

		try {
			const response = await fetch(`/api/user/${username}/status`);
			const data = await response.json();
			setIsLive(data.is_live);
		} catch (error) {
			console.error("Error checking user status:", error);
		}
	};

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<Brightness>
			<AuthContext.Provider
				value={{
					isLoggedIn,
					username,
					userId,
					isLive,
					profilePicture,
					setIsLoggedIn,
					setUsername,
					setUserId,
					setIsLive,
					setProfilePicture,
				}}
			>
				<SidebarProvider>
					<QuickSettingsProvider>
						<BrowserRouter>
							<Routes>
								<Route path="/" element={<HomePage />} />
								<Route path="/dashboard" element={isLoggedIn ? <DashboardPage /> : <Navigate to="/" replace />} />
								<Route path="/:streamerName" element={<StreamerRoute />} />
								<Route path="/user/:username" element={<UserPage />} />
								<Route path="/reset_password/:token" element={<ResetPasswordPage />}></Route>
								<Route path="/user/unsubscribe/:token" element={<UnsubscribePage />}></Route>
								<Route path="/category/:categoryName" element={<CategoryPage />}></Route>
								<Route path="/categories" element={<CategoriesPage />}></Route>
								<Route path="/results" element={<ResultsPage />}></Route>
								<Route path="/404" element={<NotFoundPage />} />
								<Route path="/user/:username/following" element={<Following />} />
								<Route path="/vods/:username" element={<VodsPage />} />
								<Route path="/vods/:username/:vod_id" element={<VodPlayer />} />
								<Route path="*" element={<Navigate to="/404" replace />} />
							</Routes>
						</BrowserRouter>
					</QuickSettingsProvider>
				</SidebarProvider>
			</AuthContext.Provider>
		</Brightness>
	);
}

export default App;
