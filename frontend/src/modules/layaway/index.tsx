import { lazy } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load existing pages
const LayawayListPage = lazy(() => import("./pages/LayawayListPage"));
const LayawayDetailPage = lazy(() => import("./pages/LayawayDetailsPage"));

// Lazy load new historical layaway page from its module
const AddHistoricalLayawayPage = lazy(
  () => import("../historicalLayaway/pages/AddHistoricalLayawayPage")
);

export const layawayRoutes: RouteObject[] = [
  {
    path: "sale/layaway",
    element: <LayawayListPage />,
  },
  {
    path: "sale/layaway/:id",
    element: <LayawayDetailPage />,
  },
  {
    path: "sale/layaway/historicalayaway",
    element: <AddHistoricalLayawayPage />,
  },
];
