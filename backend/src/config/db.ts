import mongoose from "mongoose";
import { DatabaseConnectionError } from "../errors/database-connection-error";

// ✅ Always use your MongoDB Atlas URI
const MONGO_URI = "mongodb+srv://viswachandakkanambattu:MrUNYg1duC8AiASM@a1.bas9awe.mongodb.net/payvue";

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
        log("Attempting to connect to MongoDB Atlas...");

        await mongoose.connect(MONGO_URI, {
            autoIndex: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        });

        log("✅ MongoDB connection established successfully (Atlas Cluster: a1.bas9awe)");
        log(`Connected Database: ${mongoose.connection.name}`);
        log(`Connection Host: ${mongoose.connection.host}`);
    } catch (error) {
        const err = error as Error;
        log("❌ MongoDB connection failed!", "ERROR");
        log(`Error Message: ${err.message}`, "ERROR");

        if (err.message.includes("ECONNREFUSED")) {
            log("⚠️  Possible Fix: Ensure MongoDB Atlas IP whitelist includes your current IP.", "ERROR");
        } else if (err.message.includes("authentication")) {
            log("⚠️  Possible Fix: Check your MongoDB username/password.", "ERROR");
        } else if (err.message.includes("ENOTFOUND")) {
            log("⚠️  Possible Fix: Verify internet connection or DNS issues.", "ERROR");
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
