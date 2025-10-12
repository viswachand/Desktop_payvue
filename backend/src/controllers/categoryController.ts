import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/badRequest-error";
import { Category } from "../models/categoryModel";
import { validateRequest } from "../utils/validateRequest";
import { successResponse, errorResponse } from "../utils/responseHandler";

/* ------------------------------------------------------------------ */
/* -------------------------- Create Category ----------------------- */
/* ------------------------------------------------------------------ */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  try {
    await validateRequest(req, [
      body("name").notEmpty().withMessage("Category name is required"),
    ]);

    const { name } = req.body;
    const existing = await Category.findOne({ name });

    if (existing) throw new BadRequestError("Category already exists");

    const category = Category.build({ name });
    await category.save();

    successResponse(res, 201, "Category created successfully", category);
  } catch (error: any) {
    errorResponse(res, error, "Failed to create category");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get All Categories -------------------- */
/* ------------------------------------------------------------------ */
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    successResponse(res, 200, "Categories fetched successfully", categories);
  } catch (error: any) {
    errorResponse(res, error, "Failed to fetch categories");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get Category by ID -------------------- */
/* ------------------------------------------------------------------ */
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequestError("ID is required");

    const category = await Category.findById(id);
    if (!category) throw new BadRequestError("Category not found");

    successResponse(res, 200, "Category fetched successfully", category);
  } catch (error: any) {
    errorResponse(res, error, "Failed to fetch category by ID");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Update Category ----------------------- */
/* ------------------------------------------------------------------ */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) throw new BadRequestError("Category not found");

    if (name) category.name = name;
    await category.save();

    successResponse(res, 200, "Category updated successfully", category);
  } catch (error: any) {
    errorResponse(res, error, "Failed to update category");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Delete Category ----------------------- */
/* ------------------------------------------------------------------ */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new BadRequestError("Category not found");

    successResponse(res, 200, "Category deleted successfully");
  } catch (error: any) {
    errorResponse(res, error, "Failed to delete category");
  }
});
