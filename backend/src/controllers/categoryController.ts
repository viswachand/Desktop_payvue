import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/badRequest-error";
import { Category } from "../models/categoryModel";
import { validateRequest } from "../utils/validateRequest";

// ------------------- Create Category -------------------
export const createCategory = asyncHandler(
    async (req: Request, res: Response) => {
        await validateRequest(req, [
            body("name").notEmpty().withMessage("Category name is required"),
        ]);
        const { name } = req.body;
        const existing = await Category.findOne({ name });
        if (existing) throw new BadRequestError("Category already exists");
        const category = Category.build({ name });
        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category.toJSON(),
        });
    }
);

// ------------------- Get All Categories -------------------
export const getCategories = asyncHandler(
    async (_req: Request, res: Response) => {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories,
        });
    }
);

// ------------------- Get Category by ID -------------------
export const getCategoryById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new BadRequestError("ID is required");

        const category = await Category.findById(id);
        if (!category) throw new BadRequestError("Category not found");

        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category,
        });
    }
);

// ------------------- Update Category -------------------
export const updateCategory = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findById(id);
        if (!category) throw new BadRequestError("Category not found");

        if (name) category.name = name;

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    }
);

// ------------------- Delete Category -------------------
export const deleteCategory = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);
        if (!category) throw new BadRequestError("Category not found");

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    }
);
