import type { Sale } from "@payvue/shared/types/sale";
import { RECEIPT_PRINT_STORAGE_KEY } from "@/modules/receipts/constants";

export function printReceipt(sale: Sale) {
  try {
    localStorage.setItem(RECEIPT_PRINT_STORAGE_KEY, JSON.stringify(sale));
  } catch (error) {
    console.error("Failed to cache receipt payload for printing", error);
  }

  if (window.electronAPI && typeof window.electronAPI.printReceipt === "function") {
    window.electronAPI.printReceipt(sale);
    return;
  }

  const href = window.location.href;
  const hasHashRouting = href.includes("#/");
  let printUrl = "";

  if (hasHashRouting) {
    const base = href.split("#")[0];
    printUrl = `${base}#/print`;
  } else {
    const url = new URL(href);
    const origin = url.origin.endsWith("/")
      ? url.origin.slice(0, -1)
      : url.origin;
    printUrl = `${origin}/print`;
  }

  const printWindow = window.open(printUrl, "_blank", "width=420,height=640");

  if (!printWindow) {
    console.warn("Unable to open print window; falling back to inline print.");
    localStorage.removeItem(RECEIPT_PRINT_STORAGE_KEY);
    const printable = document.getElementById("printable-receipt");
    if (printable) {
      window.print();
    }
    return;
  }

  const cleanup = () => {
    localStorage.removeItem(RECEIPT_PRINT_STORAGE_KEY);
  };

  const interval = window.setInterval(() => {
    if (printWindow.closed) {
      cleanup();
      window.clearInterval(interval);
    }
  }, 1000);
}
