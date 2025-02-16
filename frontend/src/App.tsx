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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/login_status")
      .then((response) => response.json())
      .then((data) => {
        setIsLoggedIn(data.status);
        setUsername(data.username);
      })
      .catch((error) => {
        console.error("Error fetching login status:", error);
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, username, setIsLoggedIn, setUsername }}
    >
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <HomePage variant="personalised" /> : <HomePage />
              }
            />

            <Route path="/:streamerName" element={<StreamerRoute />} />
            <Route path="/user/:username" element={<UserPage />} />
            <Route
              path="/reset_password/:token"
              element={<ResetPasswordPage />}
            ></Route>
            <Route
              path="/category/:category_name"
              element={<CategoryPage />}
            ></Route>
            <Route path="/categories" element={<CategoriesPage />}></Route>
            <Route path="/results" element={<ResultsPage />}></Route>
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </BrowserRouter>
      </ContentProvider>
    </AuthContext.Provider>
  );
}

export default App;
