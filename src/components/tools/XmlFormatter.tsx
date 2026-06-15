"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function XmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Client-side regex-based XML formatter
  const formatXml = (xml: string, spacing: string): string => {
    let formatted = "";
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;

    // Normalize input
    let cleanXml = xml.replace(/\s*<\s*/g, "<").replace(/\s*>\s*/g, ">").replace(reg, "$1\r\n$2$3").trim();

    const lines = cleanXml.split("\r\n");

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx].trim();
      let indentLevel = 0;

      if (line.match(/^<\/\w/)) {
        // Closing tag
        if (pad !== 0) pad -= 1;
      } else if (line.match(/^<\w[^>]*[^\/]>.*$/) && !line.match(/^<\w[^>]*\/>/)) {
        // Opening tag, not self closing
        indentLevel = 1;
      } else if (line.match(/^<\w[^>]*\/>/)) {
        // Self closing
        indentLevel = 0;
      } else {
        // Plain text
        indentLevel = 0;
      }

      const spaceStr = spacing === "tab" ? "\t".repeat(pad) : " ".repeat(pad * parseInt(spacing, 10));
      formatted += spaceStr + line + "\r\n";
      pad += indentLevel;
    }

    return formatted.trim();
  };

  const handleFormat = () => {
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
      setError(err.message || "Failed to format XML. Check that tags match.");
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
    setInput(`<library><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book><book id="bk102"><author>Ralls, Kim</author><title>Midnight Rain</title><genre>Fantasy</genre><price>5.95</price><publish_date>2000-12-16</publish_date><description>A former architect finds himself in a medieval world.</description></book></library>`);
    setError(null);
    setOutput("");
  };

  return (
    <div>
      <div className="control-bar">
        <div className="control-options">
          <div className="option-group">
            <span className="option-label">Indentation:</span>
            <select
              className="select-custom"
              value={indent}
              onChange={(e) => setIndent(e.target.value)}
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
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
          <button className="btn-primary" onClick={handleFormat}>
            Format XML
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Raw XML Input</h2>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="Paste XML markup here..."
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); }}
                style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem" }}
              />
            </div>
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Formatted Output</h2>
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
                placeholder="Prettified XML will appear here..."
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
