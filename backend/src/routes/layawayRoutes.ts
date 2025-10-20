import express from "express";
import { currentUser } from "../middleware/current-user";
import { requireAuth } from "../middleware/require-auth";
import {
  getLayawaySales,
  getLayawayById,
  addLayawayPayment,
} from "../controllers/layawayController";
import { createHistoricalLayaway } from "../controllers/layawayHistoricalController";

const router = express.Router();

router.get("/", currentUser, requireAuth, getLayawaySales);
router.get("/:id", currentUser, requireAuth, getLayawayById);
router.post("/:id/payment", currentUser, requireAuth, addLayawayPayment);
router.post("/historical", currentUser, requireAuth, createHistoricalLayaway);

export default router;
