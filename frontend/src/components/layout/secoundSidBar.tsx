import { Drawer, Box, Typography, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  APPBAR_HEIGHT,
  SIDEBAR_WIDTH,
  SUB_SIDEBAR_WIDTH,
} from "@/utils/constants";
import { selectIsAdmin } from "@/features/auth/authSlice";

interface SubSidebarProps {
  type: "sale" | "layaway";
}

const saleMenu = [
  { label: "Item", path: "/sale/item" },
  { label: "Service", path: "/sale/service" },
  { label: "Custom", path: "/sale/custom" },
  { label: "Sale History", path: "/sale/history" },
];

const layawayMenu = [
  { label: "Layaway List", path: "/sale/layaway" },
  {
    label: "Historical Layaway",
    path: "/sale/layaway/historicalayaway",
    adminOnly: true,
  },
];

export default function SubSidebar({ type }: SubSidebarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useSelector(selectIsAdmin);

  const items =
    type === "sale"
      ? saleMenu
      : layawayMenu.filter((item) => !item.adminOnly || isAdmin);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SUB_SIDEBAR_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: SUB_SIDEBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[50]
              : theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
          top: `${APPBAR_HEIGHT}px`,
          left: `${SIDEBAR_WIDTH}px`,
          height: `calc(100% - ${APPBAR_HEIGHT}px)`,
          display: "flex",
          flexDirection: "column",
          py: 3,
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Box
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: "pointer",
                px: 3,
                py: 1,
                borderLeft: isActive
                  ? `3px solid ${theme.palette.primary.main}`
                  : "3px solid transparent",
                backgroundColor: isActive
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isActive ? 600 : 500,
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );
}
