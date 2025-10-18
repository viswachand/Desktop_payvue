import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  sendToMain: (msg: string) => ipcRenderer.send("toMain", msg),
  onFromMain: (callback: (event: any, data: any) => void) =>
    ipcRenderer.on("fromMain", callback),

  // ✅ Add this method for printing receipts
  printReceipt: (sale: any) => ipcRenderer.send("print-receipt", sale),
});
