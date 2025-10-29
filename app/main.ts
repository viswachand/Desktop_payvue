import { app, BrowserWindow, ipcMain, screen } from "electron";
import { join, dirname } from "path";
import { pathToFileURL } from "url";
import { existsSync } from "fs";

let mainWindow: BrowserWindow | null = null;
let printWindow: BrowserWindow | null = null;
let backendStarted = false;

function resolveBackendEntry() {
  if (app.isPackaged) {
    return join(process.resourcesPath, "backend", "index.js");
  }
  return join(__dirname, "..", "..", "backend", "dist", "index.js");
}

function resolveFrontendUrl(fragment = "/") {
  const normalizedFragment = fragment.replace(/^#/, "");
  if (app.isPackaged) {
    const filePath = join(process.resourcesPath, "frontend", "index.html");
    return `${pathToFileURL(filePath).toString()}#${normalizedFragment}`;
  }
  return `http://localhost:5173/#${normalizedFragment}`;
}

function startBackend() {
  if (backendStarted) return;

  const backendEntry = resolveBackendEntry();
  if (!existsSync(backendEntry)) {
    console.error(`❌ Backend entry not found at ${backendEntry}. Did you run the backend build?`);
    return;
  }

  const envPath = join(dirname(backendEntry), ".env");
  process.env.PORT = process.env.PORT ?? "4000";
  process.env.MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/payvue";
  process.env.BACKEND_ENV_PATH = process.env.BACKEND_ENV_PATH ?? envPath;

  try {
    require(backendEntry);
    backendStarted = true;
    console.log("✅ Backend module loaded");
  } catch (error) {
    backendStarted = false;
    console.error("❌ Failed to load backend module:", error);
  }
}

function stopBackend() {
  // Backend runs in-process; it will exit with Electron.
}

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

  await mainWindow.loadURL(resolveFrontendUrl("/"));
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

  await printWindow.loadURL(resolveFrontendUrl("/print"));

  printWindow.webContents.once("did-finish-load", () => {
    printWindow?.webContents.send("render-receipt", saleData);
    setTimeout(() => {
      printWindow?.webContents.print({ silent: true, printBackground: true });
    }, 500);
  });
});

app.whenReady().then(async () => {
  startBackend();
  await createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createMainWindow();
});

app.on("before-quit", () => {
  stopBackend();
});
