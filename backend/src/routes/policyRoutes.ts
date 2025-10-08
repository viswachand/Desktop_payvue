import express from "express";
import {
    createPolicy,
    getPolicies,
    getPolicyById,
    updatePolicy,
    deletePolicy,
} from "../controllers/policyController";
import { currentUser } from "../middleware/current-user";
import { requireAuth } from "../middleware/require-auth";

const router = express.Router();

// Protected routes (must be logged in)
router.post("/", currentUser, requireAuth, createPolicy);
router.get("/", currentUser, requireAuth, getPolicies);
router.get("/:id", currentUser, requireAuth, getPolicyById);
router.put("/:id", currentUser, requireAuth, updatePolicy);
router.delete("/:id", currentUser, requireAuth, deletePolicy);

export default router;
