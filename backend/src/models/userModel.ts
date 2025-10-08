import mongoose from "mongoose";
import { Password } from "../services/password";
import { User as UserType } from "@payvue/shared";
import { globalToJSONTransform } from "../utils/transform";

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserType): UserDoc;
}

export interface UserDoc extends mongoose.Document {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    employeeStartDate: Date;
    contactNumber?: string;
    status: "active" | "inactive";
    isAdmin?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDoc>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        employeeStartDate: { type: Date, required: true },
        contactNumber: { type: String },
        isAdmin: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        toJSON: globalToJSONTransform,
    }
);

userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserType) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
