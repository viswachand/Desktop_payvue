// sidebarConfig.ts
// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import InventoryIcon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PolicyIcon from "@mui/icons-material/Policy";
import SettingsIcon from "@mui/icons-material/Settings";

export const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    label: "Sale",
    icon: <PointOfSaleIcon />,
    subItems: [
      { label: "Item", path: "/sale/item" },
      { label: "Service", path: "/sale/service" },
      { label: "Grill", path: "/sale/grill" },
      { label: "Custom", path: "/sale/custom" },
    ],
  },
  {
    label: "GoldBuy",
    icon: <CurrencyExchangeIcon />,
    path: "/goldbuy",
  },
  {
    label: "Inventory",
    icon: <InventoryIcon />,
    path: "/inventory",
  },
  {
    label: "Customers",
    icon: <PeopleIcon />,
    path: "/customers",
  },
  {
    label: "Reports",
    icon: <AssessmentIcon />,
    path: "/reports",
  },
  {
    label: "Policies",
    icon: <PolicyIcon />,
    path: "/policies",
  },
  { label: "Admin Config", icon: <SettingsIcon />, path: "/admin - config" },
];
