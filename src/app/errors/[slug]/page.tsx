import Link from "next/link";
import { notFound } from "next/navigation";
import { ERRORS_REGISTRY } from "../../utils/seoRegistry";
import AccordionFaq from "../../components/AccordionFaq";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(ERRORS_REGISTRY).map((slug) => ({
    slug,
  }));
}

export default async function ErrorPage({ params }: PageProps) {
  const { slug } = await params;
  const errorRef = ERRORS_REGISTRY[slug];

  if (!errorRef) {
    notFound();
  }

  // Schema Markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": errorRef.title,
    "description": errorRef.description,
    "url": `https://dev-suit.vercel.app/errors/${slug}`,
    "author": {
      "@type": "Organization",
      "name": "DevSuite"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": errorRef.faqs.map(faq => ({
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
      {/* Schema Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="workspace-header" style={{ borderLeft: "4px solid var(--neon-pink)", paddingLeft: "1rem" }}>
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>{errorRef.icon}</span> {errorRef.title}
          </h1>
          <p className="workspace-desc">{errorRef.description}</p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "2rem" }}>
        
        {/* Code Comparison Block */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
          Example Error & Fix
        </h2>
        <div className="responsive-grid-2" style={{ marginBottom: "2rem" }}>
          <div className="pane" style={{ borderTop: "3px solid var(--error)", background: "rgba(239, 68, 68, 0.04)" }}>
            <h3 style={{ fontSize: "0.95rem", color: "var(--error)", marginBottom: "0.5rem", fontWeight: 600 }}>❌ Malformed Payload</h3>
            <pre style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              background: "rgba(0,0,0,0.3)",
              padding: "1rem",
              borderRadius: "6px",
              overflowX: "auto",
              color: "#fca5a5",
              whiteSpace: "pre-wrap"
            }}>
              {errorRef.codeExample.bad}
            </pre>
          </div>
          <div className="pane" style={{ borderTop: "3px solid var(--success)", background: "rgba(16, 185, 129, 0.04)" }}>
            <h3 style={{ fontSize: "0.95rem", color: "var(--success)", marginBottom: "0.5rem", fontWeight: 600 }}>✅ Corrected Payload</h3>
            <pre style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              background: "rgba(0,0,0,0.3)",
              padding: "1rem",
              borderRadius: "6px",
              overflowX: "auto",
              color: "#a7f3d0",
              whiteSpace: "pre-wrap"
            }}>
              {errorRef.codeExample.good}
            </pre>
          </div>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "2rem", fontStyle: "italic" }}>
          💡 <strong>Explanation:</strong> {errorRef.codeExample.explanation}
        </p>

        {/* Common Causes */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
          Common Root Causes
        </h2>
        <ul style={{ paddingLeft: "1.2rem", marginBottom: "2rem", color: "var(--text-secondary)" }}>
          {errorRef.causes.map((cause, idx) => (
            <li key={idx} style={{ marginBottom: "0.75rem", lineHeight: "1.6" }}>
              {cause}
            </li>
          ))}
        </ul>

        {/* Solutions */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
          Recommended Solutions
        </h2>
        <ul style={{ paddingLeft: "1.2rem", marginBottom: "2rem", color: "var(--text-secondary)" }}>
          {errorRef.solutions.map((sol, idx) => (
            <li key={idx} style={{ marginBottom: "0.75rem", lineHeight: "1.6" }}>
              {sol}
            </li>
          ))}
        </ul>

        <section className="seo-section" style={{ marginTop: "3rem", borderTop: "1px solid var(--border-color)", paddingTop: "2rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Resolve debugging issues faster with these common answers.</p>
          </div>
          
          <AccordionFaq faqs={errorRef.faqs} />

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Related Developer Tools & Handbooks
            </h3>
            <div className="related-links-grid">
              <Link href={`/tools/${errorRef.toolSlug}`} className="related-link-card">
                <span>Launch Validator Tool</span>
                <span>&rarr;</span>
              </Link>
              <Link href={`/guides/${errorRef.guideSlug}`} className="related-link-card">
                <span>Read formatting Guide</span>
                <span>&rarr;</span>
              </Link>
              <Link href={`/compare/${errorRef.compareSlug}`} className="related-link-card">
                <span>Compare Formats Side-by-Side</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
