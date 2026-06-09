"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<store name="Gadget Empire" location="Cyber City">
  <description>Your local cyberpunk parts retailer</description>
  <inventory>
    <item id="item-001" status="in-stock">
      <name>Neural Interface Link</name>
      <price currency="Credits">1200</price>
      <quantity>4</quantity>
      <category>Bio-ware</category>
    </item>
    <item id="item-002" status="low-stock">
      <name>Quantum Cryptography Key</name>
      <price currency="Credits">450</price>
      <quantity>1</quantity>
      <category>Software</category>
    </item>
  </inventory>
  <onlineOrderEnabled>true</onlineOrderEnabled>
</store>`;

export default function XmlToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputGutterRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const outputGutterRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (val: string) => {
    setInput(val);
    setError(null);
    setErrorLine(null);
    setSuccess(false);
  };

  const handleConvert = async () => {
    if (!input.trim()) {
      setError("Input XML is empty.");
      setErrorLine(null);
      setSuccess(false);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorLine(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/xml-to-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ xml: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.line) {
          setErrorLine(data.line);
        }
        throw new Error(data.error || "Failed to convert XML to JSON.");
      }

      setOutput(JSON.stringify(data.json, null, 2));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setSuccess(false);
    } finally {
      setLoading(false);
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
    a.download = "xml-to-json.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInput(SAMPLE_XML);
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
            <span>🔌</span> XML to JSON Converter
          </h1>
          <p className="workspace-desc">
            Transform structured XML documents into responsive JSON objects using our Node.js backend.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      {/* Control Bar (Now at the top) */}
      <div className="control-bar">
        <div className="control-options">
          <span className="option-label" style={{ color: "var(--neon-cyan)" }}>
            ⚡ Fast-XML-Parser Node Integration
          </span>
        </div>
        <button
          className="btn-primary"
          onClick={handleConvert}
          disabled={!input || loading}
        >
          {loading ? "Processing..." : "Convert to JSON"}
        </button>
      </div>

      <div className="workspace-grid">
        {/* Input Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Input XML</h2>
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
                      title={isErr ? `XML syntax error on line ${lineNum}` : undefined}
                    >
                      {isErr ? "⚠️" : lineNum}
                    </div>
                  );
                })}
              </div>
              <textarea
                ref={inputRef}
                className="code-editor-textarea"
                placeholder="Paste your XML document here..."
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
            <h2 className="pane-title">Converted JSON</h2>
            <div className="pane-actions">
              <button
                className="btn-icon"
                onClick={handleDownload}
                disabled={!output}
                title="Download JSON file"
              >
                💾
              </button>
              <button
                className="btn-icon"
                onClick={() => handleCopy(output, "output")}
                disabled={!output}
                title="Copy JSON output"
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
                placeholder="Parsed JSON output will appear here..."
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

      {/* Status Alerts */}
      {error && (
        <div className="status-panel error" style={{ marginTop: "1.5rem" }}>
          <span className="status-icon">⚠️</span>
          <div className="status-details">
            <span className="status-title">Backend Parsing Error</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="status-panel success" style={{ marginTop: "1.5rem" }}>
          <span className="status-icon">✅</span>
          <div className="status-details">
            <span className="status-title">Conversion Complete</span>
            <span className="status-message">XML parsed and structured into JSON successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
}
