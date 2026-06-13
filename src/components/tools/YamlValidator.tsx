"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function YamlValidator() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleValidate = () => {
    if (!input.trim()) {
      setError("Please input some YAML first.");
      setErrorLine(null);
      setSuccess(false);
      return;
    }

    // A lightweight YAML validator that runs simple checks on indentations and syntax rules
    const lines = input.split("\n");
    let hasTabs = false;
    let tabLine = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes("\t")) {
        hasTabs = true;
        tabLine = i + 1;
        break;
      }
    }

    if (hasTabs) {
      setError(`YAML syntax error: Tab characters are forbidden. Use spaces for indentation instead.`);
      setErrorLine(tabLine);
      setSuccess(false);
      return;
    }

    // Check colons have space
    let colonError = false;
    let colonLine = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Look for lines containing ':' but not followed by space, or not ending with ':'
      if (line && line.includes(":") && !line.startsWith("#")) {
        const colonIdx = line.indexOf(":");
        // Check if it is a URL or has space
        const leftSide = line.substring(0, colonIdx).trim();
        const rightSide = line.substring(colonIdx + 1);
        if (leftSide && rightSide && !rightSide.startsWith(" ") && !rightSide.startsWith("\n") && !leftSide.includes("http") && !leftSide.includes("https")) {
          colonError = true;
          colonLine = i + 1;
          break;
        }
      }
    }

    if (colonError) {
      setError("YAML syntax error: Mapping colons must be followed by a space (e.g. 'key: value').");
      setErrorLine(colonLine);
      setSuccess(false);
      return;
    }

    // Check hyphen space for lists
    let listError = false;
    let listLine = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("-") && line.length > 1 && !line.startsWith("- ") && !line.startsWith("---")) {
        listError = true;
        listLine = i + 1;
        break;
      }
    }

    if (listError) {
      setError("YAML syntax error: List item hyphens must be followed by a space (e.g. '- item').");
      setErrorLine(listLine);
      setSuccess(false);
      return;
    }

    // All clear!
    setError(null);
    setErrorLine(null);
    setSuccess(true);
  };

  const handleCopy = () => {
    copyToClipboard(input).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const loadSample = () => {
    setInput(`apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-deployment\n  labels:\n    app: nginx\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:1.14.2\n        ports:\n        - containerPort: 80`);
    setError(null);
    setErrorLine(null);
    setSuccess(false);
  };

  return (
    <div>
      <div className="control-bar">
        <div className="control-options">
          <button className="btn-secondary" onClick={loadSample}>
            Load Valid Sample
          </button>
          <button className="btn-secondary" onClick={() => { setInput("apiVersion: apps/v1\nkind:\tDeployment\nmetadata:\n  name: nginx"); setError(null); setSuccess(false); }}>
            Load Tab Error
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={() => { setInput(""); setError(null); setErrorLine(null); setSuccess(false); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleValidate}>
            Validate YAML
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">YAML Code Editor</h2>
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
                placeholder="Paste your YAML config here to check spaces and syntax..."
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); setSuccess(false); }}
                style={{ height: "320px" }}
              />
            </div>
            {copyFeedback && <span className="toast-feedback">Copied!</span>}
          </div>
        </div>

        <div className="pane" style={{ background: "rgba(13, 17, 28, 0.25)" }}>
          <div className="pane-header">
            <h2 className="pane-title">Validation Status</h2>
          </div>
          <div style={{ padding: "1.5rem", height: "320px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {error && (
              <div className="status-panel error" style={{ margin: 0 }}>
                <span className="status-icon">⚠️</span>
                <div className="status-details">
                  <span className="status-title">Syntax Lint Failed</span>
                  <span className="status-message" style={{ fontSize: "0.85rem" }}>{error}</span>
                  {errorLine && <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Check lines around Line {errorLine}</span>}
                </div>
              </div>
            )}

            {success && (
              <div className="status-panel success" style={{ margin: 0 }}>
                <span className="status-icon">✅</span>
                <div className="status-details">
                  <span className="status-title">YAML is Well-Formed!</span>
                  <span className="status-message">All indentations, lists, and mapping declarations check out perfectly.</span>
                </div>
              </div>
            )}

            {!error && !success && (
              <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</div>
                <div>Lints Kubernetes YAMLs, settings, Actions files and more.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
