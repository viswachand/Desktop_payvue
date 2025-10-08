import express from "express";
import {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,
} from "../controllers/itemController";
import { currentUser } from "../middleware/current-user";
import { requireAuth } from "../middleware/require-auth";

const router = express.Router();

// Item routes (all protected)
router.post("/", currentUser, requireAuth, createItem);
router.get("/", currentUser, requireAuth, getItems);
router.get("/:id", currentUser, requireAuth, getItemById);
router.put("/:id", currentUser, requireAuth, updateItem);
router.delete("/:id", currentUser, requireAuth, deleteItem);

export default router;
