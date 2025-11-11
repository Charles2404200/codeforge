export const API_BASE =
  (typeof window !== "undefined" && window.env?.API_BASE) ||
  import.meta.env.VITE_API_URL ||
  "https://codeforge-preview-production.up.railway.app";
