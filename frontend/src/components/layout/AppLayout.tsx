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

  // Detect major route groups
  const isSaleRoute =
    location.pathname.startsWith("/sale/item") ||
    location.pathname.startsWith("/sale/service") ||
    location.pathname.startsWith("/sale/custom") ||
    location.pathname.startsWith("/sale/history");

  const isLayawayRoute = location.pathname.startsWith("/sale/layaway");

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Main sidebar */}
      <AppSidebar />

      {/* Secondary sidebar */}
      {isSaleRoute && <SubSidebar type="sale" />}
      {isLayawayRoute && <SubSidebar type="layaway" />}

      {/* Main content */}
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
