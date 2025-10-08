import mongoose, { HydratedDocument } from "mongoose";
import { Item } from "@payvue/shared/types/item";
import { globalToJSONTransform } from "../utils/transform";

// Backend-specific document type
export interface ItemDoc
    extends mongoose.Document,
    Omit<Item, "id" | "itemCategory" | "createdAt" | "updatedAt"> {
    itemCategory: mongoose.Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

// Model interface
interface ItemModel extends mongoose.Model<ItemDoc> {
    build(attrs: Item): ItemDoc;
}

const itemSchema = new mongoose.Schema<ItemDoc>(
    {
        itemSKU: { type: String, required: true, unique: true, uppercase: true, index: true },
        itemName: { type: String, required: true, trim: true },
        itemDescription: { type: String, required: true },
        itemCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },
        costPrice: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },

        style: { type: String },
        storeCode: { type: String },
        size: { type: String },
        vendor: { type: String },
        eglId: { type: String },
        location: { type: String },
        customText1: { type: String },
        customText2: { type: String },
        customText3: { type: String },
        customFloat: { type: Number, default: 0 },

        metal: { type: String },
        department: { type: String },
        itemCode: { type: String },
        vendorStyle: { type: String },
        agsId: { type: String },
        giaId: { type: String },

        barcode: { type: String },
        imageUrl: { type: String },
        isArchived: { type: Boolean, default: false },
        isSold: { type: Boolean, default: false },
    },
    {
        toJSON: globalToJSONTransform,
    }
);

// Pre-save hook
itemSchema.pre("save", function (this: HydratedDocument<ItemDoc>, next) {
    if (this.itemSKU) {
        this.itemSKU = this.itemSKU.toUpperCase().trim();
    }
    next();
});

// Builder
itemSchema.statics.build = function (attrs: Item): ItemDoc {
    return new ItemModel({
        ...attrs,
        itemCategory: attrs.itemCategory,
    });
};

// Model
const ItemModel = mongoose.model<ItemDoc, ItemModel>("Item", itemSchema);

export { ItemModel as Item };
