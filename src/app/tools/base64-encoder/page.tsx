"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { copyToClipboard } from "../../utils/clipboard";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Perform encoding
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      setSuccess(false);
      return;
    }

    try {
      // UTF-8 friendly base64 encoding using btoa and encodeURIComponent
      const encoded = btoa(
        encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
      setOutput(encoded);
      setError(null);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Encoding failed.");
      setOutput("");
      setSuccess(false);
    }
  }, [input]);

  const handleCopy = (text: string, type: "input" | "output") => {
    if (!text) return;
    copyToClipboard(text)
      .then(() => {
        setCopyFeedback(type);
        setTimeout(() => setCopyFeedback(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "base64-encoded.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInput("Developer DevSuite 🚀");
    setError(null);
    setSuccess(false);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setSuccess(false);
  };

  // SEO Data
  const faqs = [
    {
      q: "What is Base64 encoding?",
      a: "Base64 encoding is an algorithm that translates binary data (bytes) or text representations into an ASCII string format using a set of 64 characters (A-Z, a-z, 0-9, +, /). It is commonly used to transfer data over media designed to handle text."
    },
    {
      q: "How does this encoder handle special characters and emojis?",
      a: "Standard JavaScript btoa() fails on multi-byte characters like emojis (🚀). Our encoder formats the text into UTF-8 percentage-escaped characters first, translating all multi-byte Unicode strings into valid Base64 representations correctly."
    },
    {
      q: "Is my plain text sent to any server?",
      a: "Absolutely not! The encoding is done fully in your browser using local client-side Javascript. Your raw input data never leaves your computer."
    }
  ];

  const useCases = [
    {
      title: "Data Transfer in Email (MIME)",
      desc: "Encode attachments or binary files into text representations to ensure they transit correctly through mail transfer systems without character translation errors."
    },
    {
      title: "Embedding Images in HTML/CSS",
      desc: "Encode small raster or vector graphics into Base64 strings to declare them inline inside src attributes (`data:image/png;base64,...`) or stylesheets, saving network requests."
    }
  ];

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Base64 Encoder Online | DevSuite",
    "url": "https://dev-suit.vercel.app/tools/base64-encoder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Convert plain text and special characters into Base64 format instantly. Support for Unicode/UTF-8 and browser emojis."
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
            <span>🔐</span> Base64 Encoder
          </h1>
          <p className="workspace-desc">
            Encode plain text and UTF-8 characters into Base64 representation instantly. 100% secure client-side conversion.
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
            <span className="option-label">Conversion Mode:</span>
            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--neon-cyan)" }}>
              Encoding Plain Text &rarr; Base64
            </span>
          </div>
        </div>
        <Link href="/tools/base64-decoder" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
          Switch to Decoder &rarr;
        </Link>
      </div>

      <div className="workspace-grid">
        {/* Input Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Plain Text Input</h2>
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
            <textarea
              className={`editor-textarea ${error ? "error" : ""}`}
              placeholder="Type or paste plain text here to encode..."
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
            <h2 className="pane-title">Base64 Output</h2>
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
        <div className="status-panel error" style={{ marginTop: "1.5rem" }}>
          <span className="status-icon">⚠️</span>
          <div className="status-details">
            <span className="status-title">Encoding Failed</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="status-panel success" style={{ marginTop: "1.5rem" }}>
          <span className="status-icon">✅</span>
          <div className="status-details">
            <span className="status-title">Success</span>
            <span className="status-message">Text successfully encoded to Base64 code format.</span>
          </div>
        </div>
      )}

      {/* SEO Section */}
      <section className="seo-section">
        <div>
          <h2 className="seo-title">About Base64 Encoding</h2>
          <p className="seo-subtitle">Why transferring data in textual Base64 representation is preferred in modern network channels.</p>
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
                    <span>🔐</span> {uc.title}
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
            <Link href="/tools/base64-decoder" className="related-link-card">
              <span>Base64 Decoder Tool</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/tools/url-encoder" className="related-link-card">
              <span>URL Encoder Tool</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/guides/base64-encoding" className="related-link-card">
              <span>Base64 Encoding Guide</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/errors/base64-invalid-input" className="related-link-card" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
              <span>Fix Invalid Base64 Characters</span>
              <span>🔧</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
