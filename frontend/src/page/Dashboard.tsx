import React from "react";
import { Box, Typography, Button } from "@/components/common";
import AppHeader from "@/components/layout/Appheader";

const Dashboard: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 3,
      }}
    >
      <Typography variant="h4" fontWeight={600}>
        Welcome to PayVue Dashboard 🚀
      </Typography>
    </Box>
  );
};

export default Dashboard;
