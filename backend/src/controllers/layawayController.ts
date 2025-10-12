import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Sale } from "../models/saleModel";
import { BadRequestError } from "../errors/badRequest-error";
import { toNumber } from "../utils/helperFunctions";
import { successResponse, errorResponse } from "../utils/responseHandler";

/* ---------------- Get All Layaway Sales ---------------- */
export const getLayawaySales = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const layawaySales = await Sale.find({ isLayaway: true }).sort({ createdAt: -1 });
     successResponse(res, 200, "Layaway sales fetched successfully", layawaySales);
  } catch (error: any) {
     errorResponse(res, error, "Failed to fetch layaway sales");
  }
});

/* ---------------- Get Layaway by ID ---------------- */
export const getLayawayById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id).lean();
    if (!sale) throw new BadRequestError(`Layaway sale with ID ${id} not found`);
    if (!sale.isLayaway)
      throw new BadRequestError("This sale is not a layaway transaction.");

   successResponse(res, 200, "Layaway sale details fetched successfully", sale);
  } catch (error: any) {
   errorResponse(res, error, "Failed to fetch layaway sale details");
  }
});

/* ---------------- Add Payment ---------------- */
export const addLayawayPayment = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, method, cashAmount, cardAmount, paidAt } = req.body;

    if (!amount || amount <= 0)
      throw new BadRequestError("Payment amount must be greater than 0.");

    const sale = await Sale.findById(id);
    if (!sale) throw new BadRequestError(`Layaway sale with ID ${id} not found`);
    if (!sale.isLayaway)
      throw new BadRequestError("This sale is not a layaway transaction.");

    const newInstallment = {
      amount: toNumber(amount),
      method,
      cashAmount: toNumber(cashAmount ?? 0),
      cardAmount: toNumber(cardAmount ?? 0),
      paidAt: paidAt ? new Date(paidAt) : new Date(),
    };

    sale.installments = sale.installments || [];
    sale.installments.push(newInstallment);
    sale.paidAmount = toNumber(sale.paidAmount ?? 0) + toNumber(amount);
    sale.balanceAmount = Math.max(toNumber(sale.total ?? 0) - sale.paidAmount, 0);
    sale.status = sale.balanceAmount <= 0 ? "paid" : "installment";

    const updatedSale = await sale.save();

    successResponse(res, 200, "Payment added successfully", updatedSale);
  } catch (error: any) {
    errorResponse(res, error, "Failed to add layaway payment");
  }
});
