import { useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { StreamsProvider } from "./context/StreamsContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StreamerRoute from "./components/Stream/StreamerRoute";
import NotFoundPage from "./pages/NotFoundPage";
import UserPage from "./pages/UserPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CategoryPage from "./pages/CategoryPage";

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
      <StreamsProvider>
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
            <Route path="/reset_password/:token" element={<ForgotPasswordPage />}></Route>
            <Route path="/category/:category_name" element={<CategoryPage />}></Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </StreamsProvider>
    </AuthContext.Provider>
  );
}

export default App;
