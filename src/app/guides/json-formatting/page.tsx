"use client";

import { useState } from "react";
import Link from "next/link";

export default function JsonFormattingGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What are the rules for valid JSON?",
      a: "Valid JSON requires: (1) Data to be in key/value pairs, (2) Keys must be wrapped in double quotes, (3) Values must be strings, numbers, booleans, objects, arrays, or null, (4) Strings must use double quotes, and (5) No trailing commas are allowed at the end of lists/objects."
    },
    {
      q: "Can I use single quotes in JSON?",
      a: "No. The RFC 8259 JSON standard strictly requires double quotes ('\"') for all object keys and string values. Single quotes ('\'') will cause syntax validation errors."
    },
    {
      q: "What is the difference between formatting and minifying?",
      a: "Formatting adds tabulations, line breaks, and space indentations to make JSON human-readable. Minifying strips all unnecessary whitespace and line breaks to decrease the byte payload size for faster transmission over network sockets."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Ultimate Guide to JSON Formatting & Syntax Validation",
    "description": "Learn the official syntax rules of JavaScript Object Notation (JSON), common errors, and how to format JSON correctly.",
    "url": "https://dev-suit.vercel.app/guides/json-formatting",
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
            <span>📖</span> JSON Formatting Guide
          </h1>
          <p className="workspace-desc">
            Master the syntax specifications of JSON, write clean data structures, and resolve parse errors quickly.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>What is JSON?</h2>
        <p>
          **JSON (JavaScript Object Notation)** is a lightweight data-interchange format. It is easy for humans to read and write, and extremely easy for machines to parse and generate. Originally derived from JavaScript, it has become language-independent and is the standard format for API data transfer on the web.
        </p>

        <h2>The Strict Rules of JSON Syntax</h2>
        <p>
          While JavaScript object literals are very permissive, JSON has a strict standard (RFC 8259). Mismatches will cause parsers to fail. Here are the key rules:
        </p>
        <ul>
          <li><strong>Keys must be double-quoted:</strong> <code>&#123; "key": "value" &#125;</code> is valid, but <code>&#123; key: "value" &#125;</code> is not.</li>
          <li><strong>No trailing commas:</strong> In JavaScript, <code>[1, 2, 3,]</code> is allowed. In JSON, a trailing comma before a closing bracket or brace is a syntax error.</li>
          <li><strong>Double quotes for strings:</strong> String values must be wrapped in double quotes. Single quotes will trigger an error.</li>
          <li><strong>Numeric values:</strong> Numbers must be in standard decimal representation. Leading zeros (e.g. <code>05</code>) are forbidden.</li>
        </ul>

        <h2>Formatting Best Practices</h2>
        <p>
          For human readability, standard JSON formatting uses **2 spaces** or **4 spaces** indentation. For production deployments and API responses, **Minification** should be used. Minified JSON strips out carriage returns, line breaks, and space margins to save up to 20% in network transit bandwidth.
        </p>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Detailed structural validation guide FAQs.</p>
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
              Try Formatting Live
            </h3>
            <div className="related-links-grid">
              <Link href="/tools/json-formatter" className="related-link-card">
                <span>JSON Formatter & Validator</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/tools/xml-to-json" className="related-link-card">
                <span>XML to JSON Converter</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/compare/json-vs-xml" className="related-link-card">
                <span>JSON vs XML Comparison</span>
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
    </div>
  );
}
