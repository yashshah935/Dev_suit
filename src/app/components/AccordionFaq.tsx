"use client";

import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

export default function AccordionFaq({ faqs }: { faqs: FAQItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="faq-list" style={{ marginTop: "1rem" }}>
      {faqs.map((faq, idx) => (
        <div key={idx} className="faq-item">
          <button
            className="faq-question"
            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: "1rem 0",
              color: "var(--text-primary)",
              fontWeight: 500,
              fontSize: "1rem",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <span>{faq.q}</span>
            <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
              {openFaq === idx ? "▲" : "▼"}
            </span>
          </button>
          {openFaq === idx && (
            <div
              className="faq-answer"
              style={{
                padding: "1rem 0",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: "1.6",
              }}
            >
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
