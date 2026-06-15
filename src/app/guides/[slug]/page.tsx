import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES_REGISTRY } from "../../utils/seoRegistry";
import AccordionFaq from "../../components/AccordionFaq";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(GUIDES_REGISTRY).map((slug) => ({
    slug,
  }));
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = GUIDES_REGISTRY[slug];

  if (!guide) {
    notFound();
  }

  // Schema Markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": guide.title,
    "description": guide.description,
    "url": `https://dev-suit.vercel.app/guides/${slug}`,
    "author": {
      "@type": "Organization",
      "name": "DevSuite"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": guide.faqs.map(faq => ({
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
            <span>{guide.icon}</span> {guide.title}
          </h1>
          <p className="workspace-desc">{guide.description}</p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1.5rem" }}>
        {guide.sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              {section.title}
            </h2>
            {section.paragraphs.map((p, pIdx) => (
              <p
                key={pIdx}
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1rem",
                  lineHeight: "1.7",
                  marginBottom: "1rem",
                }}
              >
                {p.startsWith("- ") ? (
                  <span style={{ display: "block", paddingLeft: "1rem", textIndent: "-1rem" }}>
                    {p}
                  </span>
                ) : (
                  p
                )}
              </p>
            ))}
          </div>
        ))}

        <section className="seo-section" style={{ marginTop: "3rem", borderTop: "1px solid var(--border-color)", paddingTop: "2rem" }}>
          <div>
            <h2 className="seo-title">Frequently Asked Questions</h2>
            <p className="seo-subtitle">Detailed specifications & guides FAQs.</p>
          </div>
          
          <AccordionFaq faqs={guide.faqs} />

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Try Live Tool & Debuggers
            </h3>
            <div className="related-links-grid">
              <Link href={`/tools/${guide.toolSlug}`} className="related-link-card">
                <span>Launch Interactive Tool</span>
                <span>&rarr;</span>
              </Link>
              <Link href={`/compare/${guide.compareSlug}`} className="related-link-card">
                <span>Compare vs Alternatives</span>
                <span>&rarr;</span>
              </Link>
              <Link href={`/errors/${guide.errorSlug}`} className="related-link-card" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
                <span>Troubleshoot Parse Errors</span>
                <span>🔧</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
