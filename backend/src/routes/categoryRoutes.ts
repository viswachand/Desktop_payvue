import express from "express";
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../controllers/categoryController";
import { currentUser } from "../middleware/current-user";
import { requireAuth } from "../middleware/require-auth";

const router = express.Router();

// Protected routes (must be logged in)
router.post("/", currentUser, requireAuth, createCategory);
router.get("/", currentUser, requireAuth, getCategories);
router.get("/:id", currentUser, requireAuth, getCategoryById);
router.put("/:id", currentUser, requireAuth, updateCategory);
router.delete("/:id", currentUser, requireAuth, deleteCategory);

export default router;
