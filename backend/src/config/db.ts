import mongoose from "mongoose";
import { DatabaseConnectionError } from "../errors/database-connection-error";

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/payvue";

function resolveMongoUri(): string {
    const envUri = process.env.MONGODB_URI?.trim();
    if (envUri) {
        return envUri;
    }
    return DEFAULT_LOCAL_URI;
}

export async function connectDB(): Promise<void> {
    const mongoUri = resolveMongoUri();

    if (!mongoUri) {
        throw new DatabaseConnectionError();
    }

    try {
        await mongoose.connect(mongoUri, {
            autoIndex: true,
        });

        const sourceLabel = mongoUri === DEFAULT_LOCAL_URI ? "local" : "custom";
        console.info(`Database connected successfully (${sourceLabel} URI)`);
    } catch (error) {
        console.error("Mongo connection failed:", (error as Error).message);
        throw new DatabaseConnectionError();
    }
}
