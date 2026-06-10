"use client";

import Link from "next/link";

export default function MarkdownRenderingIssues() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Troubleshooting Common Markdown Rendering & Parser Errors",
    "description": "A developer guide to fixing unclosed styling tags, broken tables, nesting list issues, and safety escape bugs in Markdown.",
    "url": "https://dev-suit.vercel.app/errors/markdown-rendering-issues",
    "author": {
      "@type": "Organization",
      "name": "DevSuite"
    }
  };

  return (
    <div className="workspace">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>🔧</span> Troubleshoot Markdown Errors
          </h1>
          <p className="workspace-desc">
            A reference guide explaining common Markdown compilation warnings, rendering errors, and syntax resolution strategies.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>Common Markdown Formatting Issues</h2>
        <p>
          Unlike highly strict compilers (like JSON or XML), Markdown parsers usually do not crash or throw hard syntax errors when they encounter malformed tags. Instead, they fail silently, rendering corrupt visual outputs.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", margin: "2rem 0" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.25rem", borderRadius: "8px", borderLeft: "4px solid var(--neon-pink)" }}>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>1. Nested List Spacing Failure</h3>
            <p style={{ fontSize: "0.95rem" }}>
              **Issue**: Sub-items are rendered on the same line as the parent item instead of nested underneath.
              <br />
              **Cause**: In Markdown, nested lists require a precise indentation prefix (either 2 or 4 spaces). Standard paragraph spacing must also be maintained.
              <br />
              **Fix**: Ensure your nested lists are indented with spaces:
            </p>
            <pre className="guide-code-box" style={{ marginTop: "0.5rem" }}>{`- Parent Item
  - Nested Child Item (Indented with 2 spaces)`}</pre>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.25rem", borderRadius: "8px", borderLeft: "4px solid var(--neon-pink)" }}>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>2. Unclosed Bold or Italic Symbols</h3>
            <p style={{ fontSize: "0.95rem" }}>
              **Issue**: Entire paragraphs of text below a formatted phrase are rendered in bold or italic weights.
              <br />
              **Cause**: Missing the closing syntax symbols (`**` or `*`) causes parsers to treat all succeeding text in the document as part of the style block.
              <br />
              **Fix**: Ensure every opening sequence has a matching closing symbol:
            </p>
            <pre className="guide-code-box" style={{ marginTop: "0.5rem" }}>{`This **is bold** and this is regular text.`}</pre>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.25rem", borderRadius: "8px", borderLeft: "4px solid var(--neon-pink)" }}>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>3. Raw HTML Script Vulnerabilities (XSS)</h3>
            <p style={{ fontSize: "0.95rem" }}>
              **Issue**: Malicious script inputs paste code like `&lt;script&gt;alert(1)&lt;/script&gt;` that triggers in the preview.
              <br />
              **Cause**: Using a markdown compiler without escaping character entities (converting `&lt;` and `&gt;`) renders raw HTML components directly.
              <br />
              **Fix**: Use DevSuite's Markdown tool which automatically sanitizes and escapes all raw tags before generating DOM preview blocks.
            </p>
          </div>
        </div>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Live Parsing & Syntax Reference
            </h3>
            <div className="related-links-grid">
              <Link href="/tools/markdown-parser" className="related-link-card">
                <span>Markdown Parser & Viewer</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/guides/markdown-syntax" className="related-link-card">
                <span>Markdown Syntax Guide</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/compare/markdown-vs-html" className="related-link-card">
                <span>Markdown vs HTML</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
