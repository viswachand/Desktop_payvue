import mongoose from "mongoose";
import {
    Sale,
    SaleItem,
    Installment,
    SaleCustomerInfo,
} from "@payvue/shared/types/sale";
import { globalToJSONTransform } from "../utils/transform";

/* ---------------------- Document + Model Interfaces ---------------------- */
// export interface  extends mongoose.Document, Sale { }

export interface SaleDoc extends mongoose.Document, Omit<Sale, "id"> { }

interface SaleModel extends mongoose.Model<SaleDoc> {
    build(attrs: Sale): SaleDoc;
}

/* --------------------------- Installment Schema -------------------------- */
const installmentSchema = new mongoose.Schema<Installment>(
    {
        amount: { type: Number, required: true },
        method: {
            type: String,
            enum: ["cash", "credit", "debit", "mixed", "others"],
            required: true,
        },
        cashAmount: { type: Number },
        cardAmount: { type: Number },
        paidAt: { type: Date, default: Date.now },
        dueDate: { type: Date },
    },
    { _id: false }
);

/* ----------------------------- Sale Item Schema -------------------------- */
const saleItemSchema = new mongoose.Schema<SaleItem>(
    {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        type: {
            type: String,
            enum: ["inventory", "custom", "service", "grill", "gold_buy", "repair"],
            required: true,
        },
        name: { type: String, required: true },
        description: { type: String },
        costPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        taxApplied: { type: Boolean, default: true },
    },
    { _id: false }
);

/* ------------------------- Customer Information Schema ------------------- */
const customerInfoSchema = new mongoose.Schema<SaleCustomerInfo>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String },
        phone: { type: String, required: true },
        email: { type: String },
        address1: { type: String },
        address2: { type: String },
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
    },
    { _id: false }
);

/* ----------------------------- Sale Schema ------------------------------- */
const saleSchema = new mongoose.Schema<SaleDoc>(
    {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        invoiceNumber: { type: String, required: true, unique: true },

        customerInformation: { type: customerInfoSchema, required: true },

        items: { type: [saleItemSchema], required: true },

        saleType: { type: String, required: true },

        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true },
        discountTotal: { type: Number, default: 0 },
        total: { type: Number, required: true },

        paidAmount: { type: Number, default: 0 },
        balanceAmount: { type: Number, default: 0 },

        status: {
            type: String,
            enum: ["paid", "installment", "pending", "refunded", "voided"],
            default: "pending",
        },

        policyTitle: { type: String, required: true },
        policyDescription: { type: String, required: true },

        isLayaway: { type: Boolean, default: false },
        installments: [installmentSchema],

        isRefund: { type: Boolean, default: false },
        refundedSaleId: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" },
    },
    {
        timestamps: true,
        toJSON: globalToJSONTransform,
        toObject: globalToJSONTransform,
    }
);

/* -------------------------- Pre-save Validations ------------------------- */
saleSchema.pre("save", function (next) {
    if (
        this.isLayaway &&
        (!this.installments || this.installments.length === 0)
    ) {
        return next(
            new Error("Layaway sales must include at least one installment")
        );
    }
    next();
});

/* ------------------------------ Build Helper ----------------------------- */
saleSchema.statics.build = (attrs: Sale): SaleDoc => {
    return new SaleModel(attrs);
};

/* ------------------------------- Export ---------------------------------- */
const SaleModel = mongoose.model<SaleDoc, SaleModel>("Sale", saleSchema);
export { SaleModel as Sale };
