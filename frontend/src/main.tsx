import { ThemeProvider } from "./context/ThemeContext";
import { createRoot } from "react-dom/client";
import "./assets/styles/index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
  <App />
  </ThemeProvider>
);
