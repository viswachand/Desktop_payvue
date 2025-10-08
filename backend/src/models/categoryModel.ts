import mongoose from "mongoose";
import { globalToJSONTransform } from "../utils/transform";


export interface CategoryAttrs {
    name: string;
}
export interface Category {
    id: string;
    name: string;
}

export interface CategoryDoc extends mongoose.Document {
    name: string;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
    build(attrs: CategoryAttrs): CategoryDoc;
}

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
    },
    {
        toJSON: globalToJSONTransform,
    }
);

categorySchema.statics.build = (attrs: CategoryAttrs) => {
    return new Category(attrs);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>(
    "Category",
    categorySchema
);

export { Category };
