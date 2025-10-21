import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { layawayRoutes } from "@/modules/layaway";
import { saleRoutes } from "@/modules/sales";
import { InventoryRoutes } from "@/modules/inventory";
import { reportsRoutes } from "@/modules/reports";

// Route guards
import PrivateRoute from "@/routes/PrivateRoute";
import AdminRoute from "@/routes/AdminRoute";
import PublicRoute from "@/routes/PublicRoute";
import PaymentPage from "./page/PaymentScreen";

// Layout
import AppLayout from "@/components/layout/AppLayout";

// App props (theme toggling)
interface AppProps {
  toggleTheme: () => void;
  currentMode: "light" | "dark";
}

// Lazy-loaded pages
const Login = lazy(() => import("@/page/Login"));
const Dashboard = lazy(() => import("@/page/Dashboard"));
const SuccessScreen = lazy(() => import("@/page/PaymentSuccessPage"));

// Admin & Others
const AdminScreen = lazy(() => import("@/page/Admin"));
const PoliciesScreen = lazy(() => import("@/page/PoliciesPage"));
const PageNotFound = lazy(() => import("@/page/PageNotFound"));
const Unauthorized = lazy(() => import("@/page/Unauthorized"));

function App({ toggleTheme, currentMode }: AppProps) {
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
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route
            element={
              <AppLayout toggleTheme={toggleTheme} currentMode={currentMode} />
            }
          >
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {saleRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            {layawayRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}

            {InventoryRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            {reportsRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            {/* Payment Success */}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/success" element={<SuccessScreen />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminScreen />} />
            <Route path="/policies" element={<PoliciesScreen />} />
          </Route>
        </Route>

        {/* Errors / Redirects */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
