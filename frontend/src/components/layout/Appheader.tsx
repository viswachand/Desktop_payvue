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
import { Box, Typography, Menu } from "../common";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "@/features/auth/authSlice";
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
  const currentUser = useSelector(selectCurrentUser);
  const avatarInitial =
    currentUser?.firstName?.charAt(0)?.toUpperCase() ?? "M";
  const roleLabel =
    currentUser?.role ??
    (currentUser ? (currentUser.isAdmin ? "Admin" : "Staff") : "Role");
  const firstNameLabel = currentUser?.firstName ?? "";

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
        borderRadius: theme.shape.borderRadius,
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
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
           A - 1 JEWELERS
          </Typography>
        </Stack>

        {/* Right: Actions */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Toggle Theme">
            <IconButton onClick={toggleTheme} color="inherit" size="large">
              {currentMode === "light" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <WbSunnyRoundedIcon />
              )}
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Box>
            <Tooltip title={currentUser?.username ?? "User Menu"}>
              <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    fontSize: 14,
                  }}
                >
                  {avatarInitial}
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
              <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  {roleLabel}
                </Typography>
                {firstNameLabel && (
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    {firstNameLabel}
                  </Typography>
                )}
              </Box>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
