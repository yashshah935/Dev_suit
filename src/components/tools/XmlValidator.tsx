"use client";

import { useState } from "react";
import { XMLValidator } from "fast-xml-parser";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function XmlValidator() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleValidate = () => {
    if (!input.trim()) {
      setError("Please input some XML first.");
      setErrorLine(null);
      setSuccess(false);
      return;
    }

    const result = XMLValidator.validate(input);

    if (result === true) {
      setError(null);
      setErrorLine(null);
      setSuccess(true);
    } else {
      const err = result.err;
      setError(`${err.code}: ${err.msg}`);
      setErrorLine(err.line);
      setSuccess(false);
    }
  };

  const handleCopy = () => {
    copyToClipboard(input).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const loadSample = () => {
    setInput(`<?xml version="1.0" encoding="UTF-8"?>\n<note>\n  <to>Tove</to>\n  <from>Jani</from>\n  <heading>Reminder</heading>\n  <body>Don't forget me this weekend!</body>\n</note>`);
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
          <button className="btn-secondary" onClick={() => { setInput(`<?xml version="1.0"?>\n<note>\n  <to>Tove</to>\n  <from>Jani\n  <heading>Reminder</heading>\n</note>`); setError(null); setSuccess(false); }}>
            Load Tag Error
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={() => { setInput(""); setError(null); setErrorLine(null); setSuccess(false); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleValidate}>
            Validate XML
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">XML Editor Pane</h2>
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
                placeholder="Paste XML here to parse and check schemas..."
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); setSuccess(false); }}
                style={{ height: "320px" }}
              />
            </div>
            {copyFeedback && <span className="toast-feedback">Copied!</span>}
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Schema Linter Results</h2>
          </div>
          <div style={{ padding: "1.5rem", height: "320px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {error && (
              <div className="status-panel error" style={{ margin: 0 }}>
                <span className="status-icon">⚠️</span>
                <div className="status-details">
                  <span className="status-title">XML Validation Failed</span>
                  <span className="status-message" style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>{error}</span>
                  {errorLine && <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Failed parsing at line {errorLine}</span>}
                </div>
              </div>
            )}

            {success && (
              <div className="status-panel success" style={{ margin: 0 }}>
                <span className="status-icon">✅</span>
                <div className="status-details">
                  <span className="status-title">XML is Perfectly Well-Formed!</span>
                  <span className="status-message">Your XML structure conforms to strict formatting rules.</span>
                </div>
              </div>
            )}

            {!error && !success && (
              <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔬</div>
                <div>Paste XML markup above to run schema structure check.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
