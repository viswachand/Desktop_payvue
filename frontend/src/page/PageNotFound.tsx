import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@/components/common";
import img from "@/assets/page_not_found_dark.png"


const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 6 },
          textAlign: "center",
          borderRadius: 3,
          maxWidth: 480,
        }}
      >
        <Box
          component="img"
          {...({
            src: img,
            alt: "Logo",
          } as React.ComponentProps<"img">)}
          sx={{
            width: "65%",
            maxWidth: 300,
            height: "auto",
            mx: "auto",
            mb: 3,
            display: "block",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
          }}
        />

        <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
          404
        </Typography>

        <Typography variant="h6" color="text.primary" gutterBottom>
          Page Not Found
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={4}>
          Sorry, the page you are looking for does not exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
          sx={{ px: 3, py: 1, borderRadius: 2 }}
        >
          Go to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
