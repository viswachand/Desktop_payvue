import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { layawayRoutes } from "@/modules/layaway";
import { saleRoutes } from "@/modules/sales";
import { InventoryRoutes } from "@/modules/inventory";
import { reportsRoutes } from "@/modules/reports";
import { userRoutes } from "@/modules/user";
import { goldBuyRoutes } from "@/modules/goldBuy";
import { dashboardRoutes } from "@/modules/dashboard";
import PrivateRoute from "@/routes/PrivateRoute";
import AdminRoute from "@/routes/AdminRoute";
import PublicRoute from "@/routes/PublicRoute";
import PrintReceiptPage from "@/modules/receipts/PrintReceiptPage";
import PaymentPage from "./page/PaymentScreen";
import AppLayout from "@/components/layout/AppLayout";

interface AppProps {
  toggleTheme: () => void;
  currentMode: "light" | "dark";
}

const Login = lazy(() => import("@/page/Login"));
const SuccessScreen = lazy(() => import("@/page/PaymentSuccessPage"));
const AdminScreen = lazy(() => import("@/page/Admin"));
const PoliciesScreen = lazy(() => import("@/page/PoliciesPage"));
const PageNotFound = lazy(() => import("@/page/PageNotFound"));
const Unauthorized = lazy(() => import("@/page/Unauthorized"));

export default function App({ toggleTheme, currentMode }: AppProps) {
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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/print" element={<PrintReceiptPage />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route
            element={
              <AppLayout toggleTheme={toggleTheme} currentMode={currentMode} />
            }
          >
            {dashboardRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            {saleRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            {layawayRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            {InventoryRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            {goldBuyRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            <Route element={<AdminRoute />}>
              {reportsRoutes.map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
              {userRoutes.map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
              <Route path="/admin" element={<AdminScreen />} />
              <Route path="/policies" element={<PoliciesScreen />} />
            </Route>
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/success" element={<SuccessScreen />} />
          </Route>
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}
