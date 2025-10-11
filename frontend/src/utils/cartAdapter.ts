// frontend/utils/cartAdapter.ts
import { Item } from "@payvue/shared/types/item";

export function normalizeCartItem(item: any): Item {
  return {
    ...item,
    // Normalize naming — ensures every item has itemName
    itemName: item.itemName ?? item.name ?? item.type ?? "Unnamed Item",
  };
}
