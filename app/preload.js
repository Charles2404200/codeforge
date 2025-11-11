const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("env", { API_BASE: "http://localhost:5000" });
