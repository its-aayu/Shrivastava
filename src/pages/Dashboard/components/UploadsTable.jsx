import { useRef, useState } from "react";
import { uploadsApi } from "../../../lib/api";

const STORAGE_KEY = "aayu_uploads";

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function formatBytes(n) {
  if (n == null) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function fileTypeLabel(mime) {
  if (!mime) return "—";
  if (mime === "application/pdf") return "PDF";
  if (mime.startsWith("image/")) return mime.split("/")[1].toUpperCase();
  return mime;
}

export default function UploadsTable() {
  const [history, setHistory] = useState(loadHistory);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    setError("");
    setSuccess("");
    setUploading(true);
    try {
      const res = await uploadsApi.upload(file);
      const entry = {
        ...res.data,
        uploaded_at: new Date().toISOString(),
      };
      const updated = [entry, ...history];
      setHistory(updated);
      saveHistory(updated);
      setSuccess(`"${file.name}" uploaded successfully.`);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <>
      <div
        className="dash-upload-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div className="dash-upload-icon">☁</div>
        <div className="dash-upload-label">
          {uploading ? "Uploading…" : "Drop a file here or click to browse"}
        </div>
        <div className="dash-upload-hint">PDF, PNG, JPG — max 10 MB</div>
        <button
          className="dash-upload-btn"
          disabled={uploading}
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          {uploading ? "Uploading…" : "Choose File"}
        </button>
      </div>

      {error && <div className="dash-upload-error">{error}</div>}
      {success && <div className="dash-upload-success">{success}</div>}

      {history.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">📁</div>
          <div className="dash-empty-title">No files uploaded yet</div>
          <div className="dash-empty-text">Upload artwork, documents, or reference files above.</div>
        </div>
      ) : (
        <div className="dash-table-wrap" style={{ marginTop: 20 }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Type</th>
                <th>Size</th>
                <th>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {history.map((f, i) => (
                <tr key={f.filename ?? i}>
                  <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.original_filename ?? f.filename}
                  </td>
                  <td className="muted">{fileTypeLabel(f.content_type)}</td>
                  <td className="muted">{formatBytes(f.size)}</td>
                  <td className="muted">
                    {f.uploaded_at
                      ? new Date(f.uploaded_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
