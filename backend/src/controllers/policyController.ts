import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/badRequest-error";
import { Policy } from "../models/policyModel";
import { validateRequest } from "../utils/validateRequest";
import { successResponse, errorResponse } from "../utils/responseHandler";

/* ------------------------------------------------------------------ */
/* -------------------------- Create Policy ------------------------- */
/* ------------------------------------------------------------------ */
export const createPolicy = asyncHandler(async (req: Request, res: Response) => {
  try {
    await validateRequest(req, [
      body("title").notEmpty().withMessage("Policy title is required"),
      body("description").notEmpty().withMessage("Policy description is required"),
    ]);

    const { title, description } = req.body;

    const existing = await Policy.findOne({ title });
    if (existing) throw new BadRequestError("Policy already exists");

    const policy = Policy.build({ title, description });
    await policy.save();

    successResponse(res, 201, "Policy created successfully", policy);
  } catch (error: any) {
    errorResponse(res, error, "Failed to create policy");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get All Policies ---------------------- */
/* ------------------------------------------------------------------ */
export const getPolicies = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const policies = await Policy.find().sort({ createdAt: -1 });
    successResponse(res, 200, "Policies fetched successfully", policies);
  } catch (error: any) {
    errorResponse(res, error, "Failed to fetch policies");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get Policy by ID ---------------------- */
/* ------------------------------------------------------------------ */
export const getPolicyById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequestError("ID is required");

    const policy = await Policy.findById(id);
    if (!policy) throw new BadRequestError("Policy not found");

    successResponse(res, 200, "Policy fetched successfully", policy);
  } catch (error: any) {
    errorResponse(res, error, "Failed to fetch policy");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Update Policy ------------------------- */
/* ------------------------------------------------------------------ */
export const updatePolicy = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const policy = await Policy.findById(id);
    if (!policy) throw new BadRequestError("Policy not found");

    if (title) policy.title = title;
    if (description) policy.description = description;

    await policy.save();

    successResponse(res, 200, "Policy updated successfully", policy);
  } catch (error: any) {
    errorResponse(res, error, "Failed to update policy");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Delete Policy ------------------------- */
/* ------------------------------------------------------------------ */
export const deletePolicy = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findByIdAndDelete(id);

    if (!policy) throw new BadRequestError("Policy not found");

    successResponse(res, 200, "Policy deleted successfully");
  } catch (error: any) {
    errorResponse(res, error, "Failed to delete policy");
  }
});
