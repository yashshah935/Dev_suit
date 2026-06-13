"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function CsvToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Parse CSV line handling commas inside double quotes
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let curVal = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          // Double double-quotes escape quote
          curVal += '"';
          i++;
        } else {
          // Toggle quote
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        result.push(curVal.trim());
        curVal = "";
      } else {
        curVal += char;
      }
    }
    result.push(curVal.trim());
    return result;
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setError("Please input some CSV text first.");
      setOutput("");
      return;
    }

    try {
      const lines = input.split(/\r?\n/).filter((l) => l.trim() !== "");
      if (lines.length === 0) {
        setOutput("[]");
        setError(null);
        return;
      }

      // First line is headers
      const headers = parseCsvLine(lines[0]);
      const jsonArr: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const fields = parseCsvLine(lines[i]);
        const obj: any = {};

        headers.forEach((header, idx) => {
          let fieldVal = fields[idx];
          if (fieldVal === undefined || fieldVal === null) {
            obj[header] = null;
            return;
          }

          // Simple type parser
          if (fieldVal === "true") {
            obj[header] = true;
          } else if (fieldVal === "false") {
            obj[header] = false;
          } else if (fieldVal === "null" || fieldVal === "") {
            obj[header] = null;
          } else if (!isNaN(Number(fieldVal))) {
            obj[header] = Number(fieldVal);
          } else {
            obj[header] = fieldVal;
          }
        });

        jsonArr.push(obj);
      }

      setOutput(JSON.stringify(jsonArr, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to convert CSV to JSON. Ensure the header matching is correct.");
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
    setInput(`id,name,email,role,active\n1,"Alice Smith",alice@example.com,Developer,true\n2,"Bob Jones",bob@example.com,Designer,false\n3,"Charlie Brown",charlie@example.com,"Project Manager, Lead",true`);
    setError(null);
    setOutput("");
  };

  return (
    <div>
      <div className="control-bar">
        <div className="control-options">
          <button className="btn-secondary" onClick={loadSample}>
            Load CSV Tabular Sample
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={() => { setInput(""); setOutput(""); setError(null); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleConvert}>
            Convert to JSON
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Tabular CSV Input</h2>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="Paste CSV headers and values here..."
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); }}
                style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem" }}
              />
            </div>
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">JSON List Output</h2>
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
                placeholder="JSON output array will appear here..."
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
