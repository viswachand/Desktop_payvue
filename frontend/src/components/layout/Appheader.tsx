import { useState, MouseEvent } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Box,Typography,Menu} from "../common";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { redirectToLogin } from "@/utils/setupAutoLogout";

interface AppHeaderProps {
  toggleTheme: () => void;
  currentMode: "light" | "dark";
}

export default function AppHeader({
  toggleTheme,
  currentMode,
}: AppHeaderProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    redirectToLogin();
    handleMenuClose();
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1,
        borderRadius: 0,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* <Box
            component="img"
            src="/logo.svg"
            alt="PayVue Logo"
            sx={{ height: 32, width: 32 }}
          /> */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            PayVue
          </Typography>
        </Stack>

        {/* Right: Actions */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Help">
            <IconButton color="inherit" size="large">
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton color="inherit" size="large">
              <NotificationsNoneIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Theme">
            <IconButton onClick={toggleTheme} color="inherit" size="large">
              {currentMode === "light" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <WbSunnyRoundedIcon />
              )}
            </IconButton>
          </Tooltip>

          {/* Manager Menu */}
          <Box>
            <Tooltip title="Manager Menu">
              <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    fontSize: 14,
                  }}
                >
                  M
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: 0,
                  overflow: "visible",
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ px: 2, pt: 1, pb: 0.5, color: "text.secondary" }}
              >
                Manager
              </Typography>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
