import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS_REGISTRY } from "../../utils/seoRegistry";
import AccordionFaq from "../../components/AccordionFaq";

// Import tool components
import JsonValidator from "../../../components/tools/JsonValidator";
import JsonMinifier from "../../../components/tools/JsonMinifier";
import JsonBeautifier from "../../../components/tools/JsonBeautifier";
import YamlValidator from "../../../components/tools/YamlValidator";
import YamlToJson from "../../../components/tools/YamlToJson";
import JsonToCsv from "../../../components/tools/JsonToCsv";
import CsvToJson from "../../../components/tools/CsvToJson";
import XmlFormatter from "../../../components/tools/XmlFormatter";
import XmlValidator from "../../../components/tools/XmlValidator";
import XmlBeautifier from "../../../components/tools/XmlBeautifier";
import JwtDecoder from "../../../components/tools/JwtDecoder";
import RegexTester from "../../../components/tools/RegexTester";
import TimestampConverter from "../../../components/tools/TimestampConverter";
import HashGenerator from "../../../components/tools/HashGenerator";
import UuidGenerator from "../../../components/tools/UuidGenerator";
import QrGenerator from "../../../components/tools/QrGenerator";
import HtmlEncoder from "../../../components/tools/HtmlEncoder";
import HtmlDecoder from "../../../components/tools/HtmlDecoder";
import ColorConverter from "../../../components/tools/ColorConverter";
import DiffChecker from "../../../components/tools/DiffChecker";
import CronExpression from "../../../components/tools/CronExpression";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(TOOLS_REGISTRY).map((slug) => ({
    slug,
  }));
}

export default async function ToolDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOLS_REGISTRY[slug];

  if (!tool) {
    notFound();
  }

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${tool.title} | DevSuite`,
    "url": `https://dev-suit.vercel.app/tools/${slug}`,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": tool.description
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": tool.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  // Render the matching component
  const renderToolComponent = () => {
    switch (slug) {
      case "json-validator":
        return <JsonValidator />;
      case "json-minifier":
        return <JsonMinifier />;
      case "json-beautifier":
        return <JsonBeautifier />;
      case "yaml-validator":
        return <YamlValidator />;
      case "yaml-to-json":
        return <YamlToJson />;
      case "json-to-csv":
        return <JsonToCsv />;
      case "csv-to-json":
        return <CsvToJson />;
      case "xml-formatter":
        return <XmlFormatter />;
      case "xml-validator":
        return <XmlValidator />;
      case "xml-beautifier":
        return <XmlBeautifier />;
      case "jwt-decoder":
        return <JwtDecoder />;
      case "regex-tester":
        return <RegexTester />;
      case "timestamp-converter":
        return <TimestampConverter />;
      case "hash-generator":
        return <HashGenerator />;
      case "uuid-generator":
        return <UuidGenerator />;
      case "qr-generator":
        return <QrGenerator />;
      case "html-encoder":
        return <HtmlEncoder />;
      case "html-decoder":
        return <HtmlDecoder />;
      case "color-converter":
        return <ColorConverter />;
      case "diff-checker":
        return <DiffChecker />;
      case "cron-expression":
        return <CronExpression />;
      default:
        notFound();
    }
  };

  return (
    <div className="workspace">
      {/* Schema Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>{tool.icon}</span> {tool.title}
          </h1>
          <p className="workspace-desc">{tool.description}</p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      {/* Render the Interactive Component */}
      <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
        {renderToolComponent()}
      </div>

      {/* SEO Use Cases & FAQ list */}
      <section className="seo-section" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2.5rem" }}>
        <div className="seo-grid">
          {tool.useCases && tool.useCases.length > 0 && (
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
                Practical Use Cases
              </h3>
              <div className="use-cases-list">
                {tool.useCases.map((uc, idx) => (
                  <div key={idx} className="use-case-card">
                    <div className="use-case-title">
                      <span>⚡</span> {uc.title}
                    </div>
                    <p className="use-case-desc">{uc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Frequently Asked Questions
            </h3>
            <AccordionFaq faqs={tool.faqs} />
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Related Developer Tools & Guides
          </h3>
          <div className="related-links-grid">
            <Link href={`/guides/${tool.guideSlug}`} className="related-link-card">
              <span>Read Validation Guide</span>
              <span>&rarr;</span>
            </Link>
            <Link href={`/compare/${tool.compareSlug}`} className="related-link-card">
              <span>Compare Modes & Standards</span>
              <span>&rarr;</span>
            </Link>
            <Link href={`/errors/${tool.errorSlug}`} className="related-link-card" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
              <span>Fix Parser Exceptions</span>
              <span>🔧</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
