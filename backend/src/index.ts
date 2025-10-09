import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { app } from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

// ✅ Default secret if missing
if (!process.env.JWT_KEY) {
  process.env.JWT_KEY = "payvue_super_secret_2025";
  console.warn("⚠️ No JWT_KEY found in env. Using fallback secret.");
}

// ✅ Export a start function
export async function startServer() {
  try {
    await connectDB();
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🚀 Backend running at: http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start backend:", err);
    process.exit(1);
  }
}

 startServer();