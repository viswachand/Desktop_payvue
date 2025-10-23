import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const GoldBuyListPage = lazy(() => import("./pages/GoldBuyListPage"));
const GoldBuyCreatePage = lazy(() => import("./pages/GoldBuyCreatePage"));

export const goldBuyRoutes: RouteObject[] = [
  {
    path: "/goldbuy",
    element: <GoldBuyListPage />,
  },
  {
    path: "/goldbuy/new",
    element: <GoldBuyCreatePage />,
  },
];
