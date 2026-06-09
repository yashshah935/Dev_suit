"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Perform conversion on input or mode change
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      setSuccess(false);
      return;
    }

    try {
      if (mode === "encode") {
        // UTF-8 friendly base64 encoding using btoa and encodeURIComponent
        const encoded = btoa(
          encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16))
          )
        );
        setOutput(encoded);
        setError(null);
        setSuccess(true);
      } else {
        // UTF-8 friendly base64 decoding
        try {
          const decoded = decodeURIComponent(
            atob(input)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          setOutput(decoded);
          setError(null);
          setSuccess(true);
        } catch {
          // Fallback to standard atob if URI decoding fails
          const decoded = atob(input);
          setOutput(decoded);
          setError(null);
          setSuccess(true);
        }
      }
    } catch (err: any) {
      setError(
        mode === "decode"
          ? "Invalid Base64 string. Please verify the characters and structure."
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
    a.download = mode === "encode" ? "base64-encoded.txt" : "base64-decoded.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    if (mode === "encode") {
      setInput("DeepMind Developer DevSuite - Premium Utilities 🚀");
    } else {
      setInput("RGVlcE1pbmQgQW50aWdyYXZpdHkgRGV2U3VpdGUgLSBQcmVtaXVtIFV0aWxpdGllcyDwn5qA");
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
            <span>🔐</span> Base64 Encoder & Decoder
          </h1>
          <p className="workspace-desc">
            Encode plain text into Base64 format or decode Base64 strings back to plain text instantly.
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
              <option value="encode">Encode Plain Text &rarr; Base64</option>
              <option value="decode">Decode Base64 &rarr; Plain Text</option>
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
              {mode === "encode" ? "Plain Text Input" : "Base64 Input"}
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
                  ? "Type or paste plain text here to encode..."
                  : "Paste Base64 code here to decode..."
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
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
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
            <span className="status-title">Process Failed</span>
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
              Text successfully {mode === "encode" ? "encoded to Base64" : "decoded to plain text"}.
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
