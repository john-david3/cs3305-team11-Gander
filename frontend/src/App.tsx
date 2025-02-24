import { useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
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
import StreamDashboardPage from "./pages/StreamDashboardPage";
import { Brightness } from "./context/BrightnessContext";
import Sidebar from "./components/Navigation/Sidebar";
import LoadingScreen from "./components/Layout/LoadingScreen";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          setIsLoggedIn,
          setUsername,
          setUserId,
        }}
      >
        <ContentProvider>
          <SidebarProvider>
            <QuickSettingsProvider>
              <BrowserRouter>
                {isLoggedIn && window.innerWidth > 900 && <Sidebar />}
                <Routes>
                  <Route
                    path="/"
                    element={
                      isLoggedIn ? (
                        <HomePage variant="personalised" />
                      ) : (
                        <HomePage />
                      )
                    }
                  />
                  <Route
                    path="/go-live"
                    element={
                      isLoggedIn ? (
                        <StreamDashboardPage />
                      ) : (
                        <Navigate to="/" replace />
                      )
                    }
                  />
                  <Route path="/:streamerName" element={<StreamerRoute />} />
                  <Route path="/user/:username" element={<UserPage />} />
                  <Route
                    path="/reset_password/:token"
                    element={<ResetPasswordPage />}
                  ></Route>
                  <Route
                    path="/category/:categoryName"
                    element={<CategoryPage />}
                  ></Route>
                  <Route
                    path="/categories"
                    element={<CategoriesPage />}
                  ></Route>
                  <Route path="/results" element={<ResultsPage />}></Route>
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </BrowserRouter>
            </QuickSettingsProvider>
          </SidebarProvider>
        </ContentProvider>
      </AuthContext.Provider>
    </Brightness>
  );
}

export default App;
