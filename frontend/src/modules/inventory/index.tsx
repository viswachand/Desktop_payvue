import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const InventoryPage = lazy(() => import("./pages/InventoryListPage"));
const AddItemPage = lazy(() => import("./components/addItemForm"));

export const InventoryRoutes: RouteObject[] = [
  {
    path: "/inventory",
    element: <InventoryPage />,
  },
  {
    path: "/inventory/addItem",
    element: <AddItemPage />,
  },
  {
    path: "/inventory/addItem/:id",
    element: <AddItemPage />,
  },
];
