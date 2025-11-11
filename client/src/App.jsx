import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/index.css";
import PromptForm from "./components/PromptForm"; //

export default function App() {
  const [dark, setDark] = useState(false);

  // Toggle dark mode
  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
  }, [dark]);

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1> CodeForge App</h1>
        <button
          className="dark-mode-toggle"
          onClick={() => setDark(!dark)}
        >
          {dark ? " Light" : " Dark"}
        </button>
      </div>

      {/* Main content area */}
      <div className="container">
        <div className="card p-4 mb-3">
          <h4 className="mb-3">Generate Fullstack Project</h4>
          <PromptForm />
        </div>
      </div>

      {/* Footer */}
      <div className="footer text-center mt-5">
        © 2025 CodeForge AI — Le Anh Minh
      </div>
    </div>
  );
}
