import { useEffect, useState } from "react";
import { API_BASE } from "../api";
import Loader from "./Loader";

export default function ProjectPreview({ prompt, structure, aiSuggestion }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const createPreview = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, structure, aiSuggestion }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setUrl(data.url);
      } catch (e) {
        console.error(e);
        alert("❌ Không thể chạy live preview!");
      } finally {
        setLoading(false);
      }
    };
    createPreview();
  }, []);

  return (
    <div className="mt-4">
      <h5 className="fw-bold text-success mb-2">🚀 Live Preview (Chạy thật)</h5>
      {loading && <Loader />}
      {!loading && url && (
        <>
          <p className="text-muted">
            Bản demo đang chạy tại <b>{url}</b>
          </p>
          <iframe
            src={url}
            title="Live Preview"
            style={{
              width: "100%",
              height: "600px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </>
      )}
    </div>
  );
}
