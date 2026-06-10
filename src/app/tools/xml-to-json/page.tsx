"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { copyToClipboard } from "../../utils/clipboard";

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    copyToClipboard(text)
      .then(() => {
        setCopyFeedback(type);
        setTimeout(() => setCopyFeedback(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy XML to JSON text:", err);
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

  // SEO Data
  const faqs = [
    {
      q: "How does XML to JSON conversion work?",
      a: "Our converter parses the XML tags, attributes, and text values, translating them directly into structured Javascript Object Notation (JSON) maps and arrays. Attributes are prefixed with '@_' to maintain structural integrity."
    },
    {
      q: "Does this tool support namespaces and nested nodes?",
      a: "Yes! The converter fully parses deeply nested XML tag hierarchies, namespaces, self-closing tags, and recurring children, converting identical tags into JSON arrays."
    },
    {
      q: "What causes a 'Backend Parsing Error' in XML?",
      a: "XML requires strict syntactical rules. Errors typically occur due to unclosed tags, mismatched casing in closing tags, raw characters like '&' (which should be written as '&amp;'), or missing root nodes."
    }
  ];

  const useCases = [
    {
      title: "Legacy SOAP API Refactoring",
      desc: "Instantly translate bulky XML responses from older SOAP web services into clean JSON to integrate easily with modern frontend single-page applications."
    },
    {
      title: "Config File Transpiling",
      desc: "Convert configuration files written in XML format (like web.xml or Android manifest layouts) into JSON configurations for JS-based environments."
    }
  ];

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "XML to JSON Converter | DevSuite",
    "url": "https://dev-suit.vercel.app/tools/xml-to-json",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Convert XML documents into parsed JSON formats instantly with error highlighting and attribute support."
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
            <span>🔌</span> XML to JSON Converter
          </h1>
          <p className="workspace-desc">
            Transform structured XML documents into parsed JSON objects instantly using our high-performance Node.js backend.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      {/* Control Bar */}
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

      {/* SEO Section */}
      <section className="seo-section">
        <div>
          <h2 className="seo-title">About XML to JSON Conversion</h2>
          <p className="seo-subtitle">Why translating XML elements to JSON parameters is standard practice in web engineering.</p>
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
                    <span>🔌</span> {uc.title}
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
            <Link href="/tools/json-to-xml" className="related-link-card">
              <span>JSON to XML Converter</span>
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
            <Link href="/guides/xml-validation" className="related-link-card">
              <span>XML Validation Guide</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/errors/invalid-xml-character" className="related-link-card" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
              <span>Fix Invalid XML Characters</span>
              <span>🔧</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
