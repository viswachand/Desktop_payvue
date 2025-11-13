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
  const derivedStatus =
    typeof error?.statusCode === "number"
      ? error.statusCode
      : typeof error?.status === "number"
      ? error.status
      : statusCode;
  const isClientError = derivedStatus >= 400 && derivedStatus < 500;
  const responseMessage =
    isClientError && error?.message ? error.message : message;

  console.error(
    `[Error] ${responseMessage}:`,
    error?.message || error || "Unknown error"
  );

  return res.status(derivedStatus).json({
    success: false,
    message: responseMessage,
    error: isClientError ? undefined : error?.message || error,
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
