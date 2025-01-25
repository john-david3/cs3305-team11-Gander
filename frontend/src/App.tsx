import { useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { StreamsProvider } from "./context/StreamsContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage, { PersonalisedHomePage } from "./pages/HomePage";
import StreamerRoute from "./components/Stream/StreamerRoute";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/get_login_status")
      .then((response) => response.json())
      .then((loggedIn) => {
        setIsLoggedIn(loggedIn);
      })
      .catch((error) => {
        console.error("Error fetching login status:", error);
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <StreamsProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={isLoggedIn ? <PersonalisedHomePage /> : <HomePage />}
            />
            <Route path="/:streamerName" element={<StreamerRoute />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </StreamsProvider>
    </AuthContext.Provider>
  );
}

export default App;
