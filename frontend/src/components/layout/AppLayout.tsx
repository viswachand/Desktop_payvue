import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppHeader from "./Appheader";
import AppSidebar from "./AppSidebar";
import SubSidebar from "./secoundSidBar";

interface AppLayoutProps {
  toggleTheme: () => void;
  currentMode: "light" | "dark";
}

export default function AppLayout({ toggleTheme, currentMode }: AppLayoutProps) {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <AppSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Conditional sub-sidebar for sales */}
      {activeMenu === "sale" && <SubSidebar />}

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppHeader toggleTheme={toggleTheme} currentMode={currentMode} />

        {/* Page content */}
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
