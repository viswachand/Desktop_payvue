import React from "react";
import type { Sale } from "@payvue/shared/types/sale";

// Import all your specific receipt templates
import InventoryReceipt from "./InventoryReceipt";
// (You can add these later)
/// import ServiceReceipt from "./ServiceReceipt";
/// import CustomOrderReceipt from "./CustomOrderReceipt";

export default function PrintableReceipt({ data }: { data: Sale }) {
  if (!data) return <div>No data available</div>;

  // Pick which layout to render based on the sale type
  switch (data.saleType) {
    case "service":
    case "repair":
      // For now, reuse InventoryReceipt until ServiceReceipt is built
      return <InventoryReceipt data={data} />;

    case "custom":
      // For custom jewelry orders
      return <InventoryReceipt data={data} />;

    case "inventory":
    default:
      // Standard sale receipt
      return <InventoryReceipt data={data} />;
  }
}
