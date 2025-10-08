import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { app } from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Backend running at: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Failed to start backend:", err);
        process.exit(1);
    }
}

start();
