import type { GoldBuy, GoldBuyItem, GoldBuyPricing } from "@payvue/shared/types/goldBuy";

export interface GoldBuyTotals {
  fineGoldGrams: number;
  gross: number;
  fees: number;
  payout: number;
}

export const calculateGoldBuyTotals = (
  items: Pick<GoldBuyItem, "fineGoldGrams" | "lineFees">[],
  pricing: Pick<GoldBuyPricing, "livePricePerGram24k" | "buyRate" | "fees">
): GoldBuyTotals => {
  const livePrice = Number(pricing.livePricePerGram24k) || 0;
  const buyRate = Number(pricing.buyRate) || 0;
  const testFee = Number(pricing.fees?.testFee) || 0;
  const refiningPerGram = Number(pricing.fees?.refiningPerGram) || 0;

  const summaries = items.reduce<{
    fineGoldGrams: number;
    gross: number;
    lineFees: number;
  }>(
    (acc, item) => {
      const fine = Number(item.fineGoldGrams) || 0;
      const lineFees = Number(item.lineFees) || 0;
      acc.fineGoldGrams += fine;
      acc.gross += fine * livePrice * buyRate;
      acc.lineFees += lineFees;
      return acc;
    },
    {
      fineGoldGrams: 0,
      gross: 0,
      lineFees: 0,
    }
  );

  const refiningFees =
    refiningPerGram > 0 ? summaries.fineGoldGrams * refiningPerGram : 0;
  const fees = testFee + refiningFees + summaries.lineFees;
  const payout = Math.max(summaries.gross - fees, 0);

  return {
    fineGoldGrams: Number(summaries.fineGoldGrams.toFixed(3)),
    gross: Number(summaries.gross.toFixed(2)),
    fees: Number(fees.toFixed(2)),
    payout: Number(payout.toFixed(2)),
  };
};

export const deriveGoldBuyItem = (
  input: {
    type: string;
    metal: "gold" | "silver" | "platinum";
    karat?: number;
    purity?: number;
    testMethod?: string;
    notes?: string;
    weightGrams: number;
    stoneWeightGrams?: number;
    lineFees?: number;
  },
  existingId: string | undefined,
  pricing: Pick<GoldBuyPricing, "livePricePerGram24k" | "buyRate">
): GoldBuyItem => {
  const weight = Number(input.weightGrams) || 0;
  const stoneWeight = Number(input.stoneWeightGrams) || 0;
  const netWeight = Math.max(weight - stoneWeight, 0);
  const purityFromKarat =
    input.metal === "gold" && input.karat
      ? Math.min(Math.max(input.karat / 24, 0), 1)
      : undefined;
  const purity = input.purity ?? purityFromKarat ?? 0;
  const fineGold = netWeight * purity;

  const livePrice = Number(pricing.livePricePerGram24k) || 0;
  const buyRate = Number(pricing.buyRate) || 0;
  const gross = fineGold * livePrice * buyRate;
  const lineFees = Number(input.lineFees) || 0;
  const linePayout = Math.max(gross - lineFees, 0);

  return {
    id: existingId ?? (input.type ? `${input.type}-${Date.now()}` : undefined),
    type: input.type,
    metal: input.metal,
    karat: input.karat ?? 0,
    purity,
    testMethod: input.testMethod,
    notes: input.notes,
    weightGrams: Number(weight.toFixed(3)),
    stoneWeightGrams: Number(stoneWeight.toFixed(3)) || undefined,
    netWeightGrams: Number(netWeight.toFixed(3)),
    fineGoldGrams: Number(fineGold.toFixed(3)),
    lineFees,
    linePayout: Number(linePayout.toFixed(2)),
  };
};

export const goldBuyStatuses: GoldBuy["status"][] = [
  "draft",
  "testing",
  "quoted",
  "accepted",
  "paid",
  "posted",
  "cancelled",
  "void",
];
