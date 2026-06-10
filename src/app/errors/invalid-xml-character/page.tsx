"use client";

import { useState } from "react";
import Link from "next/link";

export default function InvalidXmlCharacterError() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const errorOutputExample = `XML Parsing Error: xmlParseEntityRef: no name
    Line Number 8, Column 22:
    <link href="http://site.com?q=1&amp;p=2" />
                         ^ (Error: Raw '&' character)`;

  const fixExampleBefore = `<store>
  <description>Buy computer parts & software</description>
</store>`;

  const fixExampleAfter = `<store>
  <description>Buy computer parts &amp; software</description>
</store>`;

  const faqs = [
    {
      q: "Which characters are forbidden in raw XML text?",
      a: "The two most critical forbidden characters are '<' and '&'. The '<' character is reserved for opening tags, and '&' is reserved for declaring entities. Storing them raw triggers parsing crashes."
    },
    {
      q: "How do I resolve invalid character errors in URL parameters?",
      a: "If you store URLs with multiple query parameters separated by '&' inside XML tags, replace every '&' with '&amp;'. For example: 'http://site.com?a=1&amp;b=2'."
    },
    {
      q: "Can CDATA sections help bypass entity escaping?",
      a: "Yes! If you have large blocks of text containing many symbols (like code snippets or scripts), wrap them in a CDATA section: '<![CDATA[ your raw text & characters here ]]>'. The parser will treat it as character data rather than markup, bypassing escaping requirements."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "How to Fix: Invalid Character or xmlParseEntityRef Error in XML",
    "description": "A developer troubleshooting reference explaining how to escape illegal characters and debug XML validation failures.",
    "url": "https://dev-suit.vercel.app/errors/invalid-xml-character",
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
            <span>🔧</span> Error: Invalid XML Character
          </h1>
          <p className="workspace-desc">
            Understand why XML engines fail on raw symbols and how to properly escape elements.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>The Error Signature</h2>
        <p>
          XML parser specifications require strict conformity. Encountering unescaped structural symbols like an ampersand (<code>&amp;</code>) will halt the parser immediately, throwing validation errors.
        </p>
        <pre className="guide-code-box" style={{ borderColor: "rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.03)", color: "#fca5a5" }}>
          {errorOutputExample}
        </pre>

        <h2>Common Causes & Code Examples</h2>

        <h3>1. Unescaped Ampersand (<code>&amp;</code>)</h3>
        <p>Storing a raw ampersand in descriptions or text values will fail:</p>
        <pre className="guide-code-box" style={{ background: "rgba(239, 68, 68, 0.02)" }}>{fixExampleBefore}</pre>
        <p>To resolve, replace the symbol with its entity representation (<code>&amp;amp;</code>):</p>
        <pre className="guide-code-box" style={{ background: "rgba(16, 185, 129, 0.02)", borderColor: "rgba(16, 185, 129, 0.3)" }}>{fixExampleAfter}</pre>

        <h3>2. Unescaped Less-Than Symbol (<code>&lt;</code>)</h3>
        <p>
          Since <code>&lt;</code> declares tag initialization, using it to represent mathematical inequalities (e.g. <code>x &lt; y</code>) will break parsing. Replace with <code>&amp;lt;</code>.
        </p>

        <h3>3. Invalid Unicode/ASCII Characters</h3>
        <p>
          XML documents only support specific character ranges. Control bytes, null characters, or invalid UTF-8 sequences will trigger validation crashes.
        </p>

        <h2>Resolution Checklist</h2>
        <ul>
          <li><strong>Locate the character:</strong> Check the line and column number from the console logs.</li>
          <li><strong>Escape manually:</strong> Replace illegal characters with their XML character reference values.</li>
          <li><strong>Use CDATA Wrapper:</strong> For long blocks of code or plain text, wrap the contents in <code>&lt;![CDATA[ ... ]]&gt;</code> to instruct the parser to ignore entities.</li>
        </ul>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Resolve XML structure and entity debugging problems.</p>
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
              <Link href="/tools/xml-to-json" className="related-link-card" style={{ borderLeft: "3px solid var(--neon-cyan)" }}>
                <span>XML to JSON Converter</span>
                <span>🔌</span>
              </Link>
              <Link href="/tools/json-to-xml" className="related-link-card">
                <span>JSON to XML Converter</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/compare/json-vs-xml" className="related-link-card">
                <span>JSON vs XML Comparison</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/guides/xml-validation" className="related-link-card">
                <span>XML Validation Guide</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
