import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const SalesReportPage = lazy(() => import("./pages/SalesReportPage"));

export const reportsRoutes: RouteObject[] = [
  {
    path: "/reports/sales",
    element: <SalesReportPage />,
  },
];
