import { lazy } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load pages
const LayawayListPage = lazy(() => import("./pages/LayawayListPage"));
const LayawayDetailPage = lazy(() => import("./pages/LayawayDetailsPage"));

export const layawayRoutes: RouteObject[] = [
  {
    path: "sale/layaway",
    element: <LayawayListPage/>,
  },
  {
    path: "/sale/layaway/:id",
    element: <LayawayDetailPage />,
  },
];
