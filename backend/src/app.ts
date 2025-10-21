// app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import policyRoutes from "./routes/policyRoutes";
import itemRoutes from "./routes/itemRoutes";
import adminRoutes from "./routes/adminRoutes";
import saleRoutes from "./routes/saleRoutes";
import { errorHandler } from "./middleware/error-handler";
import layawayRoutes from "./routes/layawayRoutes"
import goldBuy from "./routes/gouldBuyRoutes";
import reportRoutes from "./routes/reportsRoutes";

const app = express();

// Trust proxy (useful for Heroku/Render/Nginx)
app.set("trust proxy", 1);

// Parse JSON payloads
app.use(express.json());

// ----------------------------------
// ✅ CORS Configuration
// ----------------------------------
const allowedOrigins = [
    "http://localhost:5173", // Vite frontend (dev)
    "http://localhost:4000", // API itself
    null                     // Electron packaged app (file:// → origin === null)
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`Blocked CORS origin: ${origin}`);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// ----------------------------------
// API Routes
// ----------------------------------
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/layaway",layawayRoutes);
app.use("/api/goldBuy", goldBuy);
app.use("/api/reports", reportRoutes);

// ----------------------------------
// ✅ Error Handler (global)
// ----------------------------------
app.use(errorHandler);

export { app };
