import { CartItem } from "@/features/cart/cartSlice";

export const calculateSaleTotals = (
  cart: (CartItem & { type?: string; itemType?: string })[],
  discount = 0,
  taxRate = 8
) => {
  const normalizedTaxRate =
    taxRate > 1 ? taxRate / 100 : Math.max(taxRate, 0);

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.costPrice ?? 0) * (item.qty ?? 1),
    0
  );

  // ✅ Detect either "type" or "itemType"
  const taxableSubtotal = cart
    .filter((item) => {
      const t =
        item.type ??
        (item as any).itemType ??
        "";
      return t.trim().toLowerCase() === "inventory";
    })
    .reduce(
      (acc, item) => acc + (item.costPrice ?? 0) * (item.qty ?? 1),
      0
    );

  const tax = taxableSubtotal * normalizedTaxRate;

  const totalBeforeDiscount = subtotal + tax;
  const total = Math.max(totalBeforeDiscount - discount, 0);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};
