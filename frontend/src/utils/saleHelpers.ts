import { CartItem } from "@/features/cart/cartSlice";

export const calculateSaleTotals = (
  cart: (CartItem & { type?: string })[],
  discount = 0,
  taxRate = 8
) => {
  // normalize percentage
  const normalizedTaxRate = taxRate > 1 ? taxRate / 100 : taxRate;

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.costPrice || 0) * (item.qty || 1),
    0
  );

  // 💰 Tax only applies to inventory items
  const taxableSubtotal = cart
    .filter((item) => item.type?.toLowerCase() === "inventory")
    .reduce((acc, item) => acc + (item.costPrice || 0) * (item.qty || 1), 0);

  const tax = taxableSubtotal * normalizedTaxRate;

  // 🏁 Final totals
  const totalBeforeDiscount = subtotal + tax;
  const total = Math.max(totalBeforeDiscount - discount, 0);

  return { subtotal, tax, total };
};
