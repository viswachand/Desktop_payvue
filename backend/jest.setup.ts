import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load .env.test from backend directory
dotenv.config({ path: path.resolve(__dirname, "./.env.test") });

beforeAll(async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("❌ MONGO_URI is not defined in .env.test");
    }
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
