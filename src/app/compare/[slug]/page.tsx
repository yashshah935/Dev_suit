import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPARE_REGISTRY } from "../../utils/seoRegistry";
import AccordionFaq from "../../components/AccordionFaq";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(COMPARE_REGISTRY).map((slug) => ({
    slug,
  }));
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const compareRef = COMPARE_REGISTRY[slug];

  if (!compareRef) {
    notFound();
  }

  // Schema Markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": compareRef.title,
    "description": compareRef.description,
    "url": `https://dev-suit.vercel.app/compare/${slug}`,
    "author": {
      "@type": "Organization",
      "name": "DevSuite"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": compareRef.faqs.map(faq => ({
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

      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>{compareRef.icon}</span> {compareRef.title}
          </h1>
          <p className="workspace-desc">{compareRef.description}</p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "2rem" }}>
        
        {/* Comparison Matrix Table */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
          Feature Matrix
        </h2>
        <div style={{ overflowX: "auto", marginBottom: "2.5rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "0.95rem",
            background: "rgba(13, 17, 28, 0.3)"
          }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>Feature / Metric</th>
                <th style={{ padding: "1rem", fontWeight: 600, color: "var(--neon-cyan)" }}>{compareRef.toolA}</th>
                <th style={{ padding: "1rem", fontWeight: 600, color: "var(--neon-purple)" }}>{compareRef.toolB}</th>
              </tr>
            </thead>
            <tbody>
              {compareRef.matrix.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx === compareRef.matrix.length - 1 ? "none" : "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem", fontWeight: 500, color: "var(--text-primary)" }}>{row.feature}</td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{row.valA}</td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{row.valB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pros & Cons Columns */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
          Pros & Cons Contrast
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
          
          {/* Tool A */}
          <div className="pane">
            <h3 style={{ fontSize: "1.15rem", color: "var(--neon-cyan)", marginBottom: "1rem", fontWeight: 600 }}>{compareRef.toolA}</h3>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.9rem", color: "var(--success)", marginBottom: "0.5rem", fontWeight: 600 }}>🟢 Advantages</h4>
              <ul style={{ paddingLeft: "1.2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {compareRef.prosA.map((pro, idx) => (
                  <li key={idx} style={{ marginBottom: "0.4rem" }}>{pro}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "0.9rem", color: "var(--error)", marginBottom: "0.5rem", fontWeight: 600 }}>🔴 Limitations</h4>
              <ul style={{ paddingLeft: "1.2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {compareRef.consA.map((con, idx) => (
                  <li key={idx} style={{ marginBottom: "0.4rem" }}>{con}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tool B */}
          <div className="pane">
            <h3 style={{ fontSize: "1.15rem", color: "var(--neon-purple)", marginBottom: "1rem", fontWeight: 600 }}>{compareRef.toolB}</h3>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.9rem", color: "var(--success)", marginBottom: "0.5rem", fontWeight: 600 }}>🟢 Advantages</h4>
              <ul style={{ paddingLeft: "1.2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {compareRef.prosB.map((pro, idx) => (
                  <li key={idx} style={{ marginBottom: "0.4rem" }}>{pro}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "0.9rem", color: "var(--error)", marginBottom: "0.5rem", fontWeight: 600 }}>🔴 Limitations</h4>
              <ul style={{ paddingLeft: "1.2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {compareRef.consB.map((con, idx) => (
                  <li key={idx} style={{ marginBottom: "0.4rem" }}>{con}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <section className="seo-section" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Detailed standard and mode difference FAQs.</p>
          </div>
          
          <AccordionFaq faqs={compareRef.faqs} />

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Try Interactive Utilities
            </h3>
            <div className="related-links-grid">
              <Link href={`/tools/${compareRef.toolSlug}`} className="related-link-card">
                <span>Launch Interactive Tool</span>
                <span>&rarr;</span>
              </Link>
              <Link href={`/guides/${compareRef.guideSlug}`} className="related-link-card">
                <span>Read formatting Guide</span>
                <span>&rarr;</span>
              </Link>
              <Link href={`/errors/${compareRef.errorSlug}`} className="related-link-card" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
                <span>Fix Common Parse Errors</span>
                <span>🔧</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
