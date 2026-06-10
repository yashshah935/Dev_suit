"use client";

import { useState } from "react";
import Link from "next/link";

export default function JsonVsXml() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const jsonExample = `{
  "store": {
    "name": "Gadget Empire",
    "location": "Cyber City",
    "onlineOrderEnabled": true
  }
}`;

  const xmlExample = `<?xml version="1.0" encoding="UTF-8"?>
<store name="Gadget Empire" location="Cyber City">
  <onlineOrderEnabled>true</onlineOrderEnabled>
</store>`;

  const faqs = [
    {
      q: "Which is faster, JSON or XML?",
      a: "JSON is generally faster to parse and serialize because it maps directly to native programming language data structures (like maps, arrays, and objects). XML parsing requires a DOM browser tree or recursive SAX parser, which introduces more CPU and memory overhead."
    },
    {
      q: "When should I use XML instead of JSON?",
      a: "Use XML if you require document validation schemas (XSD/DTD), mixed content (combining tags and text inline, like in XHTML), or XPath querying for complex data node extraction."
    },
    {
      q: "Does JSON support comments?",
      a: "No. The standard JSON specification (RFC 8259) does not support code comments. XML, on the other hand, fully supports comments using the standard '<!-- comment -->' syntax."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "JSON vs XML: Structural, Speed, and Usability Comparison",
    "description": "A comprehensive comparison between JSON and XML data serialization formats for web APIs and configurations.",
    "url": "https://dev-suit.vercel.app/compare/json-vs-xml",
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
            <span>⚖️</span> JSON vs XML
          </h1>
          <p className="workspace-desc">
            A comprehensive, high-fidelity developer comparison between JavaScript Object Notation (JSON) and Extensible Markup Language (XML).
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>Core Differences Overview</h2>
        <p>
          Both **JSON** and **XML** serve the same underlying purpose: to serialize and transfer structured data across network sockets. However, they were designed in different eras with distinct architectural philosophies.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", margin: "2rem 0" }}>
          <div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>JSON Representation</h3>
            <pre className="guide-code-box">{jsonExample}</pre>
          </div>
          <div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>XML Representation</h3>
            <pre className="guide-code-box">{xmlExample}</pre>
          </div>
        </div>

        <h2>Detailed Feature Comparison</h2>
        <div className="comparison-table-wrapper" style={{ margin: "2rem 0" }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>JSON</th>
                <th>XML</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Syntax Style</strong></td>
                <td>Key-value pairs, arrays, and objects (C-like)</td>
                <td>Markup tags with attributes (SGML-like)</td>
              </tr>
              <tr>
                <td><strong>File Size</strong></td>
                <td>Lightweight (no redundant closing tags)</td>
                <td>Bulkier (needs matching closing tags)</td>
              </tr>
              <tr>
                <td><strong>Parsing Speed</strong></td>
                <td>Extremely fast (direct JS mapping)</td>
                <td>Slower (requires complex DOM parsers)</td>
              </tr>
              <tr>
                <td><strong>Metadata</strong></td>
                <td>Not native (handled via key values)</td>
                <td>Native via element attributes</td>
              </tr>
              <tr>
                <td><strong>Comments</strong></td>
                <td>No standard support</td>
                <td>Supported natively (<code>&lt;!-- comment --&gt;</code>)</td>
              </tr>
              <tr>
                <td><strong>Security</strong></td>
                <td>High (parsed via sandboxed JSON.parse)</td>
                <td>Vulnerable to XXE injection injections</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Which Format Should You Choose?</h2>
        <p>
          - **Choose JSON** if you are writing modern REST APIs, web single-page apps, mobile integrations, or configuring services where low bandwidth and speed are crucial.
          - **Choose XML** if you are integrating with enterprise SOAP services, generating document structures with mixed textual nodes, or need strict compliance validation using XSD/XSLT stylesheets.
        </p>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Common queries from developers regarding JSON and XML integration.</p>
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
              Try Formatting & Converting Live
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
              <Link href="/tools/json-formatter" className="related-link-card">
                <span>JSON Formatter & Validator</span>
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
