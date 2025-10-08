/**
 * Format a string of digits into a standard U.S. phone number pattern.
 * Examples:
 *  - "2164631168" → "(216) 463-1168"
 *  - "2164631"   → "(216) 463-1"
 *  - "21"        → "(21"
 */
export const formatPhoneNumber = (value: string): string => {
    if (!value) return "";

    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");

    // Format progressively as the user types
    if (cleaned.length <= 3) return `(${cleaned}`;
    if (cleaned.length <= 6)
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};
