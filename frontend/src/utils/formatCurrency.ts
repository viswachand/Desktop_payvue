/**
 * Format a number to a currency string in USD by default.
 * Example: 1234.5 → "$1,234.50"
 */
export function formatCurrency(
  value: number = 0,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // fallback for invalid currency codes
    return `${currency} ${value.toFixed(2)}`;
  }
}
