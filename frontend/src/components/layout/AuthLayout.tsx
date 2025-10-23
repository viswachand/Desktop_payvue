import React from "react";
import { Box, Grid, Paper } from "@/components/common";
import { useTheme } from "@mui/material/styles";
import logo from "@/assets/logo.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        background: theme.palette.background.login,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          width: { xs: "100%", sm: "90%", md: "70%", lg: "70%" },
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Left side with logo */}
        <Box
          sx={{
            flex: 1,
            bgcolor: theme.palette.background.auth,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* ✅ Removed invalid cast, use direct props */}
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: "100%",
              maxWidth: 300,
              filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.25))",
              transition: "transform 0.4s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
        </Box>

        {/* Right side with children */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 4, sm: 4 },
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 380 }}>{children}</Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default AuthLayout;
