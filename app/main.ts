import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { spawn, ChildProcess } from "child_process";
import fs from "fs";

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (!app.isPackaged) {
        // Development: load from Vite dev server
        const devURL = "http://localhost:5173";
        console.log("🔗 Loading frontend from:", devURL);
        mainWindow.loadURL(devURL);
        mainWindow.webContents.openDevTools({ mode: "detach" });
    } else {
        // ✅ Point to frontend/dist/index.html inside packaged app
        const indexPath = join(process.resourcesPath, "frontend", "dist", "index.html");
        console.log("📦 Loading production file from:", indexPath);

        // 🔎 Safety check: warn if the file doesn't exist
        if (!fs.existsSync(indexPath)) {
            console.error("❌ ERROR: Frontend index.html NOT FOUND at:", indexPath);
            mainWindow.loadURL("data:text/html,<h1>Frontend not found. Did you build the frontend before packaging?</h1>");
            return;
        }

        mainWindow
            .loadFile(indexPath)
            .then(() => console.log("✅ Frontend loaded successfully"))
            .catch((err) => console.error("❌ Failed to load frontend:", err));
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

function startBackend() {
    const backendPath = app.isPackaged
        ? join(process.resourcesPath, "backend", "index.js") // packaged path
        : join(__dirname, "..", "..", "backend", "dist", "index.js"); // dev path

    console.log("🚀 Starting backend from:", backendPath);

    backendProcess = spawn("node", [backendPath], {
        stdio: "inherit",
        env: { ...process.env, JWT_KEY: "viswachand19091i391i09" },
    });

    backendProcess.on("error", (err) => {
        console.error("❌ Failed to start backend process:", err);
    });

    backendProcess.on("exit", (code) => {
        console.log("⚠️ Backend process exited with code:", code);
    });
}

app.whenReady().then(() => {
    startBackend();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
    if (backendProcess) {
        console.log("🛑 Killing backend process...");
        backendProcess.kill();
        backendProcess = null;
    }
});

ipcMain.on("toMain", (_event, data) => {
    console.log("📩 Received from renderer:", data);
    mainWindow?.webContents.send("fromMain", { message: "Hello from Electron!" });
});
