import { useEffect, useState } from "react";
import { searchApi } from "../../../lib/api";

export default function VectorDebugPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    searchApi
      .stats()
      .then(setStats)
      .catch(() => setError("Could not load vector store stats."))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div className="debug-panel"><div className="dash-empty-text">Loading…</div></div>;
  if (error)   return <div className="debug-panel"><div className="dash-empty-text" style={{ color: "#dc2626" }}>{error}</div></div>;
  if (!stats)  return null;

  return (
    <div className="debug-panel">
      <div className="debug-stat-row">
        <div className="debug-stat">
          <div className="debug-stat-value">{stats.total_chunks}</div>
          <div className="debug-stat-label">Total Chunks</div>
        </div>
        <div className="debug-stat">
          <div className="debug-stat-value">{stats.total_documents}</div>
          <div className="debug-stat-label">Indexed Documents</div>
        </div>
        <div className="debug-stat">
          <div className="debug-stat-value" style={{ fontSize: "1.1rem", paddingTop: 6 }}>ChromaDB</div>
          <div className="debug-stat-label">Vector Store</div>
        </div>
      </div>

      <div className="dash-section-header" style={{ padding: "0 0 12px" }}>
        <span className="dash-section-title" style={{ fontSize: "0.92rem" }}>Indexed Documents</span>
        <button className="dash-section-action" onClick={load}>Refresh</button>
      </div>

      {stats.documents.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">📂</div>
          <div className="dash-empty-title">No documents indexed yet</div>
          <div className="dash-empty-text">Upload PDFs in the Uploads tab to build the knowledge base.</div>
        </div>
      ) : (
        <div className="debug-doc-list">
          {stats.documents.map((doc) => (
            <div key={doc.doc_id} className="debug-doc-item">
              <span style={{ fontWeight: 600, fontFamily: "inherit" }}>{doc.source}</span>
              <span style={{ color: "var(--text-light)", marginLeft: 12, fontSize: "0.75rem" }}>
                {doc.doc_id}
              </span>
              {doc.uploaded_by && doc.uploaded_by !== "—" && (
                <span style={{ color: "var(--text-light)", marginLeft: 12, fontSize: "0.75rem" }}>
                  by {doc.uploaded_by}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
