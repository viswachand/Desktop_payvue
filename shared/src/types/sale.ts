/* -------------------------- Payment Methods -------------------------- */

export type PaymentMethod = "cash" | "credit" | "debit" | "others";

/* -------------------------- Installment Type -------------------------- */
export interface Installment {
    amount: number;
    method: PaymentMethod;
    cashAmount?: number;
    cardAmount?: number;
    paidAt?: Date;
    dueDate?: Date;
}

/* -------------------------- Sale Item Types -------------------------- */
export type SaleItemType =
    | "inventory"
    | "custom"
    | "service"
    | "grill"
    | "gold_buy" | "repair"

export interface SaleItem {
    itemId?: string;
    type: SaleItemType;
    name: string;
    description?: string;
    costPrice: number;
    quantity: number;
    discount?: number;
    taxApplied?: boolean;
}

/* -------------------------- Customer Snapshot -------------------------- */
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

/* -------------------------- Main Sale -------------------------- */
export interface Sale {
    // link to customer if exists
    id?: string;
    customerId?: string;
    invoiceNumber?: string;

    saleType?: string;

    // snapshot at sale time
    customerInformation: SaleCustomerInfo;

    items: SaleItem[];

    subtotal?: number;
    tax?: number;
    discountTotal: number;
    total?: number;

    paidAmount?: number;
    balanceAmount?: number;

    status?: "paid" | "installment" | "pending" | "refunded" | "voided";

    policyTitle: string;
    policyDescription: string;

    isLayaway: boolean;
    installments?: Installment[];

    // Refunds
    isRefund?: boolean;
    refundedSaleId?: string;

    createdAt?: Date;
    updatedAt?: Date;
}
