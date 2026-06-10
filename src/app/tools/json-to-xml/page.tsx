"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { copyToClipboard } from "../../utils/clipboard";

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
    copyToClipboard(text)
      .then(() => {
        setCopyFeedback(type);
        setTimeout(() => setCopyFeedback(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy JSON to XML text:", err);
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

  // SEO Data
  const faqs = [
    {
      q: "How are JSON attributes represented in XML?",
      a: "By standard convention, JSON keys prefixed with '@_' are converted into XML tag attributes rather than child nodes. For example, '{\"@_id\": 1}' is parsed into 'id=\"1\"'."
    },
    {
      q: "How is text content formatted alongside attributes?",
      a: "If an XML element has both attributes and text values, you can use the '#text' property key in your JSON input. The converter will bind it to the element's text node."
    },
    {
      q: "Is client-side JSON verification performed before conversion?",
      a: "Yes! The tool performs a local JSON.parse check on the browser side before making the backend call, immediately catching and highlighting any curly brace mismatches, missing commas, or wrong formats."
    }
  ];

  const useCases = [
    {
      title: "Generating XML Feeds",
      desc: "Convert JSON database exports directly into XML formats compatible with RSS feeds, Google Shopping listings, or sitemap specifications."
    },
    {
      title: "Fintech Configuration Declarations",
      desc: "Compile modern JSON configuration files into standard enterprise-format XML schemas required by legacy banking frameworks and soap envelopes."
    }
  ];

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JSON to XML Converter | DevSuite",
    "url": "https://dev-suit.vercel.app/tools/json-to-xml",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Convert JSON configurations into structured XML format instantly with support for node attributes, nesting, and formatting."
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
            <span>📝</span> JSON to XML Converter
          </h1>
          <p className="workspace-desc">
            Transform structured JSON data into clean, well-formed XML declarations instantly using our high-performance Node.js backend.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      {/* Control Bar */}
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

      {/* SEO Section */}
      <section className="seo-section">
        <div>
          <h2 className="seo-title">About JSON to XML Conversion</h2>
          <p className="seo-subtitle">Why structures from JavaScript formats are translated to standard tags.</p>
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
                    <span>📝</span> {uc.title}
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
            <Link href="/tools/json-formatter" className="related-link-card">
              <span>JSON Formatter & Validator</span>
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
