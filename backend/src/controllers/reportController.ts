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

  if (search) {
    const regex = new RegExp(search as string, "i");
    filter.$or = [
      { "customerInformation.firstName": regex },
      { "customerInformation.lastName": regex },
      { "customerInformation.phone": regex },
    ];
  }

  if (fromDate && toDate) {
    filter.createdAt = {
      $gte: new Date(fromDate as string),
      $lte: new Date(toDate as string),
    };
  }

  if (saleType) filter.saleType = saleType;
  if (status) filter.status = status;

  const sales = await Sale.find(filter)
    .sort({ createdAt: -1 })
    .limit(Object.keys(filter).length > 0 ? 500 : 50);

  res.status(200).json({
    success: true,
    message: "Sales report fetched successfully",
    data: sanitizeDocs(sales),
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
