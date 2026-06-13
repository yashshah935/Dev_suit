"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function JsonValidator() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [stats, setStats] = useState<{ keys: number; size: number; depth: number } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const getJsonErrorLine = (errorMsg: string, inputVal: string): number | null => {
    const positionMatch = errorMsg.match(/position (\d+)/);
    if (positionMatch) {
      const pos = parseInt(positionMatch[1], 10);
      const textUpToPos = inputVal.substring(0, pos);
      return textUpToPos.split("\n").length;
    }
    const lineMatch = errorMsg.match(/line (\d+)/i);
    return lineMatch ? parseInt(lineMatch[1], 10) : null;
  };

  const getObjectDepth = (obj: any): number => {
    if (typeof obj !== "object" || obj === null) return 0;
    let maxDepth = 0;
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        maxDepth = Math.max(maxDepth, getObjectDepth(obj[key]));
      }
    }
    return maxDepth + 1;
  };

  const countKeys = (obj: any): number => {
    if (typeof obj !== "object" || obj === null) return 0;
    let count = 0;
    for (const key in obj) {
      count++;
      if (typeof obj[key] === "object") {
        count += countKeys(obj[key]);
      }
    }
    return count;
  };

  const handleValidate = () => {
    if (!input.trim()) {
      setError("Please input some JSON data first.");
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setError(null);
      setErrorLine(null);

      // Compute statistics
      const keysCount = countKeys(parsed);
      const depthCount = getObjectDepth(parsed);
      const sizeBytes = new Blob([input]).size;

      setStats({
        keys: keysCount,
        size: sizeBytes,
        depth: depthCount,
      });
    } catch (err: any) {
      const msg = err.message || "Invalid JSON syntax.";
      setError(msg);
      setErrorLine(getJsonErrorLine(msg, input));
      setStats(null);
    }
  };

  const handleCopy = () => {
    copyToClipboard(input).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      status: "success",
      code: 200,
      data: {
        id: "usr_99831",
        profile: {
          username: "dev_suit_coder",
          email: "coder@devsuite.app",
          skills: ["TypeScript", "Next.js", "CSS"]
        },
        active: true
      }
    }, null, 2));
    setError(null);
    setErrorLine(null);
    setStats(null);
  };

  return (
    <div>
      <div className="control-bar">
        <div className="control-options">
          <button className="btn-secondary" onClick={loadSample}>
            Load Valid Sample
          </button>
          <button className="btn-secondary" onClick={() => { setInput('{\n  "unclosed": "brace"\n  "missing_comma": 12\n}'); setError(null); setStats(null); }}>
            Load Error Sample
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={() => { setInput(""); setError(null); setStats(null); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleValidate}>
            Validate JSON
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Input JSON Editor</h2>
            <div className="pane-actions">
              <button className="btn-icon" onClick={handleCopy} disabled={!input} title="Copy Input">
                📋
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <div className={`code-editor-container ${error ? "error" : ""}`}>
              <div className="code-editor-gutter">
                {input.split("\n").map((_, idx) => {
                  const isErr = idx + 1 === errorLine;
                  return (
                    <div key={idx} className={`gutter-line ${isErr ? "error-line" : ""}`}>
                      {isErr ? "⚠️" : idx + 1}
                    </div>
                  );
                })}
              </div>
              <textarea
                className="code-editor-textarea"
                placeholder="Paste raw JSON here to lint and validate syntax..."
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); setStats(null); }}
                style={{ height: "320px" }}
              />
            </div>
            {copyFeedback && <span className="toast-feedback">Copied!</span>}
          </div>
        </div>

        <div className="pane" style={{ background: "rgba(13, 17, 28, 0.25)" }}>
          <div className="pane-header">
            <h2 className="pane-title">Analysis Result</h2>
          </div>
          <div style={{ padding: "1.5rem", height: "320px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {error && (
              <div className="status-panel error" style={{ margin: 0 }}>
                <span className="status-icon">⚠️</span>
                <div className="status-details">
                  <span className="status-title">Syntax Validation Failed</span>
                  <span className="status-message" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{error}</span>
                  {errorLine && <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Error spotted around line {errorLine}</span>}
                </div>
              </div>
            )}

            {stats && (
              <div>
                <div className="status-panel success" style={{ marginBottom: "1.5rem" }}>
                  <span className="status-icon">✅</span>
                  <div className="status-details">
                    <span className="status-title">Perfect Syntax!</span>
                    <span className="status-message">JSON document structure is 100% valid.</span>
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div className="pane" style={{ textAlign: "center", padding: "1rem", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--neon-cyan)" }}>{stats.keys}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Total Keys</div>
                  </div>
                  <div className="pane" style={{ textAlign: "center", padding: "1rem", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--neon-purple)" }}>{stats.depth}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Max Depth</div>
                  </div>
                  <div className="pane" style={{ textAlign: "center", padding: "1rem", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--neon-pink)" }}>{(stats.size / 1024).toFixed(2)} KB</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Raw Size</div>
                  </div>
                </div>
              </div>
            )}

            {!error && !stats && (
              <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🕵️‍♂️</div>
                <div>Paste JSON and click Validate.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
