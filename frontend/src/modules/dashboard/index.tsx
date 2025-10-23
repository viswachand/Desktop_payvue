import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <AdminDashboardPage />,
  },
];
