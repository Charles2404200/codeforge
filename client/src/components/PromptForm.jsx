import { useState } from "react";
import { API_BASE } from "../api";
import Loader from "./Loader";
import "bootstrap/dist/css/bootstrap.min.css";
import FolderTree from "react-folder-tree";
import "react-folder-tree/dist/style.css";
import ProjectPreview from "./ProjectPreview";

export default function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [aiSuggestion, setAiSuggestion] = useState(null); // Giai đoạn 1
  const [structure, setStructure] = useState(null); // Giai đoạn 2
  const [confirmed, setConfirmed] = useState(false); // Giai đoạn 3
  const [showPreview, setShowPreview] = useState(false); // Giai đoạn 4

  // 🔹 STEP 1: Gọi AI để tư vấn stack phù hợp
  const suggestStack = async () => {
    if (!prompt.trim()) {
      alert("⚠️ Vui lòng nhập mô tả project!");
      return;
    }
    setLoading(true);
    setAiSuggestion(null);
    setStructure(null);
    setConfirmed(false);
    setShowPreview(false);

    try {
      const res = await fetch(`${API_BASE}/api/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiSuggestion(data);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lấy gợi ý stack từ AI.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 STEP 2: Xem cấu trúc folder theo stack gợi ý
  const previewPlan = async () => {
    setLoading(true);
    setStructure(null);
    setConfirmed(false);
    setShowPreview(false);
    try {
      const res = await fetch(`${API_BASE}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aiSuggestion }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.rawText) setStructure({ raw: data.rawText });
      else setStructure(data);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lấy cấu trúc project.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 STEP 3: Tạo bản demo preview (không sinh project.zip)
  const previewLiveProject = () => {
    if (!structure) {
      alert("⚠️ Cần xem cấu trúc trước khi tạo demo!");
      return;
    }
    setShowPreview(true);
  };

  // 🔹 STEP 4: Generate project.zip
  const generateProject = async () => {
    if (!structure) {
      alert("⚠️ Vui lòng xem cấu trúc trước khi tạo project!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aiSuggestion, structure }),
      });

      if (!res.ok) throw new Error("Request failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "project.zip";
      a.click();
      URL.revokeObjectURL(url);
      setConfirmed(true);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi sinh project, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 border rounded bg-light shadow-sm">
      {/* --- Nhập mô tả project --- */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Ý tưởng Project</label>
        <textarea
          className="form-control"
          rows={4}
          placeholder="VD: Tạo ứng dụng giống Reddit với chức năng post, comment, vote..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      {/* --- Giai đoạn 1: Gợi ý stack --- */}
      <div className="d-grid mb-3">
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={suggestStack}
          disabled={loading}
        >
          🧠 Phân tích & Gợi ý Stack
        </button>
      </div>

      {/* --- Loader --- */}
      {loading && (
        <div className="text-center mt-3">
          <Loader />
        </div>
      )}

      {/* --- Giai đoạn 1 Output: Stack đề xuất --- */}
      {aiSuggestion && !loading && (
        <div className="card border-success mb-4">
          <div className="card-header bg-success text-white fw-bold">
            🔍 Đề xuất Stack từ AI
          </div>
          <div className="card-body">
            <pre className="text-dark" style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(aiSuggestion, null, 2)}
            </pre>
            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-primary flex-fill"
                onClick={previewPlan}
                disabled={loading}
              >
                📂 Xem cấu trúc dự án này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Giai đoạn 2 Output: Cấu trúc thư mục --- */}
      {structure && !loading && (
        <div className="card mt-4">
          <div className="card-header bg-primary text-white fw-bold">
            🧩 Cấu trúc dự kiến
          </div>
          <div className="card-body">
            {structure.raw ? (
              <pre className="bg-dark text-light p-3 rounded">
                {structure.raw}
              </pre>
            ) : (
              <FolderTree
                data={structure}
                showCheckbox={false}
                indentPixels={20}
              />
            )}

            {/* --- Gợi ý xác nhận --- */}
            {!confirmed && (
              <div className="alert alert-info mt-3">
                ✅ Xác nhận cấu trúc trên để xem bản demo hoặc sinh project hoàn chỉnh.
              </div>
            )}

            {/* --- Nút hành động --- */}
            <div className="d-flex gap-2 mt-3">
              <button
                type="button"
                className="btn btn-outline-success flex-fill"
                onClick={previewLiveProject}
                disabled={loading}
              >
                👀 Xem bản demo preview
              </button>

              <button
                type="button"
                className="btn btn-success flex-fill"
                onClick={generateProject}
                disabled={loading}
              >
                🚀 Sinh Project
              </button>
            </div>

            {confirmed && (
              <div className="alert alert-success mt-3">
                🎉 Project đã được tạo thành công! Kiểm tra file{" "}
                <b>project.zip</b>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Giai đoạn 3: Live Preview --- */}
      {showPreview && (
        <ProjectPreview
          prompt={prompt}
          structure={structure}
          aiSuggestion={aiSuggestion}
        />
      )}
    </div>
  );
}
