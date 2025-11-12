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

const generateInvoiceNumber = async (): Promise<string> => {
  let unique = false;
  let invoiceNumber = "";

  while (!unique) {
    const timePart = Date.now().toString(36).slice(-4).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 4).toUpperCase();
    invoiceNumber = `A1-${timePart}${randomPart}`;

    const exists = await Sale.exists({ invoiceNumber });
    if (!exists) unique = true;
  }

  return invoiceNumber;
};

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
    comment,
    isLayaway = false,
    isRefund = false,
    refundedSaleId,
    advanceAmount = 0,
    deliveryDate,
  } = req.body as SaleType;

  if (!items?.length)
    throw new BadRequestError("No items provided for sale.");
  if (!customerInformation?.firstName || !customerInformation?.phone)
    throw new BadRequestError("Customer information is incomplete.");
  if (!policyTitle || !policyDescription)
    throw new BadRequestError("Sale policy details are required.");

  const saleItems = await buildSaleItems(items);
  if (!saleItems.length)
    throw new BadRequestError("Sale must include items.");

  const isCustomOrder = saleItems.some((i) => i.type === "custom");

  const { subtotal, tax, total } = await calculateTotals(
    saleItems,
    discountTotal
  );

  const paidAmount = installments.reduce(
    (acc, i) => acc + toNumber(i.amount),
    0
  );

  const effectivePaidAmount = Math.max(paidAmount, toNumber(advanceAmount));
  const balanceAmount = Math.max(0, total - effectivePaidAmount);

  const invoiceNumber = await generateInvoiceNumber();

  const sale = Sale.build({
    invoiceNumber,
    customerInformation,
    items: saleItems,
    subtotal,
    tax,
    discountTotal,
    total,
    saleType,
    paidAmount: effectivePaidAmount,
    balanceAmount,
    advanceAmount: toNumber(advanceAmount),
    status: isRefund
      ? "refunded"
      : isCustomOrder
      ? "pending"
      : isLayaway
      ? balanceAmount > 0
        ? "installment"
        : "paid"
      : "paid",
    policyTitle,
    policyDescription,
    comment,
    isLayaway,
    installments,
    isRefund,
    refundedSaleId,
    isCustomOrder,
    deliveryDate,
  });

  const savedSale = await sale.save();

  const inventoryItemIds = saleItems
    .filter((i) => i.type === "inventory" && i.itemId)
    .map((i) => i.itemId);

  if (inventoryItemIds.length) {
    await Item.updateMany(
      { _id: { $in: inventoryItemIds } },
      { $set: { isSold: true } }
    );
  }

  res.status(201).json({
    success: true,
    message: isCustomOrder
      ? "Custom order created successfully"
      : "Sale created successfully",
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
    message: "Sale details fetched successfully",
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

  res.status(200).json({
    success: true,
    message: "Sale refunded successfully",
    data: sanitizeDocs(sale),
  });
});
