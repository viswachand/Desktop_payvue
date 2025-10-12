import { Response } from "express";
import { sanitizeDocs } from "./sanitizeDocs";

interface ApiResponseOptions {
  success?: boolean;
  message: string;
  data?: any;
  error?: any;
  statusCode?: number;
}

/* ------------------------------------------------------------------ */
/* ✅ Success Response */
/* ------------------------------------------------------------------ */
export const successResponse = (
  res: Response,
  statusCode: number = 200,
  message: string,
  data?: any
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ? sanitizeDocs(data) : undefined,
  });
};

/* ------------------------------------------------------------------ */
/* ❌ Error Response */
/* ------------------------------------------------------------------ */
export const errorResponse = (
  res: Response,
  error: any,
  message: string = "An error occurred",
  statusCode: number = 500
) => {
  console.error(`[Error] ${message}:`, error.message || error);

  return res.status(statusCode).json({
    success: false,
    message,
    error: error.message || error,
  });
};

/* ------------------------------------------------------------------ */
/* 🧩 Unified Handler (optional use in async/await) */
/* ------------------------------------------------------------------ */
export const sendResponse = (res: Response, options: ApiResponseOptions) => {
  const { success = true, message, data, error, statusCode = 200 } = options;

  if (success) {
    return successResponse(res, statusCode, message, data);
  }

  return errorResponse(res, error, message, statusCode);
};
