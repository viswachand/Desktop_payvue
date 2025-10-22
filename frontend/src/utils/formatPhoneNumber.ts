/**
 * Format a string of digits into a standard U.S. phone number pattern with +1 prefix.
 * Examples:
 *  - "2164631168" → "+1 (216) 463-1168"
 *  - "2164631"   → "+1 (216) 463-1"
 *  - "21"        → "+1 (21"
 *  - "+12164631168" → "+1 (216) 463-1168"
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return "";

  // Remove all non-digit characters except a leading "+"
  const cleaned = value.replace(/[^\d]/g, "");

  // Ensure it starts with country code "1"
  const withCountryCode =
    cleaned.startsWith("1") || cleaned.startsWith("+1")
      ? cleaned.replace(/^\+?1/, "")
      : cleaned;

  // Format progressively as the user types
  if (withCountryCode.length <= 3)
    return `+1 (${withCountryCode}`;
  if (withCountryCode.length <= 6)
    return `+1 (${withCountryCode.slice(0, 3)}) ${withCountryCode.slice(3)}`;
  return `+1 (${withCountryCode.slice(0, 3)}) ${withCountryCode.slice(
    3,
    6
  )}-${withCountryCode.slice(6, 10)}`;
};
