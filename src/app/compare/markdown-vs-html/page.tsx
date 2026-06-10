"use client";

import { useState } from "react";
import Link from "next/link";

export default function MarkdownVsHtml() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const mdExample = `# Title
This is **bold** text and [a link](https://example.com).`;

  const htmlExample = `<h1>Title</h1>
<p>This is <strong>bold</strong> text and <a href="https://example.com">a link</a>.</p>`;

  const faqs = [
    {
      q: "Can I write raw HTML tags inside a Markdown file?",
      a: "Yes. The standard Markdown specification fully supports inline HTML. If Markdown doesn't have a native tag for a feature (like subscript, details summary, or custom spacing), you can write standard HTML elements directly inside the document."
    },
    {
      q: "Which is better for website SEO, Markdown or HTML?",
      a: "For search engines, they are equivalent. Markdown is compiled into standard semantic HTML before it is served to web browsers. What Google indexes is the final HTML structure, so both produce the same SEO outcomes as long as appropriate tags (h1, strong, a) are used."
    },
    {
      q: "Does Markdown require compilation?",
      a: "Yes. Browsers cannot parse or render Markdown syntax natively. Before rendering on a web page, the markdown code must pass through a parser/compiler (like our custom parser, marked, or mdX) to translate it into standard HTML DOM elements."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Markdown vs HTML: Data Serialization and Formatting Comparison",
    "description": "An in-depth technical comparison between Markdown documentation syntax and HyperText Markup Language (HTML) for web projects.",
    "url": "https://dev-suit.vercel.app/compare/markdown-vs-html",
    "author": {
      "@type": "Organization",
      "name": "DevSuite"
    }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>⚖️</span> Markdown vs HTML
          </h1>
          <p className="workspace-desc">
            A detailed comparison between Markdown documentation shorthand syntax and HyperText Markup Language (HTML).
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>Core Concepts</h2>
        <p>
          While **HTML** is the underlying native standard of the World Wide Web, **Markdown** was created as a lightweight plain-text formatting syntax that developers can easily read and write, which compiles cleanly into HTML.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", margin: "2rem 0" }}>
          <div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>Markdown Syntax Shorthand</h3>
            <pre className="guide-code-box">{mdExample}</pre>
          </div>
          <div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>Compiled HTML Document</h3>
            <pre className="guide-code-box">{htmlExample}</pre>
          </div>
        </div>

        <h2>Detailed Comparison Table</h2>
        <div className="comparison-table-wrapper" style={{ margin: "2rem 0" }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Markdown</th>
                <th>HTML</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Readability</strong></td>
                <td>High (looks like clean plain-text)</td>
                <td>Low (obstructed by opening/closing tag structures)</td>
              </tr>
              <tr>
                <td><strong>Browser Support</strong></td>
                <td>Requires compile parser to render</td>
                <td>Natively supported by 100% of browsers</td>
              </tr>
              <tr>
                <td><strong>Syntax Complexity</strong></td>
                <td>Extremely simple (minimal symbols like #, *)</td>
                <td>Verbose (requires brackets, tags, attributes)</td>
              </tr>
              <tr>
                <td><strong>XSS Security</strong></td>
                <td>High (most parsers escape raw HTML strings)</td>
                <td>Requires manual sanitization of injection vulnerabilities</td>
              </tr>
              <tr>
                <td><strong>Custom Styling</strong></td>
                <td>Limited (relies on style stylesheets)</td>
                <td>Unlimited (supports inline styles, classes, id tags)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Which Format Should You Choose?</h2>
        <p>
          - **Choose Markdown** if you are writing developer READMEs, repository documentation, user guides, or writing blog content where raw typing speed and readability are paramount.
          - **Choose HTML** if you are building complex page layouts, embedding interactive layouts, designing custom emails, or require custom CSS styling overrides directly in the code structure.
        </p>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Common queries from developers regarding Markdown vs HTML.</p>
          </div>
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

          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Try Parsing Live
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
              <Link href="/errors/markdown-rendering-issues" className="related-link-card">
                <span>Markdown Rendering Errors</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
