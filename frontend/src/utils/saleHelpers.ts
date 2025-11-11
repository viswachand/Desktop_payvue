import { CartItem } from "@/features/cart/cartSlice";

export const calculateSaleTotals = (
  cart: (CartItem & { type?: string; itemType?: string })[],
  discount = 0,
  taxRate = 8
) => {
  const toNum = (value: any, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const normalizedTaxRate =
    taxRate > 1 ? taxRate / 100 : Math.max(taxRate, 0);

  const { subtotal, taxableSubtotal } = cart.reduce(
    (acc, item) => {
      const price = toNum(item.costPrice);
      const qty = toNum(item.qty ?? item.quantity ?? 1, 1);
      const lineDiscount = toNum(item.discount);
      const lineSubtotal = Math.max(price * qty - lineDiscount, 0);
      const taxEligible = item.taxApplied === false ? 0 : lineSubtotal;

      return {
        subtotal: acc.subtotal + lineSubtotal,
        taxableSubtotal: acc.taxableSubtotal + taxEligible,
      };
    },
    { subtotal: 0, taxableSubtotal: 0 }
  );

  const tax = taxableSubtotal * normalizedTaxRate;

  const globalDiscount = Math.max(toNum(discount), 0);
  const totalBeforeDiscount = subtotal + tax;
  const total = Math.max(totalBeforeDiscount - globalDiscount, 0);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};
