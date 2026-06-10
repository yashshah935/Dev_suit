"use client";

import { useState } from "react";
import Link from "next/link";

export default function JsonUnexpectedTokenError() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const errorOutputExample = `SyntaxError: Unexpected token ' in JSON at position 12
    at JSON.parse (<anonymous>)`;

  const fixExampleBefore = `{
  'name': 'Developer',
  "active": true,
}`;

  const fixExampleAfter = `{
  "name": "Developer",
  "active": true
}`;

  const faqs = [
    {
      q: "What does 'position X' refer to in the error message?",
      a: "The position refers to the byte index from the start of the JSON input string where the parser encountered the invalid character. Position 0 is the very first character."
    },
    {
      q: "How do I resolve unexpected token errors caused by copy-pasting?",
      a: "Copying text from rich document formats (like PDF or Word) often converts normal double quotes into curly quotes or smart quotes (e.g. “ ”). These are invalid in JSON and must be replaced with straight double quotes (\")."
    },
    {
      q: "Can trailing commas trigger this error?",
      a: "Yes! A comma after the last item in a JSON list or object (e.g., [1, 2, 3,]) will cause the parser to look for a subsequent element and throw an 'unexpected token ]' or 'unexpected token }' error."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "How to Fix: SyntaxError: Unexpected token in JSON at position X",
    "description": "A step-by-step developer debugging reference explaining how to find and resolve unexpected token parsing errors in JSON documents.",
    "url": "https://dev-suit.vercel.app/errors/json-parse-unexpected-token",
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
          <h1 className="workspace-title" style={{ color: "var(--neon-pink)" }}>
            <span>🔧</span> Error: Unexpected Token in JSON
          </h1>
          <p className="workspace-desc">
            Learn why JavaScript throws "SyntaxError: Unexpected token" and how to debug and repair your JSON input.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>The Error Signature</h2>
        <p>
          This error triggers when you pass a malformed string into <code>JSON.parse()</code>. Since JSON is a highly strict syntax standard, even a minor discrepancy will crash the parser.
        </p>
        <pre className="guide-code-box" style={{ borderColor: "rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.03)", color: "#fca5a5" }}>
          {errorOutputExample}
        </pre>

        <h2>Common Causes & Code Examples</h2>

        <h3>1. Single Quotes instead of Double Quotes</h3>
        <p>JSON does not allow single quotes for keys or string values.</p>
        <pre className="guide-code-box" style={{ background: "rgba(239, 68, 68, 0.02)" }}>{fixExampleBefore}</pre>
        <p>To fix, replace all single quotes with straight double quotes and remove any trailing commas:</p>
        <pre className="guide-code-box" style={{ background: "rgba(16, 185, 129, 0.02)", borderColor: "rgba(16, 185, 129, 0.3)" }}>{fixExampleAfter}</pre>

        <h3>2. Unescaped Control Characters</h3>
        <p>
          Strings containing real tabs, raw carriage returns, or unescaped forward slashes will fail validation. Use <code>\\n</code> or <code>\\t</code> instead of raw tabs or line breaks inside string values.
        </p>

        <h3>3. Trailing Commas</h3>
        <p>
          Avoid placing commas after the final key-value pair of an object or the final item of an array list.
        </p>

        <h2>Resolution Checklist</h2>
        <ul>
          <li><strong>Identify the error position:</strong> Copy your JSON string into a text editor, search for the byte/character index indicated in the error message, and inspect that location.</li>
          <li><strong>Validate online:</strong> Paste the text into our JSON Formatter tool to automatically highlight the exact line and character causing the syntax breakdown.</li>
          <li><strong>Check smart quotes:</strong> Replace any curly quotes like <code>“</code> or <code>”</code> with normal straight quotes <code>"</code>.</li>
        </ul>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Resolve JSON.parse debugging blockers.</p>
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
              Test & Repair JSON Live
            </h3>
            <div className="related-links-grid">
              <Link href="/tools/json-formatter" className="related-link-card" style={{ borderLeft: "3px solid var(--neon-cyan)" }}>
                <span>JSON Formatter & Validator</span>
                <span>⚡</span>
              </Link>
              <Link href="/tools/xml-to-json" className="related-link-card">
                <span>XML to JSON Converter</span>
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
