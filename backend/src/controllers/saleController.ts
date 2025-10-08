import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import axios from "axios";
import { Sale } from "../models/saleModel";
import { Item } from "../models/itemModel";
import { BadRequestError } from "../errors/badRequest-error";
import { calculateTotals, buildSaleItems } from "../utils/buildSaleItems";
import { toNumber } from "../utils/helperFunctions";
import { sanitizeDocs } from "../utils/sanitizeDocs";
import { Sale as SaleType } from "@payvue/shared/types/sale";
import { notifyN8n } from "../services/n8nService";

/* ------------------------ Config ------------------------ */
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/sale-notify";

/* ------------------------ Create Sale ------------------------ */
export const createSale = asyncHandler(async (req: Request, res: Response) => {
    const {
        customerInformation,
        items,
        saleType,
        discountTotal = 0,
        installments = [],
        policyTitle,
        policyDescription,
        isLayaway = false,
        isRefund = false,
        refundedSaleId,
    } = req.body as SaleType;

    // ✅ Validation
    if (!items?.length) throw new BadRequestError("No items provided for sale.");
    if (!customerInformation?.firstName || !customerInformation?.phone)
        throw new BadRequestError("Customer information is incomplete.");
    if (!policyTitle || !policyDescription)
        throw new BadRequestError("Sale policy details are required.");

    // ✅ Build sale items
    const saleItems = await buildSaleItems(items);
    if (!saleItems.length) throw new BadRequestError("Sale must include items.");

    // ✅ Calculate totals
    const { subtotal, tax, total } = await calculateTotals(saleItems, discountTotal);
    const paidAmount = installments.reduce((acc, i) => acc + toNumber(i.amount), 0);
    const balanceAmount = Math.max(0, total - paidAmount);
    const invoiceNumber = `VCR-${Date.now()}`;

    // ✅ Create & Save
    const sale = Sale.build({
        invoiceNumber,
        customerInformation,
        items: saleItems,
        subtotal,
        tax,
        discountTotal,
        total,
        saleType: saleType,
        paidAmount,
        balanceAmount,
        status: isRefund
            ? "refunded"
            : isLayaway
                ? balanceAmount > 0
                    ? "installment"
                    : "paid"
                : "paid",
        policyTitle,
        policyDescription,
        isLayaway,
        installments,
        isRefund,
        refundedSaleId,
    });

    const savedSale = await sale.save();

    // await notifyN8n("sale.created", {
    //     invoiceNumber,
    //     firstName: customerInformation.firstName,
    //     phone: customerInformation.phone,
    //     email: customerInformation.email,
    //     total,
    //     isLayaway,
    //     createdAt: savedSale.createdAt,
    // });

    const inventoryItemIds = saleItems
        .filter((i) => i.type === "inventory" && i.itemId)
        .map((i) => i.itemId);

    if (inventoryItemIds.length) {
        await Item.updateMany({ _id: { $in: inventoryItemIds } }, { $set: { isSold: true } });
    }


    res.status(201).json({
        success: true,
        message: "Sale created successfully",
        data: sanitizeDocs(savedSale),
    });
});

/* ------------------------ Get All Sales ----------------------- */
export const getSales = asyncHandler(async (_req: Request, res: Response) => {
    const sales = await Sale.find({}).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        message: "Sales fetched successfully",
        data: sanitizeDocs(sales),
    });
});

/* ----------------------- Get Sale by ID ----------------------- */
export const getSaleById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sale = await Sale.findById(id).lean();
    if (!sale) throw new BadRequestError(`Sale with ID ${id} not found`);
    res.status(200).json({
        success: true,
        message: "Sale details fetched",
        data: sanitizeDocs(sale),
    });
});

/* ------------------------ Refund Sale ------------------------- */
export const refundSale = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) throw new BadRequestError(`Sale with ID ${id} not found`);
    if (sale.isRefund) throw new BadRequestError("This sale is already refunded.");

    sale.isRefund = true;
    sale.status = "refunded";
    await sale.save();

    // ✅ Optional: Trigger refund workflow
    try {
        await axios.post(`${N8N_WEBHOOK_URL}-refund`, {
            saleId: sale._id,
            invoiceNumber: sale.invoiceNumber,
            refundedAt: sale.updatedAt,
        });
    } catch (err) {
        console.warn("[n8n] Refund webhook failed:", (err as Error).message);
    }

    res.status(200).json({
        success: true,
        message: "Sale refunded successfully",
        data: sanitizeDocs(sale),
    });
});
