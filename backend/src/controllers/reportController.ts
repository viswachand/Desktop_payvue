import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Sale } from "../models/saleModel";
import { BadRequestError } from "../errors/badRequest-error";
import { sanitizeDocs } from "../utils/sanitizeDocs";

/* ------------------------------------------------------------------ */
/* ----------------------- Get Sales Report ------------------------- */
/* ------------------------------------------------------------------ */

export const getSalesReport = asyncHandler(async (req: Request, res: Response) => {
  const { search, fromDate, toDate, saleType, status } = req.query;
  const filter: any = {};

  const hasFilters = search || fromDate || toDate || saleType || status;

  // Search by name or phone
  if (search) {
    const regex = new RegExp(search as string, "i");
    filter.$or = [
      { "customerInformation.firstName": regex },
      { "customerInformation.lastName": regex },
      { "customerInformation.phone": regex },
    ];
  }

  // Date range filter
  if (fromDate && toDate) {
    filter.createdAt = {
      $gte: new Date(fromDate as string),
      $lte: new Date(toDate as string),
    };
  }

  // Filter by sale type or payment status
  if (saleType) filter.saleType = saleType;
  if (status) filter.status = status;

  // If no parameters provided → return latest 50 records
  const query = hasFilters ? Sale.find(filter) : Sale.find({});
  const sales = await query
    .select(
      "invoiceNumber createdAt customerInformation saleType subtotal discountTotal tax total paidAmount status"
    )
    .sort({ createdAt: -1 })
    .limit(hasFilters ? 500 : 50) // small cap for performance; adjust as needed
    .lean();

  const formatted = sales.map((s) => ({
    id: s._id,
    invoiceNumber: s.invoiceNumber,
    date: s.createdAt,
    customer: `${s.customerInformation.firstName} ${s.customerInformation.lastName || ""}`.trim(),
    phone: s.customerInformation.phone,
    saleType: s.saleType,
    subtotal: s.subtotal || 0,
    discountTotal: s.discountTotal || 0,
    tax: s.tax || 0,
    total: s.total || 0,
    paidAmount: s.paidAmount || 0,
    status: s.status,
  }));

  res.status(200).json({
    success: true,
    message: hasFilters
      ? "Filtered sales report fetched successfully"
      : "Recent sales report fetched successfully",
    data: sanitizeDocs(formatted),
  });
});

/* ------------------------------------------------------------------ */
/* --------------------- Delete Sale from Report -------------------- */
/* ------------------------------------------------------------------ */

export const deleteSaleFromReport = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const sale = await Sale.findById(id);
  if (!sale) throw new BadRequestError(`Sale with ID ${id} not found`);

  await sale.deleteOne();

  res.status(200).json({
    success: true,
    message: "Sale deleted successfully from report",
  });
});
