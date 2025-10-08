import axios from "axios";

/**
 * Unified structure for all API responses.
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * Our own application-level error object.
 */
export class AppError extends Error {
    status?: number;
    constructor(message: string, status?: number) {
        super(message);
        this.name = "AppError";
        this.status = status;
    }
}

/**
 * Extract message from any thrown Axios or system error.
 */
export const extractAxiosErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const errData = error.response?.data;
        return (
            errData?.message ||
            errData?.error ||
            errData?.errors?.[0]?.message ||
            error.message ||
            "Something went wrong"
        );
    } else if (error instanceof Error) {
        return error.message;
    }
    return "Unexpected error occurred";
};

/**
 * Unwrap a response, or throw an AppError if it failed.
 */
export const unwrapResponse = <T>(response: ApiResponse<T>): T => {
    if (!response.success) {
        throw new AppError(response.message || "API responded with failure");
    }
    return response.data;
};

/**
 * Global safe request wrapper to use in async thunks.
 */
export const safeApiCall = async <T>(
    fn: () => Promise<{ data: ApiResponse<T> }>
): Promise<T> => {
    try {
        const res = await fn();
        return unwrapResponse(res.data);
    } catch (err) {
        throw new AppError(extractAxiosErrorMessage(err));
    }
};
