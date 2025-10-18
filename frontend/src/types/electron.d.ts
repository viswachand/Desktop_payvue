// src/types/electron.d.ts
export {};

declare global {
  interface Window {
    electronAPI?: {
      sendToMain: (msg: string) => void;
      onFromMain: (callback: (event: any, data: any) => void) => void;
      printReceipt: (sale: any) => void;
    };
  }
}
