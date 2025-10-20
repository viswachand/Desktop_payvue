import express from "express";
import {
  createGoldBuy,
  getGoldBuys,
  getGoldBuyById,
  updateGoldBuy,
  cancelGoldBuy,
} from "../controllers/goldBuyController";
import { currentUser } from "../middleware/current-user";
import { requireAuth } from "../middleware/require-auth";

const router = express.Router();

router.post("/", currentUser, requireAuth, createGoldBuy);
router.get("/", currentUser, requireAuth, getGoldBuys);
router.get("/:id", currentUser, requireAuth, getGoldBuyById);
router.put("/:id", currentUser, requireAuth, updateGoldBuy);
router.post("/:id/cancel", currentUser, requireAuth, cancelGoldBuy);

export default router;
