import {
  useTheme,
  Drawer,
  Box,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { menuItems } from "./sidebarConfig";
import { APPBAR_HEIGHT, SIDEBAR_WIDTH } from "@/utils/constants";

export default function AppSidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (item: any) => {
    if (item.subItems && item.subItems.length > 0) {
      navigate(item.subItems[0].path);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          pt: 2,
          pb: 2,
          top: `${APPBAR_HEIGHT}px`,
          height: `calc(100% - ${APPBAR_HEIGHT}px)`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: 1.5,
        }}
      >
        {menuItems.map((item) => {
          const isActive = (() => {
            if (item.subItems && item.subItems.length > 0) {
              return item.subItems.some((sub: any) =>
                location.pathname.startsWith(sub.path)
              );
            }
            if (item.path) return location.pathname === item.path;
            return false;
          })();

          return (
            <Tooltip key={item.label} title={item.label} placement="right" arrow>
              <Box
                onClick={() => handleMenuClick(item)}
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 1,
                  borderLeft: isActive
                    ? `3px solid ${theme.palette.primary.main}`
                    : "3px solid transparent",
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.04)"
                        : "rgba(255,255,255,0.08)",
                  },
                }}
              >
                <IconButton
                  color="inherit"
                  size="large"
                  disableRipple
                  sx={{
                    "&:hover": { backgroundColor: "transparent" },
                    p: 0,
                    mb: 1,
                  }}
                >
                  {item.icon}
                </IconButton>
                <Typography variant="caption" fontWeight={500}>
                  {item.label}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Drawer>
  );
}
