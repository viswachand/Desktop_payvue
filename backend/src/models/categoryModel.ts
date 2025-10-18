import mongoose from "mongoose";
import { globalToJSONTransform } from "../utils/transform";

export interface CategoryAttrs {
  name: string;
}

export interface CategoryDoc extends mongoose.Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
  build(attrs: CategoryAttrs): CategoryDoc;
}

const categorySchema = new mongoose.Schema<CategoryDoc>(
  {
    name: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    toJSON: globalToJSONTransform,
  }
);

categorySchema.statics.build = function (attrs: CategoryAttrs) {
  return new this(attrs);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>(
  "Category",
  categorySchema
);

export { Category };
