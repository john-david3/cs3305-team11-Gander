import { StrictMode } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { createRoot } from "react-dom/client";
import "./assets/styles/index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider>
  <App />
  </ThemeProvider>
  // </StrictMode>,
);
