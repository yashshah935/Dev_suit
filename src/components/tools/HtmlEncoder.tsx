"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function HtmlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleEncode = () => {
    if (!input) {
      setOutput("");
      return;
    }

    const encoded = input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\//g, "&#x2F;");

    setOutput(encoded);
  };

  const handleCopy = () => {
    if (!output) return;
    copyToClipboard(output).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  return (
    <div>
      <div className="control-bar">
        <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}>
          <button className="btn-secondary" onClick={() => { setInput(""); setOutput(""); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleEncode}>
            Escape HTML
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Raw Text / HTML</h2>
          </div>
          <div className="editor-wrapper">
            <textarea
              className="code-editor-textarea"
              placeholder="Paste raw text or HTML block (e.g. <div class='main'>)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "6px", width: "100%" }}
            />
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Escaped Entities Output</h2>
            <div className="pane-actions">
              <button className="btn-icon" onClick={handleCopy} disabled={!output} title="Copy Output">
                📋
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <textarea
              className="code-editor-textarea"
              placeholder="Escaped HTML string will appear here..."
              value={output}
              readOnly
              style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "6px", width: "100%" }}
            />
            {copyFeedback && <span className="toast-feedback">Copied Output!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
