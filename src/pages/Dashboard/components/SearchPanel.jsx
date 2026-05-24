import { useState, useRef } from "react";
import { searchApi } from "../../../lib/api";

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function handleSearch(e) {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await searchApi.query(q, 6);
      setResults(res.results ?? []);
    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSearch();
  }

  const hasResults = results !== null;

  return (
    <div className="search-panel">
      <form className="search-input-row" onSubmit={handleSearch}>
        <input
          ref={inputRef}
          className="search-query-input"
          placeholder="Search the knowledge base… e.g. 'best finish for packaging'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          autoFocus
        />
        <button type="submit" className="search-btn" disabled={loading || !query.trim()}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && (
        <div className="dash-upload-error" style={{ margin: "0 0 16px" }}>{error}</div>
      )}

      {loading && (
        <div className="search-empty">
          <div className="typing-indicator" style={{ justifyContent: "center" }}>
            <span /><span /><span />
          </div>
          <div style={{ marginTop: 10, fontSize: "0.85rem" }}>Searching knowledge base…</div>
        </div>
      )}

      {hasResults && !loading && results.length === 0 && (
        <div className="search-empty">
          <div className="search-empty-icon">⌕</div>
          <div className="dash-empty-title">No results found</div>
          <div className="dash-empty-text">
            Try different keywords, or upload relevant documents first.
          </div>
        </div>
      )}

      {hasResults && !loading && results.length > 0 && (
        <div className="search-results">
          <div className="search-results-meta">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </div>
          {results.map((r, i) => (
            <div key={i} className="search-result-card">
              <div className="search-result-header">
                <span className="search-result-source">{r.source || "Unknown source"}</span>
                <span className="search-result-score">
                  {Math.round(r.score * 100)}% match
                </span>
              </div>
              <div className="search-score-bar">
                <div
                  className="search-score-fill"
                  style={{ width: `${Math.round(r.score * 100)}%` }}
                />
              </div>
              <p className="search-result-text">
                {r.text.length > 400 ? r.text.slice(0, 397) + "…" : r.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {!hasResults && !loading && (
        <div className="search-empty">
          <div className="search-empty-icon">⌕</div>
          <div className="dash-empty-title">Search your knowledge base</div>
          <div className="dash-empty-text">
            Upload PDFs to build your knowledge base, then search them here using natural language.
          </div>
        </div>
      )}
    </div>
  );
}
