import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, useTheme } from "@/components/common";
import img from "@/assets/access.png";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

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
        {/* ✅ Removed invalid cast */}
        <Box
          component="img"
          src={img}
          alt="Access Denied Illustration"
          sx={{
            width: "70%",
            maxWidth: 300,
            height: "auto",
            mx: "auto",
            mb: 3,
          }}
        />

        <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
          Access Denied
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={4}>
          You don’t have permission to view this page.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")}
          sx={{ px: 3, py: 1, borderRadius: theme.shape.borderRadius }}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default Unauthorized;
