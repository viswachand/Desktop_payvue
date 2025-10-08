import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    sendToMain: (msg: string) => ipcRenderer.send("toMain", msg),
    onFromMain: (callback: (event: any, data: any) => void) =>
        ipcRenderer.on("fromMain", callback),
});
