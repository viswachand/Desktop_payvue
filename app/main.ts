import { app, BrowserWindow } from "electron";
import { join } from "path";

let mainWindow: BrowserWindow | null = null;

// 🖥️ Create frontend window
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
