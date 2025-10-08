import express from "express";
import {
    signIn,
    signUp,
    getCurrentUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController";
import { currentUser } from "../middleware/current-user";
import { requireAuth } from "../middleware/require-auth";

const router = express.Router();

// Public routes
router.post("/signup", signUp);
router.post("/login", signIn);

// Protected routes (must be logged in)
router.get("/currentuser", currentUser, requireAuth, getCurrentUser);
router.get("/", currentUser, requireAuth, getAllUsers);
router.get("/:id", currentUser, requireAuth, getUserById);
router.put("/update/:id", currentUser, requireAuth, updateUser);
router.delete("/:id", currentUser, requireAuth, deleteUser);

export default router;
