"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { copyToClipboard } from "../../utils/clipboard";

export default function UrlDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Perform URL decoding
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      setSuccess(false);
      return;
    }

    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      setError(null);
      setSuccess(true);
    } catch (err: any) {
      setError("Malformed URI. Please check your percentage characters (e.g. %20).");
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
    a.download = "url-decoded.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInput("https%3A%2F%2Fexample.com%2Fsearch%3Fquery%3Dnext%20js%20%26%20node%20backend%20%26%20developer%20tools%20%3D%20awesome%21");
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
      q: "What is URL decoding?",
      a: "URL decoding is the reverse of URL encoding. It searches for sequence patterns like '%XX' (where XX represents two hexadecimal digits) and replaces them with their matching raw character representations."
    },
    {
      q: "What causes a 'Malformed URI' error during decoding?",
      a: "This happens if a '%' character in the input is not followed by two valid hexadecimal digits (0-9, A-F, a-f), or if the resulting sequence represents an invalid UTF-8 byte stream."
    },
    {
      q: "Is it safe to decode query parameters using this utility?",
      a: "Absolutely! Just like the rest of DevSuite, all parsing and percent conversions run 100% in your browser. No data is sent to external servers."
    }
  ];

  const useCases = [
    {
      title: "Inspecting Analytics Referrers",
      desc: "Decode search referrer query variables (like Google UTM fields) to see raw parameters, search terms, and campaign names."
    },
    {
      title: "Debugging Server Log Files",
      desc: "Paste server request paths from Apache or Nginx access logs containing percent-encoded sequences to read clean paths and values."
    }
  ];

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "URL Decoder Online | DevSuite",
    "url": "https://dev-suit.vercel.app/tools/url-decoder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Decode percent-encoded URL links and query strings back to human-readable text formats instantly and securely."
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
            <span>🔗</span> URL Decoder
          </h1>
          <p className="workspace-desc">
            Translate percent-encoded strings back to human-readable URLs and UTF-8 characters instantly. 100% secure client-side decoding.
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
              Decoding URL Safe &rarr; Raw Text
            </span>
          </div>
        </div>
        <Link href="/tools/url-encoder" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
          Switch to Encoder &rarr;
        </Link>
      </div>

      <div className="workspace-grid">
        {/* Input Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">URL-Encoded Input</h2>
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
              placeholder="Paste URL-encoded text here to decode..."
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
            <h2 className="pane-title">Plain Decoded Output</h2>
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
            <span className="status-message">URL successfully decoded back to human-readable format.</span>
          </div>
        </div>
      )}

      {/* SEO Section */}
      <section className="seo-section">
        <div>
          <h2 className="seo-title">About URL Decoding</h2>
          <p className="seo-subtitle">Why translating percent symbols back to normal characters is key to query analysis.</p>
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
            <Link href="/tools/url-encoder" className="related-link-card">
              <span>URL Encoder Tool</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/tools/base64-decoder" className="related-link-card">
              <span>Base64 Decoder Tool</span>
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
