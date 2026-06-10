"use client";

import { useState } from "react";
import Link from "next/link";

export default function Base64InvalidInputError() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const errorOutputExample = `DOMException: Failed to execute 'atob' on 'Window': 
    The string to be decoded is not correctly encoded.
    at Base64Decoder (base64-decoder.tsx:28)`;

  const fixExampleBefore = `RGVlcE1pbmQgQW50aWdyYXZpdHkgRGV2U3VpdGUgLSBQcmVtaXVtIFV0aWxpdGllcyDwn5🚀`;

  const fixExampleAfter = `RGVlcE1pbmQgQW50aWdyYXZpdHkgRGV2U3VpdGUgLSBQcmVtaXVtIFV0aWxpdGllcyDwn5qA`;

  const faqs = [
    {
      q: "What causes the 'Failed to execute atob' error?",
      a: "This happens when the string passed to atob() contains characters outside of the Base64 alphabet (A-Z, a-z, 0-9, +, /) or if the string's length is not a multiple of 4 (incorrect padding)."
    },
    {
      q: "How do I fix spacing and carriage return errors in Base64?",
      a: "Newlines, spaces, or tabs inside base64 strings will throw decoding errors. Before calling atob(), strip out all whitespace characters using regex: 'base64String.replace(/\\s/g, \"\")'."
    },
    {
      q: "Why can't I paste raw emojis directly into the decoder?",
      a: "Emojis and multi-byte unicode symbols cannot be decoded directly by standard atob(). They must be encoded and decoded using a UTF-8 percent-escaping mapping logic."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "How to Fix: DOMException: Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.",
    "description": "A developer troubleshooting guide explaining how to debug and repair invalid base64 input strings and padding errors.",
    "url": "https://dev-suit.vercel.app/errors/base64-invalid-input",
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
            <span>🔧</span> Error: Base64 Invalid Input
          </h1>
          <p className="workspace-desc">
            Understand why atob() fails to execute and how to clean your Base64 encoded streams.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>The Error Signature</h2>
        <p>
          The browser <code>atob()</code> function requires strict base64 conforming strings. If an invalid character is encountered, a DOMException is thrown.
        </p>
        <pre className="guide-code-box" style={{ borderColor: "rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.03)", color: "#fca5a5" }}>
          {errorOutputExample}
        </pre>

        <h2>Common Causes & Code Examples</h2>

        <h3>1. Multi-byte Unicode Emojis in base64 string</h3>
        <p>If the base64 string concatenates an unencoded emoji or invalid character directly, decoding fails:</p>
        <pre className="guide-code-box" style={{ background: "rgba(239, 68, 68, 0.02)" }}>{fixExampleBefore}</pre>
        <p>To fix, replace the emoji with its base64 code representations (<code>qA</code>):</p>
        <pre className="guide-code-box" style={{ background: "rgba(16, 185, 129, 0.02)", borderColor: "rgba(16, 185, 129, 0.3)" }}>{fixExampleAfter}</pre>

        <h3>2. Missing Padding (<code>=</code>) Characters</h3>
        <p>
          Base64 strings must have a length divisible by 4. If the source encoded text ends abruptly, you may need to append one or two <code>=</code> padding characters to align the stream.
        </p>

        <h3>3. Invalid Characters (Spaces, Newlines, Tabs)</h3>
        <p>
          Pasting base64 text from formatted email files or text documents often carries spacing, carriage returns, or tabs. Ensure these are stripped out prior to running decode scripts.
        </p>

        <h2>Resolution Checklist</h2>
        <ul>
          <li><strong>Strip spaces:</strong> Remove spaces and tabs from the input string.</li>
          <li><strong>Align padding length:</strong> Ensure the string length is a multiple of 4, adding <code>=</code> or <code>==</code> padding if required.</li>
          <li><strong>Check character set:</strong> Verify that only base64 characters (A-Z, a-z, 0-9, +, /, =) are present in the string.</li>
        </ul>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Solve common base64.atob decoding failures.</p>
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
              Decode Base64 Live
            </h3>
            <div className="related-links-grid">
              <Link href="/tools/base64-decoder" className="related-link-card" style={{ borderLeft: "3px solid var(--neon-cyan)" }}>
                <span>Base64 Decoder Tool</span>
                <span>🔐</span>
              </Link>
              <Link href="/tools/base64-encoder" className="related-link-card">
                <span>Base64 Encoder Tool</span>
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
    </div>
  );
}
