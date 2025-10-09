import { app, BrowserWindow } from "electron";
import { join } from "path";
import { fork, ChildProcess } from "child_process";
import net from "net";

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;
const BACKEND_PORT = 4000;

// 🧠 Check if backend port (4000) is already taken
async function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => resolve(false))
      .once("listening", () => tester.close(() => resolve(true)))
      .listen(port);
  });
}

// 🚀 Launch backend only once
function startBackend() {
  if (backendProcess) {
    console.log("[PayVue] ⚠️ Backend already running, skipping restart.");
    return;
  }

  const backendPath = app.isPackaged
    ? join(process.resourcesPath, "backend", "start.js")
    : join(__dirname, "..", "backend", "dist", "index.js");

  console.log(`[PayVue] 🚀 Starting backend from: ${backendPath}`);

  backendProcess = fork(backendPath, [], {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: app.isPackaged ? "production" : "development",
      PORT: String(BACKEND_PORT),
    },
  });

  backendProcess.on("exit", (code) => {
    console.log(`[PayVue] ⚠️ Backend exited with code: ${code}`);
    backendProcess = null;
  });
}

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

  console.log(`[PayVue] 📦 Frontend path: ${frontendPath}`);

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
  const portFree = await isPortFree(BACKEND_PORT);
  if (portFree) {
    console.log("[PayVue] ✅ Port 4000 is free. Starting backend...");
    startBackend();
  } else {
    console.log("[PayVue] ⚠️ Port 4000 already in use — skipping backend start.");
  }

  await createMainWindow();
});

// 🧹 Cleanup on quit
app.on("before-quit", () => {
  if (backendProcess) {
    console.log("[PayVue] 🛑 Killing backend process...");
    backendProcess.kill();
    backendProcess = null;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createMainWindow();
});
