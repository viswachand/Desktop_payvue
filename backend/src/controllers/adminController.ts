import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../utils/validateRequest";
import { AdminConfig } from "../models/adminModel";
import { BadRequestError } from "../errors/badRequest-error";

/**
 * ------------------- Create or Update Admin Config -------------------
 * If a config exists, update it; otherwise create a new one
 */
export const createOrUpdateAdminConfig = asyncHandler(
    async (req: Request, res: Response) => {
        await validateRequest(req, [
            body("companyName").notEmpty().withMessage("Company name is required"),
            body("companyAddress").notEmpty().withMessage("Company address is required"),
            body("companyPhone").notEmpty().withMessage("Company phone is required"),
            body("companyEmail").isEmail().withMessage("Valid company email is required"),
            body("taxRate").isFloat({ min: 0 }).withMessage("Tax rate must be a non-negative number"),
        ]);

        const { companyName, companyAddress, companyPhone, companyEmail, companyFax, taxRate } = req.body;

        let config = await AdminConfig.findOne();

        if (config) {
            // update existing
            config.companyName = companyName;
            config.companyAddress = companyAddress;
            config.companyPhone = companyPhone;
            config.companyEmail = companyEmail;
            config.companyFax = companyFax;
            config.taxRate = taxRate;

            await config.save();

            res.status(200).json({
                success: true,
                message: "Admin config updated successfully",
                data: config,
            });
        }

        // create new
        const newConfig = AdminConfig.build({
            companyName,
            companyAddress,
            companyPhone,
            companyEmail,
            companyFax,
            taxRate,
        });

        await newConfig.save();

        res.status(201).json({
            success: true,
            message: "Admin config created successfully",
            data: newConfig,
        });
    }
);

/**
 * ------------------- Get Admin Config -------------------
 */
export const getAdminConfig = asyncHandler(async (_req: Request, res: Response) => {
    const config = await AdminConfig.findOne();

    if (!config) throw new BadRequestError("Admin configuration not found");

    res.status(200).json({
        success: true,
        message: "Admin config fetched successfully",
        data: config,
    });
});

/**
 * ------------------- Delete Admin Config -------------------
 * Not common, but available if needed (for resetting config)
 */
export const deleteAdminConfig = asyncHandler(async (_req: Request, res: Response) => {
    const deleted = await AdminConfig.findOneAndDelete();

    if (!deleted) throw new BadRequestError("No Admin config found to delete");

    res.status(200).json({
        success: true,
        message: "Admin config deleted successfully",
    });
});
