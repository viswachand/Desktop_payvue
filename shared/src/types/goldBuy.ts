import { Customer } from "./customer";
import { Payment } from "./payment";

/* ----------------------------- Gold Buy Item ----------------------------- */
export interface GoldBuyItem {
  id?: string;
  type: string; // e.g. "ring", "chain", "scrap"
  metal: "gold" | "silver" | "platinum";
  karat: number; // 24, 22, 18, etc.
  purity: number; // derived (e.g. 22k → 0.9167)
  testMethod?: string; // "acid", "xrf", etc.
  notes?: string;
  weightGrams: number;
  stoneWeightGrams?: number;
  netWeightGrams: number; // weight - stones
  fineGoldGrams: number; // netWeight × purity
  lineFees?: number;
  linePayout: number;
  photos?: string[]; // uploaded image URLs
}

/* ---------------------------- Gold Buy Pricing --------------------------- */
export interface GoldBuyPricing {
  livePricePerGram24k: number; // current 24k market price
  buyRate: number; // e.g. 0.9 = 90%
  fees?: {
    testFee?: number;
    refiningPerGram?: number;
    flatFees?: number[];
  };
  roundingRule?: "nearest" | "floor" | "ceil";
}

/* ------------------------------- Signatures ------------------------------ */
export interface GoldBuySignatures {
  customer?: string; // base64 or file URL
  staff?: string;
}

/* ----------------------------- Disposition ------------------------------- */
export interface PostBuyDisposition {
  disposition: "scrap" | "resale";
  refiningLotId?: string;
  inventoryItemIds?: string[];
}

/* ------------------------------- Main Type ------------------------------- */
export interface GoldBuy {
  id?: string;
  ticketNumber: string;
  status:
    | "draft"
    | "testing"
    | "quoted"
    | "accepted"
    | "paid"
    | "posted"
    | "cancelled"
    | "void";

  customerInformation: Customer;
  kyc?: {
    idType: string;
    idNumber: string;
    state?: string;
    expiry?: string;
    idPhotos?: string[];
    customerPhoto?: string;
  };

  items: GoldBuyItem[];
  pricing: GoldBuyPricing;

  totals: {
    fineGoldGrams: number;
    gross: number;
    fees: number;
    payout: number;
  };

  payments?: Payment[];

  signatures?: GoldBuySignatures;

  postBuy?: PostBuyDisposition;

  storeId?: string;
  createdBy?: string;
  approvedBy?: string;

  overrideReasons?: string[];
  comment?: string;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
