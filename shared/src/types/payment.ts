/* ------------------------------------------------------------------ */
/* ----------------------- Generic Payment Type --------------------- */
/* ------------------------------------------------------------------ */

export type PaymentMethod = "cash" | "credit" | "debit" | "others";

export interface Payment {
  method: PaymentMethod;
  amount: number;
  referenceNumber?: string; // optional transaction/check reference
  paidAt?: Date;
  notes?: string;
}
