import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/badRequest-error";
import { Policy } from "../models/policyModel";
import { validateRequest } from "../utils/validateRequest";



// ------------------- Create Policy -------------------
export const createPolicy = asyncHandler(async (req: Request, res: Response) => {
    await validateRequest(req, [
        body("title").notEmpty().withMessage("Policy title is required"),
        body("description").notEmpty().withMessage("Policy description is required"),
    ]);

    const { title, description } = req.body;

    const existing = await Policy.findOne({ title });
    if (existing) throw new BadRequestError("Policy already exists");

    const policy = Policy.build({ title, description });
    await policy.save();

    res.status(201).json({
        success: true,
        message: "Policy created successfully",
        data: policy.toJSON(),
    });
});

// ------------------- Get All Policies -------------------
export const getPolicies = asyncHandler(async (_req: Request, res: Response) => {
    const policies = await Policy.find();
    res.status(200).json({
        success: true,
        message: "Policies fetched successfully",
        data: policies,
    });
});

// ------------------- Get Policy by ID -------------------
export const getPolicyById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new BadRequestError("ID is required");

    const policy = await Policy.findById(id);
    if (!policy) throw new BadRequestError("Policy not found");

    res.status(200).json({
        success: true,
        message: "Policy fetched successfully",
        data: policy,
    });
});

// ------------------- Update Policy -------------------
export const updatePolicy = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const policy = await Policy.findById(id);
    if (!policy) throw new BadRequestError("Policy not found");

    if (title) policy.title = title;
    if (description) policy.description = description;

    await policy.save();

    res.status(200).json({
        success: true,
        message: "Policy updated successfully",
        data: policy,
    });
});

// ------------------- Delete Policy -------------------
export const deletePolicy = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const policy = await Policy.findByIdAndDelete(id);
    if (!policy) throw new BadRequestError("Policy not found");

    res.status(200).json({
        success: true,
        message: "Policy deleted successfully",
    });
});
