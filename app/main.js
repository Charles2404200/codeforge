const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let backendProcess;
const isDev = process.env.NODE_ENV === "development";

function startBackend() {
  const serverPath = isDev
    ? path.join(__dirname, "..", "server", "app.js")
    : path.join(process.resourcesPath, "server", "app.js");

  backendProcess = spawn(process.execPath, [serverPath], {
    env: { ...process.env, NODE_ENV: isDev ? "development" : "production" },
    stdio: "inherit",
  });

  backendProcess.on("close", (code) => {
    console.log(`[backend] exited with code ${code}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(process.resourcesPath, "client", "index.html");
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  if (!isDev) startBackend(); // dev đã chạy server qua root script
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
  if (backendProcess) backendProcess.kill();
});
