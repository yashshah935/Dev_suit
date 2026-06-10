"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { copyToClipboard } from "../../utils/clipboard";

export default function Base64Decoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Perform decoding
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      setSuccess(false);
      return;
    }

    try {
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
    } catch (err: any) {
      setError("Invalid Base64 string. Please verify the characters and structure.");
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
    a.download = "base64-decoded.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInput("RGV2ZWxvcGVyIERldlN1aXRlIPCfmoA=");
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
      q: "What is a Base64 decoder?",
      a: "A Base64 decoder takes a Base64 encoded string (which is composed of ASCII text characters) and translates it back into its original plain text or binary representation."
    },
    {
      q: "Why does Base64 decoding sometimes fail?",
      a: "Decoding fails if the input string contains characters outside the Base64 alphabet (A-Z, a-z, 0-9, +, /) or if it has incorrect length padding (represented by '=' characters at the end)."
    },
    {
      q: "Is it safe to decode passwords using this online tool?",
      a: "Absolutely! The conversion runs 100% locally in your web browser. No data is sent over the network to our server, keeping your credentials secure."
    }
  ];

  const useCases = [
    {
      title: "Inspecting API JSON Web Tokens (JWT)",
      desc: "Decode the payload and header sections of JSON Web Tokens to debug claims, issuers, expiration timestamps, and metadata."
    },
    {
      title: "Translating Network Payloads",
      desc: "Read log files, basic authorization headers (`Authorization: Basic <base64>`), or database dumps that use base64 obfuscation."
    }
  ];

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Base64 Decoder Online | DevSuite",
    "url": "https://dev-suit.vercel.app/tools/base64-decoder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Decode base64 encoded strings back into readable UTF-8 plain text instantly and securely in your browser."
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
            <span>🔐</span> Base64 Decoder
          </h1>
          <p className="workspace-desc">
            Decode Base64 strings back to readable plain text and UTF-8 characters instantly. 100% secure client-side decoding.
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
            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--neon-pink)" }}>
              Decoding Base64 &rarr; Plain Text
            </span>
          </div>
        </div>
        <Link href="/tools/base64-encoder" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
          Switch to Encoder &rarr;
        </Link>
      </div>

      <div className="workspace-grid">
        {/* Input Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Base64 Input</h2>
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
              placeholder="Paste Base64 code here to decode..."
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
            <h2 className="pane-title">Decoded Text</h2>
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
            <span className="status-title">Decoding Failed</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="status-panel success" style={{ marginTop: "1.5rem" }}>
          <span className="status-icon">✅</span>
          <div className="status-details">
            <span className="status-title">Success</span>
            <span className="status-message">Base64 string successfully decoded to plain text.</span>
          </div>
        </div>
      )}

      {/* SEO Section */}
      <section className="seo-section">
        <div>
          <h2 className="seo-title">About Base64 Decoding</h2>
          <p className="seo-subtitle">How plain text structures are re-translated from byte-coded ASCII letters.</p>
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
            <Link href="/tools/base64-encoder" className="related-link-card">
              <span>Base64 Encoder Tool</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/tools/url-decoder" className="related-link-card">
              <span>URL Decoder Tool</span>
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
