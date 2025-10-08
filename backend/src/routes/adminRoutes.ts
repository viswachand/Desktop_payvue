import express from "express";
import {
    createOrUpdateAdminConfig,
    getAdminConfig,
    deleteAdminConfig,
} from "../controllers/adminController";
import { currentUser } from "../middleware/current-user";
import { requireAuth } from "../middleware/require-auth";

const router = express.Router();

router.post("/", currentUser, requireAuth, createOrUpdateAdminConfig);
router.get("/", currentUser, requireAuth, getAdminConfig);
router.delete("/", currentUser, requireAuth, deleteAdminConfig);

export default router;
