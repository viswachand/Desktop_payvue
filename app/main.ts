import { app, BrowserWindow, ipcMain, screen } from "electron";
import { join } from "path";

let mainWindow: BrowserWindow | null = null;
let printWindow: BrowserWindow | null = null;

async function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const frontendURL = app.isPackaged
    ? `file://${join(process.resourcesPath, "frontend", "index.html")}#/`
    : "http://localhost:5173";

  await mainWindow.loadURL(frontendURL);
  mainWindow.maximize();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.on("print-receipt", async (_event, saleData) => {
  printWindow = new BrowserWindow({
    show: false,
    width: 400,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  const printURL = app.isPackaged
    ? `file://${join(process.resourcesPath, "frontend", "index.html")}#/print`
    : "http://localhost:5173/#/print";

  await printWindow.loadURL(printURL);

  printWindow.webContents.once("did-finish-load", () => {
    printWindow?.webContents.send("render-receipt", saleData);
    setTimeout(() => {
      printWindow?.webContents.print({ silent: true, printBackground: true });
    }, 500);
  });
});

app.whenReady().then(createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createMainWindow();
});
