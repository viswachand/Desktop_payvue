import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./Appheader";
import AppSidebar from "./AppSidebar";
import SubSidebar from "./secoundSidBar";

interface AppLayoutProps {
  toggleTheme: () => void;
  currentMode: "light" | "dark";
}

export default function AppLayout({ toggleTheme, currentMode }: AppLayoutProps) {
  const location = useLocation();
  const isSaleRoute = location.pathname.startsWith("/sale");

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* ✅ No props now */}
      <AppSidebar />

      {/* Show secondary sidebar only for sale routes */}
      {isSaleRoute && <SubSidebar />}

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppHeader toggleTheme={toggleTheme} currentMode={currentMode} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: 8,
            overflowY: "auto",
            position: "relative",
            bgcolor: "background.default",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
