import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";

let mainWindow: BrowserWindow | null = null;

// 🖨️ Create a hidden window for printing
let printWindow: BrowserWindow | null = null;

// 🖥️ Create main app window
async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const frontendPath = app.isPackaged
    ? join(process.resourcesPath, "frontend", "index.html")
    : "http://localhost:5173";

  console.log(`[PayVue] 📦 Loading frontend from: ${frontendPath}`);

  if (app.isPackaged) {
    await mainWindow.loadFile(frontendPath);
  } else {
    await mainWindow.loadURL(frontendPath);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// 🧾 Handle receipt print requests from renderer
ipcMain.on("print-receipt", async (_event, saleData) => {
  console.log("🧾 [PayVue] Print request received:", saleData);

  // Create print window (hidden)
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
    ? `file://${join(process.resourcesPath, "frontend", "index.html#/#/print")}`
    : "http://localhost:5173/#/print";

  // Load the print route
  await printWindow.loadURL(printURL);

  // Wait until the route is loaded
  printWindow.webContents.once("did-finish-load", () => {
    // Send sale data to print window
    printWindow?.webContents.send("render-receipt", saleData);

    // Print after small delay
    setTimeout(() => {
      printWindow?.webContents.print({ silent: true, printBackground: true });
    }, 500);
  });
});

// 🧩 Electron lifecycle
app.whenReady().then(async () => {
  await createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createMainWindow();
});
