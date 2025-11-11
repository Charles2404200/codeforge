const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const API_BASE = isDev
  ? "http://localhost:5000" // local server khi dev
  : (typeof window !== "undefined" && window.env?.API_BASE) ||
    import.meta.env.VITE_API_URL ||
    "https://codeforge-production-574b.up.railway.app"; // domain Railway thật
