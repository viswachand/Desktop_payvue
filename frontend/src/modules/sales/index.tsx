import { lazy } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load pages
const Sale = lazy(() => import("./pages/ItemSale"));
const Service = lazy(() => import("./pages/serviceSale"));
const Custom = lazy(() => import("./pages/customSale"));
const History = lazy(() => import("./pages/SaleHistoryPage"));

export const saleRoutes: RouteObject[] = [
  {
    path: "/sale/item",
    element: <Sale/>,
  },
  {
    path: "/sale/service",
    element: <Service />,
  },
   {
    path: "/sale/custom",
    element: <Custom />,
  },
   {
    path: "/sale/history",
    element: <History />,
  },
];
