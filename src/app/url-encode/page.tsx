"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function UrlEncodeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Perform URL conversion on input or mode change
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      setSuccess(false);
      return;
    }

    try {
      if (mode === "encode") {
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
        setError(null);
        setSuccess(true);
      } else {
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
        setError(null);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(
        mode === "decode"
          ? "Malformed URI. Please check your percentage characters (e.g. %20)."
          : err.message || "Encoding failed."
      );
      setOutput("");
      setSuccess(false);
    }
  }, [input, mode]);

  const handleCopy = (text: string, type: "input" | "output") => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "encode" ? "url-encoded.txt" : "url-decoded.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    if (mode === "encode") {
      setInput("https://example.com/search?query=next js & node backend & developer tools = awesome!");
    } else {
      setInput("https%3A%2F%2Fexample.com%2Fsearch%3Fquery%3Dnext%20js%20%26%20node%20backend%20%26%20developer%20tools%20%3D%20awesome%21");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>🔗</span> URL Encoder & Decoder
          </h1>
          <p className="workspace-desc">
            Encode special characters into URL-safe percentage encodings or decode percentage-encoded links back to human-readable strings.
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
            <span className="option-label">Conversion Mode:</span>
            <select
              className="select-custom"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value as "encode" | "decode");
                setInput("");
                setOutput("");
                setError(null);
                setSuccess(false);
              }}
            >
              <option value="encode">Encode URL &rarr; Safe String</option>
              <option value="decode">Decode Safe String &rarr; URL</option>
            </select>
          </div>
        </div>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
          ⚡ Live Client-Side Processing
        </span>
      </div>

      <div className="workspace-grid">
        {/* Input Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">
              {mode === "encode" ? "Raw Text / URL Input" : "URL-Encoded Input"}
            </h2>
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
            <textarea
              className={`editor-textarea ${error ? "error" : ""}`}
              placeholder={
                mode === "encode"
                  ? "Type or paste text/URLs here to encode..."
                  : "Paste URL-encoded text here to decode..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {copyFeedback === "input" && (
              <span className="toast-feedback">Copied Input!</span>
            )}
          </div>
        </div>

        {/* Output Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">
              {mode === "encode" ? "URL-Encoded Output" : "Plain Decoded Output"}
            </h2>
            <div className="pane-actions">
              <button
                className="btn-icon"
                onClick={handleDownload}
                disabled={!output}
                title="Download text file"
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
            <textarea
              className="editor-textarea"
              placeholder="Result will appear here automatically..."
              value={output}
              readOnly
            />
            {copyFeedback === "output" && (
              <span className="toast-feedback">Copied Output!</span>
            )}
          </div>
        </div>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="status-panel error">
          <span className="status-icon">⚠️</span>
          <div className="status-details">
            <span className="status-title">Conversion Failed</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="status-panel success">
          <span className="status-icon">✅</span>
          <div className="status-details">
            <span className="status-title">Success</span>
            <span className="status-message">
              URL successfully {mode === "encode" ? "encoded" : "decoded"}.
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
