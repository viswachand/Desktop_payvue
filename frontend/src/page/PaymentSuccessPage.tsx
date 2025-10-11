import React, { useEffect, useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(60); // 🕐 1 min countdown

  // Countdown logic
  useEffect(() => {
    if (seconds <= 0) {
      navigate("/sale/item");
      return;
    }
    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, navigate]);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* ✅ Animated success icon (pulsing loop) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [1, 0.9, 1],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity, // 🔁 Continuous animation
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 120,
            color: theme.palette.success.main,
            mb: 2,
          }}
        />
      </motion.div>

      {/* 🎉 Success message */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Payment Successful
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 360, mb: 4 }}
      >
        Your payment has been completed successfully.  
        Thank you for choosing <strong>PayVue POS</strong>!
      </Typography>

      {/* 🔘 Action buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/sale/item")}
          sx={{
            px: 4,
            py: 1.2,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          New Sale
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/sale/history")}
          sx={{
            px: 4,
            py: 1.2,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          View Receipt
        </Button>
      </Box>

      {/* 🕒 Countdown display */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 4 }}
      >
        Redirecting to Sale page in {seconds}s...
      </Typography>
    </Box>
  );
}
