import axios from "axios";

/**
 * Extract a consistent, readable error message from Axios or generic errors
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
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Unexpected error occurred";
};

/**
 * Unwraps your standard API response format
 * { success: boolean, message: string, data: T }
 */
export const unwrapResponse = <T>(
    response: { success: boolean; message: string; data: T }
): T => {
    if (!response.success) {
        throw new Error(response.message || "API responded with failure");
    }
    return response.data;
};

/**
 * Helper wrapper to safely call any API function with uniform error capture
 */
export async function safeApiCall<T>(
    apiCall: () => Promise<{ data: any }>
): Promise<T> {
    try {
        const response = await apiCall();
        return unwrapResponse<T>(response.data);
    } catch (error) {
        throw new Error(extractAxiosErrorMessage(error));
    }
}
