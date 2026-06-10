"use client";

import { useState } from "react";
import Link from "next/link";

export default function Mp3VsWav() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is WAV sound quality always better than MP3?",
      a: "Yes, because WAV files store raw, uncompressed pulse-code modulation (PCM) audio streams, preserving 100% of the recorded waveform data. MP3 is a lossy compression format that removes audio details that are less audible to humans to save space."
    },
    {
      q: "What is the typical compression ratio of MP3?",
      a: "An MP3 encoded at 192kbps or 320kbps is typically 10 to 12 times smaller in file size than the corresponding uncompressed WAV file, while retaining excellent audible fidelity for standard listening."
    },
    {
      q: "When should developers use WAV over MP3?",
      a: "Use WAV in audio editing software, gaming assets (for low-latency looping without decode lag), or high-fidelity sound synthesis. Use MP3 for web streaming, podcasts, and mobile app players to minimize download payloads."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "MP3 vs WAV: Audio Quality, Compression, and Streaming Compared",
    "description": "An analytical comparison between MP3 (lossy) and WAV (lossless) audio formats for web development and media.",
    "url": "https://dev-suit.vercel.app/compare/mp3-vs-wav",
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
            <span>⚖️</span> MP3 vs WAV
          </h1>
          <p className="workspace-desc">
            Analyze the differences between MP3 lossy audio compression and WAV lossless waveform audio formats.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>Lossy Compression vs. Lossless Raw Waveforms</h2>
        <p>
          The major difference between **MP3** and **WAV** is compression. WAV files are uncompressed, making them massive but high quality, whereas MP3 files use psychoacoustic modeling to compress files up to 90% while keeping them sound acceptable.
        </p>

        <h2>Audio Format Properties</h2>
        <div className="comparison-table-wrapper" style={{ margin: "2rem 0" }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>MP3 (MPEG-1 Audio Layer III)</th>
                <th>WAV (Waveform Audio File Format)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Compression Type</strong></td>
                <td>Lossy (discards inaudible audio detail)</td>
                <td>Lossless / Uncompressed (PCM format)</td>
              </tr>
              <tr>
                <td><strong>File Size</strong></td>
                <td>Small (~1MB per minute of audio at 128kbps)</td>
                <td>Large (~10MB per minute of audio)</td>
              </tr>
              <tr>
                <td><strong>Bitrate Range</strong></td>
                <td>Typically 96kbps to 320kbps</td>
                <td>Typically 1411kbps (16-bit, 44.1kHz stereo)</td>
              </tr>
              <tr>
                <td><strong>Web Compatibility</strong></td>
                <td>Universal (supported in all web browsers)</td>
                <td>Universal, but rarely streamed due to file size</td>
              </tr>
              <tr>
                <td><strong>Ideal Use Case</strong></td>
                <td>Podcast delivery, web audio players, music storage</td>
                <td>Master recordings, sound design assets, loop clips</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Audible Sound Comparison</h2>
        <p>
          At lower bitrates (e.g. 96kbps), an MP3 will sound noticeably 'hollow' or metallic in the high frequency range. At 320kbps (the maximum MP3 bitrate standard), the difference between MP3 and WAV is practically indistinguishable to the average listener using standard headphones or speakers.
        </p>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Understanding sound parameters and deployment metrics.</p>
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
              <Link href="/tools/text-to-speech" className="related-link-card">
                <span>Text to Speech Synthesizer</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/tools/speech-to-text" className="related-link-card">
                <span>Speech to Text Transcriber</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/tools/json-formatter" className="related-link-card">
                <span>JSON Formatter & Validator</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
