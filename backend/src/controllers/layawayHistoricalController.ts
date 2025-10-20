import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Sale } from "../models/saleModel";
import { BadRequestError } from "../errors/badRequest-error";
import { toNumber } from "../utils/helperFunctions";
import { successResponse, errorResponse } from "../utils/responseHandler";
import { Sale as SaleType } from "@payvue/shared/types/sale";

/**
 * @desc Create a Historical Layaway Sale (for pre-POS records)
 * @route POST /api/layaways/historical
 * @access Admin
 */
export const createHistoricalLayaway = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        customerInformation,
        items = [],
        subtotal = 0,
        tax = 0,
        discountTotal = 0,
        total = 0,
        installments = [],
        saleDate,
        saleType,
        comment,
        policyTitle,
        policyDescription,
      } = req.body;

      // ---------------- Validate Inputs ----------------
      if (!customerInformation?.firstName || !customerInformation?.phone)
        throw new BadRequestError("Customer information is required.");

      if (!items?.length)
        throw new BadRequestError("At least one item must be provided.");

      if (!policyTitle || !policyDescription)
        throw new BadRequestError("Policy details are required.");

      // ---------------- Calculate Financials ----------------
      const paidAmount = installments.reduce(
        (sum: number, i: any) => sum + toNumber(i.amount ?? 0),
        0
      );

      const balanceAmount = Math.max(toNumber(total) - paidAmount, 0);

      const invoiceNumber = `VCR-${Date.now()}`;

      // ---------------- Build Sale Document ----------------
      const sale = Sale.build({
        invoiceNumber,
        customerInformation,
        items,
        subtotal,
        tax,
        saleType,
        discountTotal,
        total,
        paidAmount,
        balanceAmount,
        status: balanceAmount <= 0 ? "paid" : "installment",
        installments,
        comment,
        policyTitle,
        policyDescription,
        isLayaway: true,
        isHistoricalLayaway: true,
        createdAt: saleDate ? new Date(saleDate) : new Date(),
      });

      console.log("Creating historical layaway sale:", sale);

      // ---------------- Save ----------------
      const savedSale = await sale.save();

      successResponse(
        res,
        201,
        "Historical layaway added successfully",
        savedSale
      );
    } catch (error: any) {
      errorResponse(res, error, "Failed to add historical layaway");
    }
  }
);
