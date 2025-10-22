import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { ThemeWrapper } from "@/providers/ThemeProviderWrapper";
import "./App.css";
import "./print.css";

const isElectron = navigator.userAgent.toLowerCase().includes("electron");
const Router = isElectron ? HashRouter : BrowserRouter;

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <ThemeWrapper />
      </Router>
    </Provider>
  </StrictMode>
);
