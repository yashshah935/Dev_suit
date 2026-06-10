"use client";

import { useState } from "react";
import Link from "next/link";

export default function Base64EncodingGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Why is it called Base64?",
      a: "The term comes from the base-64 numbering system. The algorithm uses exactly 64 printable characters to represent binary data chunks: A-Z, a-z, 0-9, and the characters '+' and '/'."
    },
    {
      q: "What is the purpose of '=' characters at the end of Base64 strings?",
      a: "The '=' symbol is a padding character. Base64 encodes data in 24-bit groups (3 bytes), translated to 4 Base64 characters (6 bits each). If the input stream doesn't divide evenly by 3, padding characters '=' are added to complete the alignment."
    },
    {
      q: "Does Base64 encoding encrypt my data?",
      a: "No! Base64 is an encoding format, not an encryption cipher. Anyone can decode a base64 string instantly using standard utilities. It is designed to prevent data corruption during transport, not to secure confidential information."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Understanding Base64 Encoding and Binary Transport Standards",
    "description": "A deep-dive explanation of Base64 index mappings, byte groups, padding formulas, and network transport applications.",
    "url": "https://dev-suit.vercel.app/guides/base64-encoding",
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
            <span>📖</span> Base64 Encoding Guide
          </h1>
          <p className="workspace-desc">
            Explore the mathematics behind 6-bit index mapping, binary groupings, and characters sets.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>The Core Mechanics of Base64</h2>
        <p>
          **Base64** is a binary-to-text encoding scheme defined in RFC 4648. It represents binary data in an ASCII string format. By translating raw bits into standard alphanumeric characters, it prevents character set corruption in systems that only support text transfers.
        </p>

        <h2>How the Binary Division Works</h2>
        <p>
          Computers operate in 8-bit bytes. Base64 translates data in 6-bit groupings. The mathematical conversion follows these steps:
        </p>
        <ul>
          <li>The encoder loads three 8-bit bytes (24 bits total) from the source stream.</li>
          <li>These 24 bits are divided into four separate 6-bit chunks (6 bits * 4 = 24 bits).</li>
          <li>Each 6-bit value (ranging from 0 to 63) is mapped to its matching character in the Base64 Index Table.</li>
        </ul>

        <h2>The Base64 Index Alphabet Table</h2>
        <p>
          The RFC 4648 standard character set index is structured as follows:
        </p>
        <ul>
          <li><strong>0 to 25:</strong> uppercase letters <code>A</code> through <code>Z</code></li>
          <li><strong>26 to 51:</strong> lowercase letters <code>a</code> through <code>z</code></li>
          <li><strong>52 to 61:</strong> numbers <code>0</code> through <code>9</code></li>
          <li><strong>62:</strong> the plus symbol <code>+</code></li>
          <li><strong>63:</strong> the forward slash <code>/</code></li>
        </ul>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Common technical questions about Base64 translation.</p>
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
              Try Encoding & Decoding Live
            </h3>
            <div className="related-links-grid">
              <Link href="/tools/base64-encoder" className="related-link-card">
                <span>Base64 Encoder Tool</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/tools/base64-decoder" className="related-link-card">
                <span>Base64 Decoder Tool</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/tools/url-encoder" className="related-link-card">
                <span>URL Encoder Tool</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/errors/base64-invalid-input" className="related-link-card" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
                <span>Fix Invalid Base64 Characters</span>
                <span>🔧</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
