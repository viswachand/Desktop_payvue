import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

// Route guards
import PrivateRoute from "@/routes/PrivateRoute";
import AdminRoute from "@/routes/AdminRoute";
import PublicRoute from "@/routes/PublicRoute";

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


//Sale Routes
const Sales = lazy(() => import("@/modules/sales/ItemSale"));
const Service = lazy(() => import("@/modules/sales/serviceSale"));
const Custom = lazy(() => import("@/modules/sales/customSale"));
const History = lazy(() => import("@/modules/sales/SaleHistoryPage"));

//AdminConfig
const Admin = lazy(() => import("@/page/Admin"));

const SuccessScreen = lazy(() => import("@/page/PaymentSuccessPage"))

const PaymentScreen = lazy(() => import("@/modules/sales/PaymentScreen"));
const PageNotFound = lazy(() => import("@/page/PageNotFound"));
const Unauthorized = lazy(() => import("@/page/Unauthorized"));

function App({ toggleTheme, currentMode }: AppProps) {
  return (
    <Suspense>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route
            element={
              <AppLayout toggleTheme={toggleTheme} currentMode={currentMode} />
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sale/item" element={<Sales />} />
            <Route path="/sale/service" element={<Service />} />
            <Route path="/sale/custom" element={<Custom />} />
            <Route path="/sale/history" element={<History />} />
            <Route path="/sale/item/payment" element={<PaymentScreen />} />

            <Route path="/success" element={<SuccessScreen />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
