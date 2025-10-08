import mongoose from "mongoose";
import { DatabaseConnectionError } from "../errors/database-connection-error";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/payvue";

export async function connectDB(): Promise<void> {
    if (!MONGODB_URI) {
        throw new DatabaseConnectionError();
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            autoIndex: true,
        });
        console.info("✅ Database connected successfully");
    } catch (error) {
        throw new DatabaseConnectionError();
    }
}
