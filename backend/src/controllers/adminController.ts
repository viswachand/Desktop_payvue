import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../utils/validateRequest";
import { AdminConfig } from "../models/adminModel";
import { BadRequestError } from "../errors/badRequest-error";
import { successResponse, errorResponse } from "../utils/responseHandler";

/* ------------------------------------------------------------------ */
/* -------------------- Create or Update Admin Config ---------------- */
/* ------------------------------------------------------------------ */
export const createOrUpdateAdminConfig = asyncHandler(async (req: Request, res: Response) => {
  try {
    await validateRequest(req, [
      body("companyName").notEmpty().withMessage("Company name is required"),
      body("companyAddress").notEmpty().withMessage("Company address is required"),
      body("companyCity").notEmpty().withMessage("Company city is required"),
      body("companyPostalCode").notEmpty().withMessage("Company postal code is required"),
      body("companyPhone").notEmpty().withMessage("Company phone is required"),
      body("companyEmail").isEmail().withMessage("Valid company email is required"),
      body("companyWebsite")
        .isURL({ require_protocol: true })
        .withMessage("Valid company website is required"),
      body("taxRate").isFloat({ min: 0 }).withMessage("Tax rate must be a non-negative number"),
    ]);

    const {
      companyName,
      companyAddress,
      companyCity,
      companyPostalCode,
      companyPhone,
      companyEmail,
      companyWebsite,
      companyFax,
      taxRate,
    } = req.body;

    let config = await AdminConfig.findOne();

    if (config) {
      // 🛠️ Update existing config
      config.companyName = companyName;
      config.companyAddress = companyAddress;
      config.companyCity = companyCity;
      config.companyPostalCode = companyPostalCode;
      config.companyPhone = companyPhone;
      config.companyEmail = companyEmail;
      config.companyWebsite = companyWebsite;
      config.companyFax = companyFax;
      config.taxRate = taxRate;

      await config.save();
      successResponse(res, 200, "Admin config updated successfully", config);
      return;
    }

    // 🆕 Create new config
    const newConfig = AdminConfig.build({
      companyName,
      companyAddress,
      companyCity,
      companyPostalCode,
      companyPhone,
      companyEmail,
      companyWebsite,
      companyFax,
      taxRate,
    });

    await newConfig.save();
    successResponse(res, 201, "Admin config created successfully", newConfig);
  } catch (error: any) {
    errorResponse(res, error, "Failed to create or update admin config");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get Admin Config ---------------------- */
/* ------------------------------------------------------------------ */
export const getAdminConfig = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const config = await AdminConfig.findOne();
    if (!config) throw new BadRequestError("Admin configuration not found");

    successResponse(res, 200, "Admin config fetched successfully", config);
  } catch (error: any) {
    errorResponse(res, error, "Failed to fetch admin config");
  }
});

/* ------------------------------------------------------------------ */
/* ------------------------ Delete Admin Config --------------------- */
/* ------------------------------------------------------------------ */
export const deleteAdminConfig = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const deleted = await AdminConfig.findOneAndDelete();
    if (!deleted) throw new BadRequestError("No Admin config found to delete");

    successResponse(res, 200, "Admin config deleted successfully");
  } catch (error: any) {
    errorResponse(res, error, "Failed to delete admin config");
  }
});
