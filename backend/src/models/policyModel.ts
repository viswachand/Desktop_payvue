import mongoose from "mongoose";
import { globalToJSONTransform } from "../utils/transform";
import { Policy } from "@payvue/shared/types/policy"



export interface PolicyDoc extends mongoose.Document {
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

interface PolicyModel extends mongoose.Model<PolicyDoc> {
    build(attrs: Policy): PolicyDoc;
}

// 4. Define schema
const policySchema = new mongoose.Schema<PolicyDoc>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        toJSON: globalToJSONTransform,
    }
);

policySchema.statics.build = (attrs: Policy) => {
    return new Policy(attrs);
};

const Policy = mongoose.model<PolicyDoc, PolicyModel>("Policy", policySchema);

export { Policy };
