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

      const sanitizedItems = items.map((item: any) => ({
        ...item,
        quantity: toNumber(item.quantity ?? 0),
        costPrice: toNumber(item.costPrice ?? 0),
        discount: toNumber(item.discount ?? 0),
      }));

      const sanitizedInstallments = installments.map((installment: any) => {
        const normalizedPaidAt = installment.paidAt
          ? new Date(installment.paidAt)
          : undefined;
        if (
          normalizedPaidAt &&
          Number.isNaN(normalizedPaidAt.getTime())
        ) {
          throw new BadRequestError("Invalid payment date provided.");
        }

        return {
          ...installment,
          amount: toNumber(installment.amount ?? 0),
          paidAt: normalizedPaidAt,
        };
      });

      // ---------------- Calculate Financials ----------------
      const paidAmount = sanitizedInstallments.reduce(
        (sum: number, i: any) => sum + toNumber(i.amount ?? 0),
        0
      );

      const normalizedSubtotal = toNumber(subtotal);
      const normalizedTax = toNumber(tax);
      const normalizedDiscountTotal = toNumber(discountTotal);
      const normalizedTotal = toNumber(total);

      const balanceAmount = Math.max(normalizedTotal - paidAmount, 0);

      const invoiceNumber = `VCR-${Date.now()}`;

      const normalizedSaleDate = saleDate ? new Date(saleDate) : new Date();
      if (Number.isNaN(normalizedSaleDate.getTime())) {
        throw new BadRequestError("Invalid sale date provided.");
      }

      // ---------------- Build Sale Document ----------------
      const sale = Sale.build({
        invoiceNumber,
        customerInformation,
        items: sanitizedItems,
        subtotal: normalizedSubtotal,
        tax: normalizedTax,
        saleType,
        discountTotal: normalizedDiscountTotal,
        total: normalizedTotal,
        paidAmount,
        balanceAmount,
        status: balanceAmount <= 0 ? "paid" : "installment",
        installments: sanitizedInstallments,
        comment,
        policyTitle,
        policyDescription,
        isLayaway: true,
        isHistoricalLayaway: true,
        createdAt: normalizedSaleDate,
      });

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
