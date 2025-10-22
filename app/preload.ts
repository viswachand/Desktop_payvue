import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  sendToMain: (channel: string, data?: unknown) => {
    ipcRenderer.send(channel, data);
  },

  onFromMain: (callback: (event: IpcRendererEvent, data: any) => void) => {
    ipcRenderer.on("fromMain", callback);
  },

  printReceipt: (sale: any) => {
    ipcRenderer.send("print-receipt", sale);
  },

  // optional: receive receipt render data in print window
  onRenderReceipt: (callback: (event: IpcRendererEvent, data: any) => void) => {
    ipcRenderer.on("render-receipt", callback);
  },
});
