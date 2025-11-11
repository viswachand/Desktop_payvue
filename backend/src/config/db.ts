import mongoose from "mongoose";
import { DatabaseConnectionError } from "../errors/database-connection-error";

const resolveMongoUri = () => {
    const raw = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/A1-Jewelers";
    return raw.trim().replace(/^"+|"+$/g, "");
};

const MONGO_URI = resolveMongoUri();

/**
 * Logs a formatted message with a timestamp.
 */
function log(message: string, level: "INFO" | "ERROR" = "INFO") {
    const timestamp = new Date().toLocaleString("en-US", { hour12: false });
    const color = level === "ERROR" ? "\x1b[31m" : "\x1b[32m"; // red for errors, green for info
    console.log(`${color}[${timestamp}] [${level}] ${message}\x1b[0m`);
}

/**
 * Connects to MongoDB Atlas and provides clean logs.
 */
export async function connectDB(): Promise<void> {
    try {
        log(`Attempting to connect to MongoDB at ${MONGO_URI}...`);

        await mongoose.connect(MONGO_URI, {
            autoIndex: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        });

        log("✅ MongoDB connection established successfully");
        log(`Connected Database: ${mongoose.connection.name}`);
        log(`Connection Host: ${mongoose.connection.host}`);
    } catch (error) {
        const err = error as Error;
        log("❌ MongoDB connection failed!", "ERROR");
        log(`Error Message: ${err.message}`, "ERROR");

        if (err.message.includes("ECONNREFUSED")) {
            log("⚠️  Possible Fix: Ensure the MongoDB server is running and accessible.", "ERROR");
        } else if (err.message.includes("authentication")) {
            log("⚠️  Possible Fix: Check your MongoDB username/password.", "ERROR");
        } else if (err.message.includes("ENOTFOUND")) {
            log("⚠️  Possible Fix: Verify the connection string host.", "ERROR");
        }

        throw new DatabaseConnectionError();
    }

    mongoose.connection.on("error", (err) => {
        log(`❌ MongoDB connection error: ${err}`, "ERROR");
    });

    mongoose.connection.on("disconnected", () => {
        log("⚠️  MongoDB disconnected. Retrying in 5 seconds...", "ERROR");
        setTimeout(() => connectDB(), 5000);
    });
}
