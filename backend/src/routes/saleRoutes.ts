import express from "express";
import {
    createSale,
    getSales,
    getSaleById,
    refundSale,
} from "../controllers/saleController";
import { currentUser } from "../middleware/current-user";
import { requireAuth } from "../middleware/require-auth";

const router = express.Router();

// Protected routes
router.post("/", currentUser, requireAuth, createSale);
router.get("/", currentUser, requireAuth, getSales);
router.get("/:id", currentUser, requireAuth, getSaleById);
// router.put("/:id", currentUser, requireAuth, updateSale);
// router.delete("/:id", currentUser, requireAuth, deleteSale);

// Refund endpoint
router.post("/:id/refund", currentUser, requireAuth, refundSale);

export default router;
