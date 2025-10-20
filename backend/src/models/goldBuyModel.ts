import mongoose, { Schema, Document, Model } from "mongoose";
import {
  GoldBuy as GoldBuyType,
  GoldBuyItem,
} from "@payvue/shared/types/goldBuy";
import { Payment } from "@payvue/shared/types/payment";

/* ------------------------------------------------------------------ */
/* ------------------------ Gold Buy Item Schema -------------------- */
/* ------------------------------------------------------------------ */
const GoldBuyItemSchema = new Schema<GoldBuyItem>(
  {
    type: { type: String, required: true },
    metal: {
      type: String,
      enum: ["gold", "silver", "platinum"],
      required: true,
    },
    karat: { type: Number, required: true },
    purity: { type: Number, required: true },
    testMethod: { type: String },
    notes: { type: String },
    weightGrams: { type: Number, required: true },
    stoneWeightGrams: { type: Number, default: 0 },
    netWeightGrams: { type: Number, required: true },
    fineGoldGrams: { type: Number, required: true },
    lineFees: { type: Number, default: 0 },
    linePayout: { type: Number, required: true },
    photos: [{ type: String }],
  },
  { _id: false }
);

/* ------------------------------------------------------------------ */
/* --------------------------- Payment Schema ----------------------- */
/* ------------------------------------------------------------------ */
const PaymentSchema = new Schema<Payment>(
  {
    method: {
      type: String,
      enum: ["cash", "credit", "debit", "others"],
      required: true,
    },
    amount: { type: Number, required: true },
    referenceNumber: { type: String },
    paidAt: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { _id: false }
);

/* ------------------------------------------------------------------ */
/* ---------------------------- KYC Schema -------------------------- */
/* ------------------------------------------------------------------ */
const KYCSchema = new Schema(
  {
    idType: { type: String, required: true },
    idNumber: { type: String, required: true },
    state: { type: String },
    expiry: { type: String },
    idPhotos: [{ type: String }],
    customerPhoto: { type: String },
  },
  { _id: false }
);

/* ------------------------------------------------------------------ */
/* -------------------------- Pricing Schema ------------------------ */
/* ------------------------------------------------------------------ */
const PricingSchema = new Schema(
  {
    livePricePerGram24k: { type: Number, required: true },
    buyRate: { type: Number, required: true },
    fees: {
      testFee: { type: Number, default: 0 },
      refiningPerGram: { type: Number, default: 0 },
      flatFees: [{ type: Number, default: [] }],
    },
    roundingRule: {
      type: String,
      enum: ["nearest", "floor", "ceil"],
      default: "nearest",
    },
  },
  { _id: false }
);

/* ------------------------------------------------------------------ */
/* --------------------------- Totals Schema ------------------------ */
/* ------------------------------------------------------------------ */
const TotalsSchema = new Schema(
  {
    fineGoldGrams: { type: Number, required: true },
    gross: { type: Number, required: true },
    fees: { type: Number, required: true },
    payout: { type: Number, required: true },
  },
  { _id: false }
);

/* ------------------------------------------------------------------ */
/* ------------------------- Post-Buy Schema ------------------------ */
/* ------------------------------------------------------------------ */
const PostBuySchema = new Schema(
  {
    disposition: { type: String, enum: ["scrap", "resale"], required: true },
    refiningLotId: { type: String },
    inventoryItemIds: [{ type: String }],
  },
  { _id: false }
);

/* ------------------------------------------------------------------ */
/* -------------------------- Main Schema --------------------------- */
/* ------------------------------------------------------------------ */
interface GoldBuyDoc extends Omit<GoldBuyType, "id">, Document {}

interface GoldBuyModel extends Model<GoldBuyDoc> {
  build(attrs: GoldBuyType): GoldBuyDoc;
}

const GoldBuySchema = new Schema<GoldBuyDoc>(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: [
        "draft",
        "testing",
        "quoted",
        "accepted",
        "paid",
        "posted",
        "cancelled",
        "void",
      ],
      default: "draft",
      index: true,
    },
    customerInformation: {
      type: Object,
      required: true,
    },
    kyc: KYCSchema,
    items: { type: [GoldBuyItemSchema], required: true },
    pricing: { type: PricingSchema, required: true },
    totals: { type: TotalsSchema, required: true },
    payments: [PaymentSchema],
    signatures: {
      customer: { type: String },
      staff: { type: String },
    },
    postBuy: PostBuySchema,
    storeId: { type: String },
    createdBy: { type: String },
    approvedBy: { type: String },
    overrideReasons: [{ type: String }],
    comment: { type: String },
  },
  { timestamps: true }
);

/* ------------------------------------------------------------------ */
/* ------------------------- Static Builder ------------------------- */
/* ------------------------------------------------------------------ */
GoldBuySchema.statics.build = (attrs: GoldBuyType) => new GoldBuy(attrs);

/* ------------------------------------------------------------------ */
/* ---------------------------- Export ------------------------------ */
/* ------------------------------------------------------------------ */
export const GoldBuy = mongoose.model<GoldBuyDoc, GoldBuyModel>(
  "GoldBuy",
  GoldBuySchema
);
