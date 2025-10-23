import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import AdminDashboardPage from "@/modules/dashboard/pages/AdminDashboardPage";

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      }
    >
      <AdminDashboardPage />
    </Suspense>
  );
}
