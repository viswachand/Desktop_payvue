import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/badRequest-error";
import { Item } from "../models/itemModel";
import { validateRequest } from "../utils/validateRequest";
import { sanitizeDocs } from "../utils/sanitizeDocs";
import { successResponse, errorResponse } from "../utils/responseHandler";

/* ------------------------------------------------------------------ */
/* --------------------- Helper: Extract Item Fields ----------------- */
/* ------------------------------------------------------------------ */
const extractItemFields = (body: any) => {
  const {
    itemSKU,
    itemName,
    itemDescription,
    itemCategory,
    costPrice,
    unitPrice,
    quantity,
    style,
    storeCode,
    size,
    vendor,
    eglId,
    location,
    customText1,
    customText2,
    customText3,
    customFloat,
    metal,
    department,
    itemCode,
    vendorStyle,
    agsId,
    giaId,
    barcode,
    imageUrl,
    isArchived,
    isSold,
    itemType,
  } = body;

  return {
    itemSKU,
    itemName,
    itemDescription,
    itemCategory,
    costPrice,
    unitPrice,
    quantity,
    style,
    storeCode,
    size,
    vendor,
    eglId,
    location,
    customText1,
    customText2,
    customText3,
    customFloat,
    metal,
    department,
    itemCode,
    vendorStyle,
    agsId,
    giaId,
    barcode,
    imageUrl,
    isArchived,
    isSold,
    itemType: (itemType ?? "inventory").toLowerCase(),
  };
};

/* ------------------------------------------------------------------ */
/* -------------------------- Create Item --------------------------- */
/* ------------------------------------------------------------------ */
export const createItem = asyncHandler(async (req: Request, res: Response) => {
  try {
    await validateRequest(req, [
      body("itemSKU").notEmpty().withMessage("Item SKU is required"),
      body("itemName").notEmpty().withMessage("Item name is required"),
      body("itemDescription").notEmpty().withMessage("Item description is required"),
      body("itemCategory").notEmpty().withMessage("Item category is required"),
      body("costPrice").isFloat({ gt: 0 }).withMessage("Cost price must be greater than 0"),
      body("unitPrice").isFloat({ gt: 0 }).withMessage("Unit price must be greater than 0"),
      body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
    ]);

    const fields = extractItemFields(req.body);
    const existingItem = await Item.findOne({ itemSKU: fields.itemSKU });

    if (existingItem) throw new BadRequestError(`Item with SKU ${fields.itemSKU} already exists`);

    const newItem = Item.build({
      ...fields,
      isSold: fields.isSold ?? false,
    });
    await newItem.save();

    successResponse(res, 201, "Item created successfully", sanitizeDocs(newItem));
  } catch (error: any) {
    errorResponse(res, error, "Failed to create item");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get All Items ------------------------- */
/* ------------------------------------------------------------------ */
export const getItems = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const items = await Item.find({})
      .populate("itemCategory", "name")
      .sort({ itemName: 1 });

    const transformed = items.map((item) => {
      const obj = item.toObject();
      return {
        ...obj,
        itemCategory:
          typeof obj.itemCategory === "object" && obj.itemCategory !== null && "name" in obj.itemCategory
            ? (obj.itemCategory as any).name
            : obj.itemCategory || "Uncategorized",
      };
    });

    successResponse(res, 200, "Items fetched successfully", sanitizeDocs(transformed));
  } catch (error: any) {
    errorResponse(res, error, "Failed to fetch items");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get Item by ID ------------------------ */
/* ------------------------------------------------------------------ */
export const getItemById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id).populate("itemCategory", "name");

    if (!item) throw new BadRequestError(`Item with ID ${id} not found`);

    successResponse(res, 200, "Item fetched successfully", sanitizeDocs(item));
  } catch (error: any) {
    errorResponse(res, error, "Failed to fetch item by ID");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Update Item --------------------------- */
/* ------------------------------------------------------------------ */
export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await validateRequest(req, [
      body("itemSKU").optional().notEmpty().withMessage("Item SKU cannot be empty"),
      body("itemName").optional().notEmpty().withMessage("Item name cannot be empty"),
      body("costPrice").optional().isFloat({ gt: 0 }).withMessage("Cost price must be greater than 0"),
      body("unitPrice").optional().isFloat({ gt: 0 }).withMessage("Unit price must be greater than 0"),
      body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
    ]);

    const fields = extractItemFields(req.body);

    // Check if another item exists with same SKU
    if (fields.itemSKU) {
      const duplicate = await Item.findOne({
        itemSKU: fields.itemSKU,
        _id: { $ne: id },
      });
      if (duplicate) {
        throw new BadRequestError(`Another item already exists with SKU: ${fields.itemSKU}`);
      }
    }

    const updatedItem = await Item.findByIdAndUpdate(id, fields, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) throw new BadRequestError(`Item with ID ${id} not found`);

    successResponse(res, 200, "Item updated successfully", sanitizeDocs(updatedItem));
  } catch (error: any) {
    errorResponse(res, error, "Failed to update item");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Delete Item --------------------------- */
/* ------------------------------------------------------------------ */
export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) throw new BadRequestError(`Item with ID ${id} not found`);

    successResponse(res, 200, "Item deleted successfully");
  } catch (error: any) {
    errorResponse(res, error, "Failed to delete item");
  }
});
