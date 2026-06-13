"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function XmlBeautifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("4");
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const formatXml = (xml: string, spacing: string): string => {
    let formatted = "";
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;

    let cleanXml = xml.replace(/\s*<\s*/g, "<").replace(/\s*>\s*/g, ">").replace(reg, "$1\n$2$3").trim();

    const lines = cleanXml.split("\n");

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx].trim();
      let indentLevel = 0;

      if (line.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (line.match(/^<\w[^>]*[^\/]>.*$/) && !line.match(/^<\w[^>]*\/>/)) {
        indentLevel = 1;
      } else if (line.match(/^<\w[^>]*\/>/)) {
        indentLevel = 0;
      } else {
        indentLevel = 0;
      }

      const spaceStr = spacing === "tab" ? "\t".repeat(pad) : " ".repeat(pad * parseInt(spacing, 10));
      formatted += spaceStr + line + "\n";
      pad += indentLevel;
    }

    return formatted.trim();
  };

  const handleBeautify = () => {
    if (!input.trim()) {
      setError("Please input some XML first.");
      setOutput("");
      return;
    }

    try {
      const formatted = formatXml(input, indent);
      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to beautify XML.");
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
    setInput(`<project><name>DevSuite</name><version>2.0.0</version><dependencies><dependency><id>next</id><version>16.2.7</version></dependency></dependencies></project>`);
    setError(null);
    setOutput("");
  };

  return (
    <div>
      <div className="control-bar">
        <div className="control-options">
          <div className="option-group">
            <span className="option-label">Tab Size:</span>
            <select
              className="select-custom"
              value={indent}
              onChange={(e) => setIndent(e.target.value)}
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="8">8 Spaces</option>
              <option value="tab">1 Tab</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={loadSample}>
            Load Sample
          </button>
          <button className="btn-secondary" onClick={() => { setInput(""); setOutput(""); setError(null); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleBeautify}>
            Beautify XML
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Raw XML</h2>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="Paste nested XML here..."
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); }}
                style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem" }}
              />
            </div>
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Beautified XML Output</h2>
            <div className="pane-actions">
              <button className="btn-icon" onClick={handleCopy} disabled={!output} title="Copy Output">
                📋
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="Beautified markup will appear here..."
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
            <span className="status-title">Formatting Error</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
