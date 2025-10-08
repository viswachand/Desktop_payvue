import { CartItem } from "@/features/cart/cartSlice";

export const calculateSaleTotals = (cart: (CartItem & { type?: string })[], discount = 0) => {
    // ✅ Correct subtotal calculation
    const subtotal = cart.reduce(
        (acc, item) => acc + (item.costPrice || 0) * (item.qty || 1),
        0
    );

    // ✅ Only apply tax to inventory items
    const taxableSubtotal = cart
        .filter((item) => (item.type ?? "inventory") === "inventory")
        .reduce((acc, item) => acc + (item.costPrice || 0) * (item.qty || 1), 0);

    const tax = taxableSubtotal * 0.08;
    const totalBeforeDiscount = subtotal + tax;
    const total = Math.max(totalBeforeDiscount - discount, 0);

    return { subtotal, tax, total };
};
