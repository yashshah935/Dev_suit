"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { copyToClipboard } from "../../utils/clipboard";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Perform URL encoding
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      setSuccess(false);
      return;
    }

    try {
      const encoded = encodeURIComponent(input);
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
        console.error("Failed to copy URL text:", err);
      });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "url-encoded.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInput("https://example.com/search?query=next js & node backend & developer tools = awesome!");
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
      q: "What is URL encoding?",
      a: "URL encoding (also known as percent-encoding) is a mechanism for converting characters in a URL that might have special meaning or represent invalid URL characters into a safe representation using percent '%' signs followed by hexadecimal values."
    },
    {
      q: "Which characters are encoded by encodeURIComponent?",
      a: "It encodes all characters except standard alphabetic, decimal digits, and special characters: - _ . ! ~ * ' ( ). All other characters like spaces, symbols, slashes, or question marks are converted into percent sequences."
    },
    {
      q: "Is there any limit to the text length I can encode?",
      a: "Our client-side tool runs directly inside your browser memory, so it can easily handle inputs up to several megabytes. However, most browsers and web servers enforce a practical URL length limit of 2,000 to 8,000 characters."
    }
  ];

  const useCases = [
    {
      title: "Query Parameter Formatting",
      desc: "Safely encode complex search queries, URLs, and key-value parameters inside query strings to prevent web servers from misinterpreting dividers like '&' or '='."
    },
    {
      title: "CORS Redirect URI Building",
      desc: "Format authentication callback URLs (OAuth redirects) containing query arguments into a single safe string parameter to send to OAuth providers."
    }
  ];

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "URL Encoder Online | DevSuite",
    "url": "https://dev-suit.vercel.app/tools/url-encoder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Convert special characters and URLs into safe, percent-encoded string formats instantly in your browser."
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
            <span>🔗</span> URL Encoder
          </h1>
          <p className="workspace-desc">
            Encode special characters into URL-safe percent-encoded representations instantly. 100% secure client-side encoding.
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
              Encoding Raw Text &rarr; URL Safe
            </span>
          </div>
        </div>
        <Link href="/tools/url-decoder" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
          Switch to Decoder &rarr;
        </Link>
      </div>

      <div className="workspace-grid">
        {/* Input Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Raw Text / URL Input</h2>
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
              placeholder="Type or paste text/URLs here to encode..."
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
            <h2 className="pane-title">URL-Encoded Output</h2>
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
            <span className="status-message">URL successfully encoded to safe ASCII format.</span>
          </div>
        </div>
      )}

      {/* SEO Section */}
      <section className="seo-section">
        <div>
          <h2 className="seo-title">About URL Encoding</h2>
          <p className="seo-subtitle">Why special characters must undergo percent-encoding inside URI requests.</p>
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
                    <span>🔗</span> {uc.title}
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
            <Link href="/tools/url-decoder" className="related-link-card">
              <span>URL Decoder Tool</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/tools/base64-encoder" className="related-link-card">
              <span>Base64 Encoder Tool</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/guides/base64-encoding" className="related-link-card">
              <span>Base64 Encoding Guide</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
