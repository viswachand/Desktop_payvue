import mongoose, { HydratedDocument } from "mongoose";
import { AdminConfig } from "@payvue/shared/types/admin";
import { globalToJSONTransform } from "../utils/transform";

export interface AdminConfigDoc
    extends mongoose.Document,
    Omit<AdminConfig, "id"> { }

interface AdminConfigModel extends mongoose.Model<AdminConfigDoc> {
    build(attrs: AdminConfig): AdminConfigDoc;
}

const adminConfigSchema = new mongoose.Schema<AdminConfigDoc>(
    {
        companyName: { type: String, required: true, trim: true },
        companyAddress: { type: String, required: true, trim: true },
        companyPhone: { type: String, required: true, trim: true },
        companyEmail: {
            type: String,
            required: true,
            lowercase: true,
            validate: {
                validator: (email: string) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
                message: (props: any) => `${props.value} is not a valid email!`,
            },
        },
        companyFax: { type: String, trim: true },
        taxRate: { type: Number, required: true, min: 0 },
    },
    {
        toJSON: globalToJSONTransform,
    }
);


adminConfigSchema.statics.build = (attrs: AdminConfig): AdminConfigDoc => {
    return new AdminConfigModel(attrs);
};


const AdminConfigModel = mongoose.model<AdminConfigDoc, AdminConfigModel>(
    "AdminConfig",
    adminConfigSchema
);

export { AdminConfigModel as AdminConfig };
