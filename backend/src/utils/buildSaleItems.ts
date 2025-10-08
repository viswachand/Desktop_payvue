// backend/src/utils/buildSaleItems.ts
import { BadRequestError } from "../errors/badRequest-error";
import { Item } from "../models/itemModel";
import { SaleItem } from "@payvue/shared/types/sale";
import { AdminConfig } from "../models/adminModel";
import { toNumber } from "./helperFunctions";

/**
 * Builds sale items array from request payload.
 * - If item type is "inventory", fetch details from Item collection.
 * - Otherwise, uses payload directly.
 */
export const buildSaleItems = async (items: any[]): Promise<SaleItem[]> => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new BadRequestError("No items provided for sale.");
    }

    return Promise.all(
        items.map(async (i) => {

            if (i.type === "inventory") {
                if (!i.itemId) {
                    throw new BadRequestError("Inventory item must include itemId.");
                }

                const invItem = await Item.findById(i.itemId).lean();
                if (!invItem) {
                    throw new BadRequestError(`Inventory item not found: ${i.itemId}`);
                }

                return {
                    itemId: invItem._id.toString(),
                    type: "inventory",
                    sku: invItem.itemSKU,
                    name: invItem.itemName,
                    description: invItem.itemDescription,
                    costPrice: toNumber(invItem.costPrice),
                    quantity: toNumber(i.quantity ?? 1),
                    discount: toNumber(i.discount ?? 0),
                    taxApplied: i.taxApplied ?? true,
                };
            }

            // 🧾 Non-inventory items (custom, service, grill, gold)
            return {
                type: i.type.toLowerCase(),
                name: i.name,
                description: i.description ?? "",
                costPrice: toNumber(i.costPrice),
                quantity: toNumber(i.quantity),
                discount: toNumber(i.discount ?? 0),
                taxApplied: i.taxApplied ?? true,
            };
        })
    );
};

/**
 * Calculates subtotal, tax, and total for a sale.
 * Applies AdminConfig.taxRate and skips tax for non-taxable items.
 */
export const calculateTotals = async (
    items: any[],
    discountTotal: number
): Promise<{ subtotal: number; tax: number; total: number }> => {
    if (!Array.isArray(items) || items.length === 0) {
        return { subtotal: 0, tax: 0, total: 0 };
    }

    // 🔢 Safe number conversion
    const num = (val: any) => (isFinite(Number(val)) ? Number(val) : 0);

    // 🧮 Subtotal: costPrice * quantity - item discount
    const subtotal = items.reduce((acc, i) => {
        const price = num(i.costPrice ?? i.unitPrice ?? 0);
        const qty = num(i.quantity ?? 1);
        const discount = num(i.discount ?? 0);
        return acc + price * qty - discount;
    }, 0);

    // ⚙️ Get tax rate from AdminConfig (default 0)
    const config = await AdminConfig.findOne().lean();
    const taxRate = num(config?.taxRate ?? 0);

    // 💸 Tax only on taxable items
    const taxableSubtotal = items.reduce((acc, i) => {
        if (i.taxApplied === false) return acc;
        return acc + num(i.costPrice ?? i.unitPrice) * num(i.quantity ?? 1);
    }, 0);

    const tax = taxableSubtotal * taxRate;
    const total = subtotal - num(discountTotal) + tax;

    // ✅ Ensure safe finite values
    return {
        subtotal: Math.round(num(subtotal) * 100) / 100,
        tax: Math.round(num(tax) * 100) / 100,
        total: Math.round(num(total) * 100) / 100,
    };
};
