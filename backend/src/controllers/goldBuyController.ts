import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { GoldBuy } from "../models/goldBuyModel";
import { BadRequestError } from "../errors/badRequest-error";
import { sanitizeDocs } from "../utils/sanitizeDocs";
import { GoldBuy as GoldBuyType, GoldBuyItem } from "@payvue/shared/types/goldBuy";
import { toNumber } from "../utils/helperFunctions";

/* ------------------------------------------------------------------ */
/* -------------------------- Helper Logic -------------------------- */
/* ------------------------------------------------------------------ */

const calculateTotals = (items: GoldBuyItem[], livePrice: number, buyRate: number, testFee = 0, refiningPerGram = 0) => {
  let fineGoldGrams = 0;
  let gross = 0;

  for (const item of items) {
    fineGoldGrams += item.fineGoldGrams;
    gross += item.fineGoldGrams * livePrice * buyRate;
  }

  const refiningFees = refiningPerGram > 0 ? fineGoldGrams * refiningPerGram : 0;
  const fees = testFee + refiningFees;
  const payout = Math.max(gross - fees, 0);

  return { fineGoldGrams, gross, fees, payout };
};

/* ------------------------------------------------------------------ */
/* -------------------------- Create Gold Buy ----------------------- */
/* ------------------------------------------------------------------ */

export const createGoldBuy = asyncHandler(async (req: Request, res: Response) => {
  const {
    customerInformation,
    kyc,
    items,
    pricing,
    comment,
    storeId,
    createdBy,
  } = req.body as GoldBuyType;

  if (!items?.length) throw new BadRequestError("No items provided for gold buy.");
  if (!customerInformation?.firstName || !customerInformation?.phone)
    throw new BadRequestError("Customer information is incomplete.");
  if (!pricing?.livePricePerGram24k || !pricing?.buyRate)
    throw new BadRequestError("Pricing details are missing.");

  const { fineGoldGrams, gross, fees, payout } = calculateTotals(
    items,
    toNumber(pricing.livePricePerGram24k),
    toNumber(pricing.buyRate),
    toNumber(pricing.fees?.testFee),
    toNumber(pricing.fees?.refiningPerGram)
  );

  const ticketNumber = `GB-${Date.now()}`;

  const goldBuy = GoldBuy.build({
    ticketNumber,
    status: "draft",
    customerInformation,
    kyc,
    items,
    pricing,
    totals: { fineGoldGrams, gross, fees, payout },
    storeId,
    createdBy,
    comment,
  });

  const saved = await goldBuy.save();

  res.status(201).json({
    success: true,
    message: "Gold buy ticket created successfully",
    data: sanitizeDocs(saved),
  });
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get All Gold Buys --------------------- */
/* ------------------------------------------------------------------ */

export const getGoldBuys = asyncHandler(async (_req: Request, res: Response) => {
  const buys = await GoldBuy.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: "Gold buy tickets fetched successfully",
    data: sanitizeDocs(buys),
  });
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get Gold Buy By ID -------------------- */
/* ------------------------------------------------------------------ */

export const getGoldBuyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const buy = await GoldBuy.findById(id).lean();
  if (!buy) throw new BadRequestError(`Gold buy with ID ${id} not found`);

  res.status(200).json({
    success: true,
    message: "Gold buy details fetched successfully",
    data: sanitizeDocs(buy),
  });
});

/* ------------------------------------------------------------------ */
/* -------------------------- Update Gold Buy ----------------------- */
/* ------------------------------------------------------------------ */

export const updateGoldBuy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body as Partial<GoldBuyType>;

  const goldBuy = await GoldBuy.findById(id);
  if (!goldBuy) throw new BadRequestError(`Gold buy with ID ${id} not found`);

  if (["paid", "posted", "cancelled"].includes(goldBuy.status))
    throw new BadRequestError("This gold buy cannot be modified.");

  if (updates.items && updates.pricing) {
    const { fineGoldGrams, gross, fees, payout } = calculateTotals(
      updates.items,
      toNumber(updates.pricing.livePricePerGram24k),
      toNumber(updates.pricing.buyRate),
      toNumber(updates.pricing.fees?.testFee),
      toNumber(updates.pricing.fees?.refiningPerGram)
    );
    updates.totals = { fineGoldGrams, gross, fees, payout };
  }

  Object.assign(goldBuy, updates);
  const updated = await goldBuy.save();

  res.status(200).json({
    success: true,
    message: "Gold buy updated successfully",
    data: sanitizeDocs(updated),
  });
});

/* ------------------------------------------------------------------ */
/* -------------------------- Cancel Gold Buy ----------------------- */
/* ------------------------------------------------------------------ */

export const cancelGoldBuy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const goldBuy = await GoldBuy.findById(id);
  if (!goldBuy) throw new BadRequestError(`Gold buy with ID ${id} not found`);

  if (goldBuy.status === "cancelled" || goldBuy.status === "void")
    throw new BadRequestError("Gold buy is already cancelled.");

  goldBuy.status = "cancelled";
  goldBuy.overrideReasons = reason ? [reason] : [];
  await goldBuy.save();

  res.status(200).json({
    success: true,
    message: "Gold buy cancelled successfully",
    data: sanitizeDocs(goldBuy),
  });
});
