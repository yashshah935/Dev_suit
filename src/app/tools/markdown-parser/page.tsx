"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { parseMarkdown } from "../../utils/markdown";
import { copyToClipboard } from "../../utils/clipboard";

const SAMPLE_MARKDOWN = `# 📝 Markdown Parser & Viewer
Welcome to **DevSuite's** premium client-side markdown compiler.

## Features
- **Fast**: Parsed 100% in your browser.
- **Accurate**: Supports header blocks, bolding, lists, and tables.
- **Secure**: Escapes malicious scripts automatically.

> Blockquotes are rendered with a premium colored left-border indicator.

### Formatting Cheat Sheet
You can write inline code like \`const x = 10;\` or blocks:
\`\`\`javascript
function greet(user) {
  return \`Hello, \${user}!\`;
}
\`\`\`

| Element | Syntax | Example |
| :--- | :--- | :--- |
| Bold | \`**text**\` | **Heavy** |
| Italic | \`*text*\` | *Slanted* |
| Strike | \`~~text~~\` | ~~Crossed~~ |
`;

export default function MarkdownParser() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Parse markdown to HTML on input change
  useEffect(() => {
    setHtml(parseMarkdown(markdown));
  }, [markdown]);

  const loadSample = () => {
    setMarkdown(SAMPLE_MARKDOWN);
  };

  const handleClear = () => {
    setMarkdown("");
    setHtml("");
  };

  const handleCopyHtml = () => {
    if (!html) return;
    copyToClipboard(html)
      .then(() => {
        setCopyFeedback("html");
        setTimeout(() => setCopyFeedback(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy HTML:", err);
      });
  };

  const handleDownloadPdf = () => {
    if (!html.trim()) return;

    setIsDownloading(true);
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups to download the PDF export.");
        setIsDownloading(false);
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Markdown Export - DevSuite</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #2D3748;
                padding: 3rem 2.5rem;
                max-width: 800px;
                margin: 0 auto;
              }
              h1, h2, h3, h4, h5, h6 {
                color: #1A202C;
                margin-top: 1.5rem;
                margin-bottom: 1rem;
                font-weight: 700;
              }
              h1 { font-size: 2.2rem; border-bottom: 2px solid #E2E8F0; padding-bottom: 0.5rem; }
              h2 { font-size: 1.6rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.4rem; }
              h3 { font-size: 1.3rem; }
              p { margin-bottom: 1.25rem; }
              strong { font-weight: 600; color: #111; }
              em { font-style: italic; }
              del { text-decoration: line-through; color: #A0AEC0; }
              blockquote {
                border-left: 4px solid #3182CE;
                background-color: #F7FAFC;
                padding: 1rem 1.25rem;
                margin: 1.5rem 0;
                color: #4A5568;
                font-style: italic;
                border-radius: 0 6px 6px 0;
              }
              pre {
                background-color: #EDF2F7;
                padding: 1.25rem;
                border-radius: 6px;
                overflow-x: auto;
                margin: 1.5rem 0;
                border: 1px solid #E2E8F0;
              }
              code {
                font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
                background-color: #EDF2F7;
                padding: 0.2rem 0.4rem;
                border-radius: 4px;
                font-size: 0.9em;
                color: #805AD5;
              }
              pre code {
                background-color: transparent;
                padding: 0;
                color: #2D3748;
                font-size: 0.95em;
              }
              ul, ol {
                margin-bottom: 1.25rem;
                padding-left: 2rem;
              }
              li {
                margin-bottom: 0.5rem;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5rem 0;
              }
              th, td {
                border: 1px solid #E2E8F0;
                padding: 10px 12px;
                text-align: left;
              }
              th {
                background-color: #F7FAFC;
                font-weight: 600;
              }
              a {
                color: #3182CE;
                text-decoration: none;
              }
              /* Print optimizations */
              @media print {
                body { padding: 0; }
                a::after { content: " (" attr(href) ")"; font-size: 0.8em; color: #718096; }
              }
            </style>
          </head>
          <body>
            <div>${html}</div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // SEO FAQs
  const faqs = [
    {
      q: "What is a Markdown Parser?",
      a: "A Markdown Parser is a utility that translates Markdown syntax (headers, lists, bold text) into standard, valid HTML tags. This enables static documentation or articles to render correctly in web browsers."
    },
    {
      q: "How does the Live Preview work?",
      a: "As you type or paste text into the input pane, our client-side compiler parses the markdown content instantly and displays the rendered visual output in the preview panel, giving you real-time feedback."
    },
    {
      q: "Can I print or save the parsed document as a PDF?",
      a: "Yes! Clicking the 'Download PDF' button compiles the HTML, formats it with a clean, professional print stylesheet, and opens your browser's native print engine, allowing you to save the document as a vector-accurate PDF."
    }
  ];

  const useCases = [
    {
      title: "Readme & Documentation Preview",
      desc: "Paste GitHub README.md markdown content to inspect headers, tables, links, and code blocks before pushing commits."
    },
    {
      title: "Blogging & Content Writing",
      desc: "Draft articles or rich documentation in markdown, preview their visual layouts, copy the generated HTML, or print clean PDF outlines."
    }
  ];

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Markdown Parser & Viewer | DevSuite",
    "url": "https://dev-suit.vercel.app/tools/markdown-parser",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Convert markdown syntax to HTML instantly. Render live preview windows, copy HTML code, and export to PDF stylesheets."
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
            <span>📝</span> Markdown Parser & Viewer
          </h1>
          <p className="workspace-desc">
            Write or paste markdown text, view live parsed HTML preview renders, copy formatted HTML, and export pages to PDF.
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
            ⚡ 100% Client-Side Markdown Compiler
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={handleCopyHtml} disabled={!html}>
            📋 Copy HTML Output
          </button>
          <button className="btn-primary" onClick={handleDownloadPdf} disabled={!html || isDownloading}>
            {isDownloading ? "⏳ Generating PDF..." : "📥 Download PDF"}
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        {/* Markdown Editor Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Markdown Input</h2>
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
            </div>
          </div>
          <div className="editor-wrapper" style={{ minHeight: "380px" }}>
            <textarea
              ref={markdownRef}
              className="editor-textarea"
              placeholder="Write or paste your markdown code here... e.g. # Hello World"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              style={{ minHeight: "380px" }}
            />
          </div>
        </div>

        {/* Render Preview Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Visual Preview</h2>
          </div>
          <div className="editor-wrapper" style={{ minHeight: "380px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
            <div
              ref={previewRef}
              id="markdown-preview"
              className="markdown-preview-block"
              style={{
                padding: "1.25rem",
                overflowY: "auto",
                height: "380px",
                lineHeight: "1.6",
                color: "var(--text-secondary)"
              }}
              dangerouslySetInnerHTML={{ __html: html || '<p style="color:var(--text-muted); font-style:italic;">Live compiled HTML preview will render here...</p>' }}
            />
            {copyFeedback === "html" && (
              <span className="toast-feedback">Copied parsed HTML!</span>
            )}
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <section className="seo-section">
        <div>
          <h2 className="seo-title">About Markdown Rendering & Validation</h2>
          <p className="seo-subtitle">Why writing content in Markdown increases developer documentation efficiency.</p>
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
            <Link href="/compare/markdown-vs-html" className="related-link-card">
              <span>Markdown vs HTML Comparison</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/guides/markdown-syntax" className="related-link-card">
              <span>Markdown Syntax Cheat-Sheet</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/errors/markdown-rendering-issues" className="related-link-card" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
              <span>Troubleshoot Markdown Errors</span>
              <span>🔧</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
