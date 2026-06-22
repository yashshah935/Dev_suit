"use client";

import { useState } from "react";
import Link from "next/link";

export default function JsonVsYaml() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const jsonExample = `{
  "projectName": "DevSuite",
  "active": true,
  "tags": ["seo", "utilities", "developer"]
}`;

  const yamlExample = `projectName: DevSuite
active: true
tags:
  - seo
  - utilities
  - developer`;

  const faqs = [
    {
      q: "Is YAML a subset of JSON?",
      a: "Yes, YAML version 1.2 is a superset of JSON. This means any valid JSON document is also a valid YAML document."
    },
    {
      q: "Why is JSON preferred over YAML for APIs?",
      a: "JSON is faster to parse and has simpler syntax rules without indentation dependency. YAML parsers are more complex, slower, and susceptible to indentation syntax bugs."
    },
    {
      q: "Does YAML support comments?",
      a: "Yes! YAML supports native inline comments using the '#' prefix, making it the preferred choice for configuration files."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "JSON vs YAML: Configuration and API Formats Compared",
    "description": "An in-depth look at JavaScript Object Notation (JSON) vs YAML Ain't Markup Language (YAML) syntaxes.",
    "url": "https://dev-suit.vercel.app/compare/json-vs-yaml",
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
            <span>⚖️</span> JSON vs YAML
          </h1>
          <p className="workspace-desc">
            An interactive comparison comparing JSON and YAML configuration schemas, syntax details, speed, and readability.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>Syntax Comparison</h2>
        <p>
          While **JSON** uses braces, brackets, and quotes to define data boundaries, **YAML** relies on line breaks and indentation spaces. Here is an example of the same dataset represented in both syntaxes:
        </p>

        <div className="responsive-grid-2">
          <div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>JSON Format</h3>
            <pre className="guide-code-box">{jsonExample}</pre>
          </div>
          <div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>YAML Format</h3>
            <pre className="guide-code-box">{yamlExample}</pre>
          </div>
        </div>

        <h2>Feature Matrices</h2>
        <div className="comparison-table-wrapper" style={{ margin: "2rem 0" }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Comparison Aspect</th>
                <th>JSON</th>
                <th>YAML</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Readability</strong></td>
                <td>Moderate (cluttered by brackets/quotes)</td>
                <td>High (clean whitespace structure)</td>
              </tr>
              <tr>
                <td><strong>Comments</strong></td>
                <td>Not supported</td>
                <td>Supported natively (<code># comment</code>)</td>
              </tr>
              <tr>
                <td><strong>Parsing Overhead</strong></td>
                <td>Minimal (highly optimized in all engines)</td>
                <td>Moderate (complex spacing indentation engine)</td>
              </tr>
              <tr>
                <td><strong>Data Types</strong></td>
                <td>Strings, Numbers, Objects, Arrays, Booleans, Null</td>
                <td>Rich types (dates, custom anchors, merges)</td>
              </tr>
              <tr>
                <td><strong>Primary Use Case</strong></td>
                <td>Web API payloads, client-server transfer</td>
                <td>Developer configs (Docker, K8s, CI pipelines)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Syntax & Formatting Takeaways</h2>
        <p>
          - **Use JSON** if you are transferring data asynchronously across microservices, writing REST or GraphQL payloads, or handling database stores.
          - **Use YAML** if you are writing user-facing configuration files, CI/CD specifications (like GitHub Actions), or complex service setups where human readability and comments are vital.
        </p>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Understanding standard conventions of JSON and YAML.</p>
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
              Related Developer Tools & Guides
            </h3>
            <div className="related-links-grid">
              <Link href="/tools/json-formatter" className="related-link-card">
                <span>JSON Formatter & Validator</span>
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
