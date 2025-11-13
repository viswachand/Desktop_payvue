/* ------------------------------------------------------------------ */
/* -------------------------- Payment Methods ----------------------- */
/* ------------------------------------------------------------------ */

export type PaymentMethod = "cash" | "credit" | "debit" | "others";

/* ------------------------------------------------------------------ */
/* -------------------------- Installment Type ---------------------- */
/* ------------------------------------------------------------------ */
export interface Installment {
  amount: number;
  method: PaymentMethod;
  cashAmount?: number;
  cardAmount?: number;
  paidAt?: Date;
  dueDate?: Date;
}

/* ------------------------------------------------------------------ */
/* -------------------------- Sale Item Types ----------------------- */
/* ------------------------------------------------------------------ */
export type SaleItemType =
  | "inventory"
  | "custom"
  | "service"
  | "grill"
  | "gold_buy"
  | "repair";

/* ------------------------------------------------------------------ */
/* -------------------------- Sale Item ----------------------------- */
/* ------------------------------------------------------------------ */

export interface SaleItem {
  itemId?: string;
  type: SaleItemType;
  name: string;
  description?: string;
  costPrice: number; // total price (including charges, weight × rate, etc.)
  quantity: number;
  discount?: number;
  taxApplied?: boolean;

  /* 🧩 Custom Order / Gold Specific Fields */
  material?: string;       // Gold, Silver, Platinum, etc.
  weight?: number;         // grams
  goldPrice?: number;      // current gold rate per gram at sale time
  makingCharge?: number;   // additional making charge
  laborCharge?: number;    // optional manual labor charge
  deliveryDate?: Date;     // expected delivery date for custom jewelry
}

/* ------------------------------------------------------------------ */
/* -------------------------- Customer Snapshot --------------------- */
/* ------------------------------------------------------------------ */

export interface SaleCustomerInfo {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  address1?: string;
  address2?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

/* ------------------------------------------------------------------ */
/* -------------------------- Main Sale ----------------------------- */
/* ------------------------------------------------------------------ */

export interface SaleSignature {
  imageData: string;         // data URL (image/png;base64,...)
  format: string;            // mime type, e.g. image/png
  padType?: string;          // e.g. "topaz-sigweb", "manual"
  capturedAt: string | Date; // ISO timestamp of capture
  rawData?: string;          // optional SigPlus string for audit
  meta?: Record<string, any>;
}

export interface Sale {
  id?: string;
  customerId?: string;
  invoiceNumber?: string;

  saleType?: string; // "inventory", "service", "custom", etc.

  /* Snapshot at sale time */
  customerInformation: SaleCustomerInfo;

  items: SaleItem[];

  subtotal?: number;
  tax?: number;
  discountTotal: number;
  total?: number;

  paidAmount?: number;
  balanceAmount?: number;
  advanceAmount?: number; 

  status?: "paid" | "installment" | "pending" | "refunded" | "voided";

  policyTitle: string;
  policyDescription: string;
  comment?: string;

  isLayaway: boolean;
  isHistoricalLayaway?:boolean;
  installments?: Installment[];

  /* Refunds */
  isRefund?: boolean;
  refundedSaleId?: string;

  /* Signature */
  signature?: SaleSignature;

  /* 🧩 Custom Order Specific */
  isCustomOrder?: boolean; // true when sale contains at least one custom item
  deliveryDate?: Date;     // overall delivery date for the order

  createdAt?: Date;
  updatedAt?: Date;
}


export interface SalePayload {
  saleType: SaleItemType;

  /* Customer snapshot */
  customerInformation: SaleCustomerInfo;

  /* Items being sold */
  items: SaleItem[];

  /* Totals & Discounts */
  discountTotal: number;
  comment?: string;

  /* Payment details */
  installments: Installment[];
  isLayaway: boolean;
  isHistoricalLayaway?:boolean;
  isRefund: boolean;

  /* Policy details */
  policyTitle: string;
  policyDescription: string;

  /* Customer signature */
  signature?: SaleSignature;
}
