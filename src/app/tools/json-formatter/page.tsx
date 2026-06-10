"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { copyToClipboard } from "../../utils/clipboard";

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    copyToClipboard(text)
      .then(() => {
        setCopyFeedback(type);
        setTimeout(() => setCopyFeedback(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy JSON text:", err);
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

  // SEO Data
  const faqs = [
    {
      q: "What is a JSON Formatter?",
      a: "A JSON Formatter is an online utility designed to parse raw, unindented, or minified JSON text and output it with clean styling, indentation, and spacing, making it readable for software developers."
    },
    {
      q: "How does the line-highlighting error validator work?",
      a: "When you paste invalid JSON syntax, our formatter catches the parse exception, converts the error position index into a line number, and automatically marks the erroneous line in red in the line-number gutter."
    },
    {
      q: "Is my JSON data secure on DevSuite?",
      a: "Yes! DevSuite processes JSON formatting and validation 100% on the client side in your web browser. No JSON inputs are sent to any external servers, ensuring your configuration files remain confidential."
    }
  ];

  const useCases = [
    {
      title: "Debugging API Payload Anomalies",
      desc: "Paste unformatted network response payloads from developer consoles to immediately spot structural syntax errors, duplicate keys, or malformed data types."
    },
    {
      title: "Config File Optimization",
      desc: "Beautify complex configuration files (like package.json or tsconfig.json) during code reviews, or minify them to decrease static deployment sizes."
    }
  ];

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JSON Formatter & Validator | DevSuite",
    "url": "https://dev-suit.vercel.app/tools/json-formatter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Beautify, format, validate, and minify JSON data instantly. Features live line-gutter error validation indicators."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="workspace">
      {/* Schema Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>🗂️</span> JSON Formatter & Validator
          </h1>
          <p className="workspace-desc">
            Clean, format, beautify, and validate JSON data. Find syntax errors quickly with line-highlighting debugging tools.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      {/* Control Bar */}
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
              <button className="btn-icon" onClick={handleClear} title="Clear input">
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

      {/* SEO Section */}
      <section className="seo-section">
        <div>
          <h2 className="seo-title">About JSON Formatting & Validation</h2>
          <p className="seo-subtitle">Why clean JSON data is crucial for API performance and error resolution.</p>
        </div>

        <div className="seo-grid">
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Practical Use Cases
            </h3>
            <div className="use-cases-list">
              {useCases.map((uc, idx) => (
                <div key={idx} className="use-case-card">
                  <div className="use-case-title">
                    <span>⚡</span> {uc.title}
                  </div>
                  <p className="use-case-desc">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Frequently Asked Questions
            </h3>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      {openFaq === idx ? "▲" : "▼"}
                    </span>
                  </button>
                  {openFaq === idx && <div className="faq-answer">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Related Developer Tools & Guides
          </h3>
          <div className="related-links-grid">
            <Link href="/tools/xml-to-json" className="related-link-card">
              <span>XML to JSON Converter</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/tools/json-to-xml" className="related-link-card">
              <span>JSON to XML Converter</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/compare/json-vs-xml" className="related-link-card">
              <span>JSON vs XML Comparison</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/guides/json-formatting" className="related-link-card">
              <span>JSON Formatting Guide</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/errors/json-parse-unexpected-token" className="related-link-card" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
              <span>Fix Unexpected Token Error</span>
              <span>🔧</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
