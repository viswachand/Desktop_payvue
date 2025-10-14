import express from "express";
import { currentUser } from "../middleware/current-user";
import { requireAuth } from "../middleware/require-auth";
import {
    getLayawaySales,
    getLayawayById,
    addLayawayPayment,
} from "../controllers/layawayController";

const router = express.Router();

/**
 * @route   GET /api/layaway
 * @desc    Fetch all layaway sales
 * @access  Private
 */
router.get("/", currentUser, requireAuth, getLayawaySales);

/**
 * @route   GET /api/layaway/:id
 * @desc    Fetch single layaway sale by ID
 * @access  Private
 */
router.get("/:id", currentUser, requireAuth, getLayawayById);

/**
 * @route   POST /api/layaway/:id/payment
 * @desc    Add a new layaway payment
 * @access  Private
 */
router.post("/:id/payment", currentUser, requireAuth, addLayawayPayment);

export default router;
