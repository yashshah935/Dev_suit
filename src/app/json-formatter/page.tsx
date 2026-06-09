"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const SAMPLE_JSON = `{
  "projectName": "DevSuite",
  "version": "1.0.0",
  "description": "Premium developer utility suite",
  "active": true,
  "features": [
    "JSON Formatter",
    "XML to JSON",
    "JSON to XML",
    "Base64 Encoder/Decoder",
    "URL Encoder/Decoder"
  ],
  "author": {
    "name": "Developer",
    "github": "https://github.com/gemini-Developer"
  },
  "stats": {
    "speedMs": 12,
    "quality": "premium"
  }
}`;

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputGutterRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const outputGutterRef = useRef<HTMLDivElement>(null);

  const getJsonErrorLine = (errorMsg: string, inputVal: string): number | null => {
    const positionMatch = errorMsg.match(/position (\d+)/);
    if (positionMatch) {
      const pos = parseInt(positionMatch[1], 10);
      const textUpToPos = inputVal.substring(0, pos);
      return textUpToPos.split("\n").length;
    }
    const lineMatch = errorMsg.match(/line (\d+)/i);
    if (lineMatch) {
      return parseInt(lineMatch[1], 10);
    }
    const safariMatch = errorMsg.match(/at line (\d+)/i);
    if (safariMatch) {
      return parseInt(safariMatch[1], 10);
    }
    return null;
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    setError(null);
    setErrorLine(null);
    setSuccess(false);
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setError("Input is empty.");
      setErrorLine(null);
      setSuccess(false);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setError(null);
      setErrorLine(null);
      setSuccess(true);
      
      if (indent === "minify") {
        setOutput(JSON.stringify(parsed));
      } else {
        const space = indent === "tab" ? "\t" : parseInt(indent, 10);
        setOutput(JSON.stringify(parsed, null, space));
      }
    } catch (err: any) {
      const msg = err.message || "Invalid JSON syntax.";
      setError(msg);
      setErrorLine(getJsonErrorLine(msg, input));
      setSuccess(false);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setError("Input is empty.");
      setErrorLine(null);
      setSuccess(false);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setError(null);
      setErrorLine(null);
      setSuccess(true);
      setOutput(JSON.stringify(parsed));
    } catch (err: any) {
      const msg = err.message || "Invalid JSON syntax.";
      setError(msg);
      setErrorLine(getJsonErrorLine(msg, input));
      setSuccess(false);
    }
  };

  const handleCopy = (text: string, type: "input" | "output") => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = indent === "minify" ? "minified.json" : "formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInput(SAMPLE_JSON);
    setError(null);
    setErrorLine(null);
    setSuccess(false);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setErrorLine(null);
    setSuccess(false);
  };

  const handleInputScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (inputGutterRef.current) {
      inputGutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleOutputScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (outputGutterRef.current) {
      outputGutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const inputLines = input.split("\n");
  const outputLines = output.split("\n");

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>🗂️</span> JSON Formatter & Validator
          </h1>
          <p className="workspace-desc">
            Clean, format, beautify, and validate JSON data. Find syntax errors quickly.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      {/* Control Bar (Now at the top) */}
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
              <option value="tab">1 Tab</option>
              <option value="minify">Minified</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={handleMinify} disabled={!input}>
            Minify Only
          </button>
          <button className="btn-primary" onClick={handleFormat} disabled={!input}>
            Format JSON
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        {/* Input Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Input JSON</h2>
            <div className="pane-actions">
              <button
                className="btn-secondary"
                style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
                onClick={loadSample}
              >
                Load Sample
              </button>
              <button
                className="btn-icon"
                onClick={handleClear}
                title="Clear input"
              >
                🗑️
              </button>
              <button
                className="btn-icon"
                onClick={() => handleCopy(input, "input")}
                disabled={!input}
                title="Copy input"
              >
                📋
              </button>
            </div>
          </div>

          <div className="editor-wrapper">
            <div className={`code-editor-container ${error ? "error" : ""}`}>
              <div className="code-editor-gutter" ref={inputGutterRef}>
                {inputLines.map((_, idx) => {
                  const lineNum = idx + 1;
                  const isErr = lineNum === errorLine;
                  return (
                    <div
                      key={lineNum}
                      className={`gutter-line ${isErr ? "error-line" : ""}`}
                      title={isErr ? `Syntax error on line ${lineNum}` : undefined}
                    >
                      {isErr ? "⚠️" : lineNum}
                    </div>
                  );
                })}
              </div>
              <textarea
                ref={inputRef}
                className="code-editor-textarea"
                placeholder="Paste or type your JSON here..."
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onScroll={handleInputScroll}
              />
            </div>
            {copyFeedback === "input" && (
              <span className="toast-feedback">Copied Input!</span>
            )}
          </div>
        </div>

        {/* Output Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Result</h2>
            <div className="pane-actions">
              <button
                className="btn-icon"
                onClick={handleDownload}
                disabled={!output}
                title="Download file"
              >
                💾
              </button>
              <button
                className="btn-icon"
                onClick={() => handleCopy(output, "output")}
                disabled={!output}
                title="Copy output"
              >
                📋
              </button>
            </div>
          </div>

          <div className="editor-wrapper">
            <div className="code-editor-container">
              <div className="code-editor-gutter" ref={outputGutterRef}>
                {outputLines.map((_, idx) => (
                  <div key={idx + 1} className="gutter-line">
                    {idx + 1}
                  </div>
                ))}
              </div>
              <textarea
                ref={outputRef}
                className="code-editor-textarea"
                placeholder="Formatted JSON will appear here..."
                value={output}
                readOnly
                onScroll={handleOutputScroll}
              />
            </div>
            {copyFeedback === "output" && (
              <span className="toast-feedback">Copied Output!</span>
            )}
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      {error && (
        <div className="status-panel error" style={{ marginTop: "1.5rem" }}>
          <span className="status-icon">⚠️</span>
          <div className="status-details">
            <span className="status-title">Syntax Error</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="status-panel success" style={{ marginTop: "1.5rem" }}>
          <span className="status-icon">✅</span>
          <div className="status-details">
            <span className="status-title">Valid JSON</span>
            <span className="status-message">Your JSON is perfectly valid and formatted!</span>
          </div>
        </div>
      )}
    </div>
  );
}
