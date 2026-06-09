"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const SAMPLE_JSON = `{
  "store": {
    "@_name": "Gadget Empire",
    "@_location": "Cyber City",
    "description": "Your local cyberpunk parts retailer",
    "inventory": {
      "item": [
        {
          "@_id": "item-001",
          "@_status": "in-stock",
          "name": "Neural Interface Link",
          "price": {
            "@_currency": "Credits",
            "#text": 1200
          },
          "quantity": 4,
          "category": "Bio-ware"
        },
        {
          "@_id": "item-002",
          "@_status": "low-stock",
          "name": "Quantum Cryptography Key",
          "price": {
            "@_currency": "Credits",
            "#text": 450
          },
          "quantity": 1,
          "category": "Software"
        }
      ]
    },
    "onlineOrderEnabled": true
  }
}`;

export default function JsonToXml() {
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

  const handleConvert = async () => {
    if (!input.trim()) {
      setError("Input JSON is empty.");
      setErrorLine(null);
      setSuccess(false);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorLine(null);
    setSuccess(false);

    try {
      // Fast frontend check for JSON syntax to give instant feedback
      try {
        JSON.parse(input);
      } catch (err: any) {
        const msg = err.message || "Invalid JSON syntax.";
        setErrorLine(getJsonErrorLine(msg, input));
        throw new Error(`Invalid JSON syntax: ${msg}`);
      }

      const response = await fetch("/api/json-to-xml", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jsonString: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to convert JSON to XML.");
      }

      setOutput(data.xml);
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
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "json-to-xml.xml";
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
            <span>📝</span> JSON to XML Converter
          </h1>
          <p className="workspace-desc">
            Convert structured JSON schemas into clean, well-formed XML structures using our Node.js backend.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      {/* Control Bar (Now at the top) */}
      <div className="control-bar">
        <div className="control-options">
          <span className="option-label" style={{ color: "var(--neon-purple)" }}>
            ⚡ Fast-XML-Parser Node Integration
          </span>
        </div>
        <button
          className="btn-primary"
          onClick={handleConvert}
          disabled={!input || loading}
        >
          {loading ? "Processing..." : "Convert to XML"}
        </button>
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
                      title={isErr ? `JSON syntax error on line ${lineNum}` : undefined}
                    >
                      {isErr ? "⚠️" : lineNum}
                    </div>
                  );
                })}
              </div>
              <textarea
                ref={inputRef}
                className="code-editor-textarea"
                placeholder="Paste your JSON configuration here..."
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
            <h2 className="pane-title">Converted XML</h2>
            <div className="pane-actions">
              <button
                className="btn-icon"
                onClick={handleDownload}
                disabled={!output}
                title="Download XML file"
              >
                💾
              </button>
              <button
                className="btn-icon"
                onClick={() => handleCopy(output, "output")}
                disabled={!output}
                title="Copy XML output"
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
                placeholder="Formatted XML output will appear here..."
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
            <span className="status-title">Syntax or Parsing Error</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="status-panel success" style={{ marginTop: "1.5rem" }}>
          <span className="status-icon">✅</span>
          <div className="status-details">
            <span className="status-title">Conversion Complete</span>
            <span className="status-message">JSON properties successfully built into XML elements.</span>
          </div>
        </div>
      )}
    </div>
  );
}
