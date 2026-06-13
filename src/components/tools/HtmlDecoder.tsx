"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function HtmlDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleDecode = () => {
    if (!input) {
      setOutput("");
      return;
    }

    // A comprehensive HTML Entity Decoder using regex mapping and DOM element parsing safely
    let decoded = input
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/");

    // Replace decimal references &#123; -> {
    decoded = decoded.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(parseInt(dec, 10)));
    
    // Replace hex references &#x7b; -> {
    decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

    setOutput(decoded);
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
          <button className="btn-primary" onClick={handleDecode}>
            Unescape HTML
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Escaped Input</h2>
          </div>
          <div className="editor-wrapper">
            <textarea
              className="code-editor-textarea"
              placeholder="Paste escaped HTML entities here (e.g. &lt;div class=&quot;main&quot;&gt;)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "6px", width: "100%" }}
            />
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Raw Decoded Output</h2>
            <div className="pane-actions">
              <button className="btn-icon" onClick={handleCopy} disabled={!output} title="Copy Output">
                📋
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <textarea
              className="code-editor-textarea"
              placeholder="Plain HTML output text will appear here..."
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
