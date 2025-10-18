import type { Sale } from "@payvue/shared/types/sale";

export function printReceipt(sale: Sale) {
  if (window.electronAPI && typeof window.electronAPI.printReceipt === "function") {
    window.electronAPI.printReceipt(sale);
  } else {
    const printable = document.getElementById("printable-receipt");
    if (printable) {
      window.print();
    } else {
      console.warn("No printable element found.");
    }
  }
}
