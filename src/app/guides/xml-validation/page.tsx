"use client";

import { useState } from "react";
import Link from "next/link";

export default function XmlValidationGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What does it mean for an XML document to be well-formed?",
      a: "An XML document is well-formed if it adheres to standard XML syntax rules: it must have exactly one root element, matching opening and closing tags (casing must match), properly nested elements, and correctly escaped attributes."
    },
    {
      q: "How do I escape special characters in XML?",
      a: "Certain characters have markup meaning in XML and must be replaced by character entities: (1) '&' to '&amp;', (2) '<' to '&lt;', (3) '>' to '&gt;', (4) '\"' to '&quot;', and (5) '\'' to '&apos;'."
    },
    {
      q: "What is the difference between a sitemap and standard XML?",
      a: "A sitemap is simply an XML document that follows a specific schema defining website URLs, priority metrics, and modification dates, allowing search engine crawlers to crawl sites efficiently."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "In-Depth Guide to XML Syntax and Document Validation",
    "description": "Learn the rules of Extensible Markup Language (XML), tag hierarchy, character escaping, and validation schemas.",
    "url": "https://dev-suit.vercel.app/guides/xml-validation",
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
            <span>📖</span> XML Validation Guide
          </h1>
          <p className="workspace-desc">
            Understand the syntax constraints of XML tags, root element configurations, and entity escaping protocols.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>The Core Principles of XML</h2>
        <p>
          **XML (Extensible Markup Language)** is a markup language defined by the W3C. Unlike HTML, XML has no predefined tags. Users define their own tags and tag structures, making it extremely flexible for describing data representations across enterprise systems.
        </p>

        <h2>Well-Formed XML Constraints</h2>
        <p>
          XML parser engines are notoriously unforgiving. If a document violates the rules, parsing halts immediately. Ensure your XML is well-formed:
        </p>
        <ul>
          <li><strong>Single Root Tag:</strong> There must be exactly one parent root element enclosing all other child nodes. Double roots are prohibited.</li>
          <li><strong>Matching Tag Casing:</strong> XML tags are case-sensitive. <code>&lt;Item&gt;</code> must be closed with <code>&lt;/Item&gt;</code>, not <code>&lt;/item&gt;</code>.</li>
          <li><strong>Proper Nesting:</strong> Tags must close in the reverse order they were opened. <code>&lt;a&gt;&lt;b&gt;&lt;/b&gt;&lt;/a&gt;</code> is correct; <code>&lt;a&gt;&lt;b&gt;&lt;/a&gt;&lt;/b&gt;</code> is invalid.</li>
          <li><strong>Attribute Quotation:</strong> All attributes must be wrapped in double or single quotes. <code>&lt;item price=12&gt;</code> is invalid; it must be <code>&lt;item price="12"&gt;</code>.</li>
        </ul>

        <h2>XML Entity Escaping Reference</h2>
        <p>
          To include characters that define XML syntax structure in your text contents, use these entities:
        </p>
        <ul>
          <li><strong>&amp;</strong> &rarr; <code>&amp;amp;</code></li>
          <li><strong>&lt;</strong> &rarr; <code>&amp;lt;</code></li>
          <li><strong>&gt;</strong> &rarr; <code>&amp;gt;</code></li>
          <li><strong>"</strong> &rarr; <code>&amp;quot;</code></li>
          <li><strong>'</strong> &rarr; <code>&amp;apos;</code></li>
        </ul>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Common queries from developers regarding XML parsing rules.</p>
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
              Convert & Validate XML Live
            </h3>
            <div className="related-links-grid">
              <Link href="/tools/xml-to-json" className="related-link-card">
                <span>XML to JSON Converter</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/tools/json-to-xml" className="related-link-card">
                <span>JSON to XML Converter</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/compare/json-vs-xml" className="related-link-card">
                <span>JSON vs XML Comparison</span>
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
    </div>
  );
}
