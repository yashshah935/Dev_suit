"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function JsonToCsv() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Flatten nested objects using dot notation
  const flattenObject = (obj: any, prefix = "", res: any = {}): any => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const propName = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
          flattenObject(obj[key], propName, res);
        } else {
          res[propName] = obj[key];
        }
      }
    }
    return res;
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setError("Please input some JSON first.");
      setOutput("");
      return;
    }

    try {
      let parsed = JSON.parse(input);
      setError(null);

      if (!Array.isArray(parsed)) {
        // If it's a single object, wrap it in an array
        parsed = [parsed];
      }

      if (parsed.length === 0) {
        setOutput("");
        return;
      }

      // Flatten each object in the array
      const flattenedRows = parsed.map((row: any) => flattenObject(row));

      // Extract all unique headers/keys
      const headersMap: Record<string, boolean> = {};
      flattenedRows.forEach((row: any) => {
        Object.keys(row).forEach((key) => {
          headersMap[key] = true;
        });
      });
      const headers = Object.keys(headersMap);

      // Construct CSV output
      const csvLines: string[] = [];

      // Add Header Row
      csvLines.push(headers.map((h) => escapeCsvCell(h)).join(","));

      // Add Data Rows
      flattenedRows.forEach((row: any) => {
        const line = headers.map((header) => {
          const val = row[header];
          if (val === undefined || val === null) return "";
          return escapeCsvCell(val);
        });
        csvLines.push(line.join(","));
      });

      setOutput(csvLines.join("\n"));
    } catch (err: any) {
      setError(err.message || "Invalid JSON format. Input must be a JSON array of objects or a single JSON object.");
      setOutput("");
    }
  };

  const escapeCsvCell = (val: any): string => {
    let text = String(val);
    if (text.includes(",") || text.includes('"') || text.includes("\n") || text.includes("\r")) {
      text = text.replace(/"/g, '""');
      return `"${text}"`;
    }
    return text;
  };

  const handleCopy = () => {
    if (!output) return;
    copyToClipboard(output).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const loadSample = () => {
    setInput(JSON.stringify([
      { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Developer", address: { city: "New York", zip: 10001 } },
      { id: 2, name: "Bob Jones", email: "bob@example.com", role: "Designer", address: { city: "Chicago", zip: 60601 } },
      { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Project Manager", address: { city: "San Francisco", zip: 94101 } }
    ], null, 2));
    setError(null);
    setOutput("");
  };

  return (
    <div>
      <div className="control-bar">
        <div className="control-options">
          <button className="btn-secondary" onClick={loadSample}>
            Load JSON Array Sample
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={() => { setInput(""); setOutput(""); setError(null); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleConvert}>
            Convert to CSV
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">JSON Array Input</h2>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="Paste JSON array of objects here..."
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); }}
                style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem" }}
              />
            </div>
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">CSV Sheet Output</h2>
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
                placeholder="Comma separated values will appear here..."
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
    </div>
  );
}
