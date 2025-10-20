import express from "express";
import {
  getSalesReport,
  deleteSaleFromReport,
} from "../controllers/reportController";
import { currentUser } from "../middleware/current-user";
import { requireAuth } from "../middleware/require-auth";

const router = express.Router();

// Get all or filtered sales reports
router.get("/sales", currentUser, requireAuth, getSalesReport);

// Delete a sale record from report
router.delete("/sales/:id", currentUser, requireAuth, deleteSaleFromReport);

export default router;
