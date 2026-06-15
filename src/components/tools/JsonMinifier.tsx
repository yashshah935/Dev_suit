"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function JsonMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ origSize: number; minSize: number; saved: number } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleMinify = () => {
    if (!input.trim()) {
      setError("Please input some JSON first.");
      setStats(null);
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);

      const origSize = new Blob([input]).size;
      const minSize = new Blob([minified]).size;
      const saved = origSize > 0 ? Math.max(0, ((origSize - minSize) / origSize) * 100) : 0;

      setStats({
        origSize,
        minSize,
        saved,
      });
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax.");
      setStats(null);
      setOutput("");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    copyToClipboard(output).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      projectName: "DevSuite",
      version: "1.2.0",
      description: "A gorgeous client-side utilities layout",
      tags: ["dev", "formatter", "compressor"],
      stats: {
        latencyMs: 1.4,
        clientSideOnly: true
      }
    }, null, 4));
    setError(null);
    setStats(null);
    setOutput("");
  };

  return (
    <div>
      <div className="control-bar">
        <div className="control-options">
          <button className="btn-secondary" onClick={loadSample}>
            Load Sample
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={() => { setInput(""); setOutput(""); setError(null); setStats(null); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleMinify}>
            Compress & Minify
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Raw JSON Input</h2>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="Paste formatted JSON here..."
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); }}
                style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem" }}
              />
            </div>
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Minified JSON Output</h2>
            <div className="pane-actions">
              <button className="btn-icon" onClick={handleCopy} disabled={!output} title="Copy Minified">
                📋
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="Compressed output will appear here..."
                value={output}
                readOnly
                style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem" }}
              />
            </div>
            {copyFeedback && <span className="toast-feedback">Copied Output!</span>}
          </div>
        </div>
      </div>

      {error && (
        <div className="status-panel error" style={{ marginTop: "1.5rem" }}>
          <span className="status-icon">⚠️</span>
          <div className="status-details">
            <span className="status-title">Syntax Error</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}

      {stats && (
        <div className="pane" style={{ marginTop: "1.5rem", background: "var(--diff-added-bg)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", padding: "1rem", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)" }}>{stats.origSize} B</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Original Size</div>
            </div>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--neon-cyan)" }}>{stats.minSize} B</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Minified Size</div>
            </div>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--success)" }}>{stats.saved.toFixed(1)}%</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Bandwidth Saved</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
