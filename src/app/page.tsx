"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TOOLS_REGISTRY } from "./utils/seoRegistry";
import TypingCarousel from "./components/TypingCarousel";

interface ToolInfo {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  badge?: string;
}

// 11 Original Static Tools
const STATIC_TOOLS: ToolInfo[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    description: "Format, beautify, minify, and validate JSON inputs with detailed syntax error highlighting.",
    path: "/tools/json-formatter",
    icon: "🗂️",
  },
  {
    id: "xml-to-json",
    name: "XML to JSON Converter",
    description: "Convert XML data structures into parsed JSON format with deep hierarchy representation.",
    path: "/tools/xml-to-json",
    icon: "🔌",
    badge: "Node Backend",
  },
  {
    id: "json-to-xml",
    name: "JSON to XML Converter",
    description: "Convert structured JSON data into cleanly formatted XML declarations.",
    path: "/tools/json-to-xml",
    icon: "📝",
    badge: "Node Backend",
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder",
    description: "Encode raw plain text strings into standard Base64 representation instantly.",
    path: "/tools/base64-encoder",
    icon: "🔐",
  },
  {
    id: "base64-decoder",
    name: "Base64 Decoder",
    description: "Decode Base64 string representations back to human-readable plain text instantly.",
    path: "/tools/base64-decoder",
    icon: "🔐",
  },
  {
    id: "url-encoder",
    name: "URL Encoder",
    description: "Convert special characters inside URLs to percentage percent-encoded representations.",
    path: "/tools/url-encoder",
    icon: "🔗",
  },
  {
    id: "url-decoder",
    name: "URL Decoder",
    description: "Convert percentage percent-escaped URLs back to standard text formats.",
    path: "/tools/url-decoder",
    icon: "🔗",
  },
  {
    id: "sip-calculator",
    name: "SIP Calculator with Inflation",
    description: "Calculate compound interest returns for Systemic Investment Plans adjusted for annual inflation.",
    path: "/tools/sip-calculator",
    icon: "📈",
  },
  {
    id: "speech-to-text",
    name: "Speech to Text Converter",
    description: "Transcribe spoken audio from your microphone to written text in real-time.",
    path: "/tools/speech-to-text",
    icon: "🗣️",
  },
  {
    id: "text-to-speech",
    name: "Text to Speech Synthesizer",
    description: "Synthesize typed paragraphs into spoken audio narration using custom system voices.",
    path: "/tools/text-to-speech",
    icon: "🗣️",
  },
  {
    id: "markdown-parser",
    name: "Markdown Parser & Viewer",
    description: "Convert and compile Markdown syntax to clean semantic HTML with visual live rendering and PDF downloads.",
    path: "/tools/markdown-parser",
    icon: "📝",
  },
];

// Map 21 proposed new tools from TOOLS_REGISTRY
const DYNAMIC_TOOLS: ToolInfo[] = Object.keys(TOOLS_REGISTRY).map((slug) => {
  const tool = TOOLS_REGISTRY[slug];
  return {
    id: slug,
    name: tool.title,
    description: tool.description,
    path: `/tools/${slug}`,
    icon: tool.icon,
  };
});

// All 32 Tools Combined
const ALL_TOOLS = [...STATIC_TOOLS, ...DYNAMIC_TOOLS];

// Tab category mapping
const TABS = [
  { id: "all", name: "All Tools", icon: "🛠️" },
  { id: "formatters", name: "Formatters & Text", icon: "🗂️" },
  { id: "converters", name: "Data Converters", icon: "🔄" },
  { id: "editors", name: "XML & YAML Editors", icon: "📋" },
  { id: "security", name: "Security & Hashing", icon: "🔐" },
  { id: "media", name: "Media & Utils", icon: "📈" },
];

const tabToCategoryMap: Record<string, string[]> = {
  formatters: ["json-formatter", "json-beautifier", "json-minifier", "json-validator", "diff-checker", "markdown-parser", "regex-tester"],
  converters: ["xml-to-json", "json-to-xml", "yaml-to-json", "json-to-csv", "csv-to-json"],
  editors: ["xml-formatter", "xml-beautifier", "xml-validator", "yaml-validator"],
  security: ["base64-encoder", "base64-decoder", "jwt-decoder", "hash-generator", "uuid-generator", "html-encoder", "html-decoder", "url-encoder", "url-decoder"],
  media: ["sip-calculator", "speech-to-text", "text-to-speech", "qr-generator", "cron-expression", "timestamp-converter", "color-converter"],
};

const ITEMS_PER_PAGE = 12;

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Filter tools based on selected tab and search query
  const filteredTools = ALL_TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" ||
      tabToCategoryMap[selectedCategory]?.includes(tool.id);
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Paginate filtered tools
  const totalItems = filteredTools.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="dashboard-view">
      <section className="dashboard-title-section">
        <h1 className="dashboard-title">Developer Tool Suite</h1>
        <p className="dashboard-subtitle">
          An aesthetic, high-fidelity toolbox for formatting, converting, and processing data. Pure client-side speed combined with Node.js backend power.
        </p>
      </section>

      {/* Dashboard Controls (Search and Tabs) */}
      <div className="dashboard-controls">
        <TypingCarousel />
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search 32 developer tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="category-tabs-container">
          <div className="category-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`category-tab ${
                  selectedCategory === tab.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(tab.id)}
              >
                <span style={{ marginRight: "0.25rem" }}>{tab.icon}</span>{" "}
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid-tools">
        {paginatedTools.length > 0 ? (
          paginatedTools.map((tool) => (
            <Link href={tool.path} key={tool.id} className="tool-card">
              <div className="tool-icon-wrapper">{tool.icon}</div>
              <h3
                className="tool-card-title"
                style={{ fontSize: "1.1rem", fontWeight: 600, margin: "0.5rem 0" }}
              >
                {tool.name}
              </h3>
              <p className="tool-card-desc">{tool.description}</p>

              <div className="tool-card-action">
                <span>Open Tool</span>
                <span>&rarr;</span>
              </div>

              {tool.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "rgba(0, 242, 254, 0.1)",
                    border: "1px solid rgba(0, 242, 254, 0.3)",
                    color: "var(--neon-cyan)",
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "20px",
                    fontWeight: 600,
                  }}
                >
                  {tool.badge}
                </span>
              )}
            </Link>
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3 className="no-results-title">No tools found</h3>
            <p>We couldn't find any tools matching "{searchQuery}" in this category.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            aria-label="Previous page"
          >
            &larr; Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              className={`pagination-btn ${
                currentPage === pageNum ? "active" : ""
              }`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            aria-label="Next page"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {/* SEO Discovery Columns */}
      <section className="seo-section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
          
          {/* Comparisons Column */}
          <div className="pane">
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
              ⚖️ Tool Comparisons
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Explore deep architectural and performance comparisons between common data and media standards.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link href="/compare/json-vs-xml" className="related-link-card">
                <span>JSON vs XML</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/compare/json-vs-yaml" className="related-link-card">
                <span>JSON vs YAML</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/compare/json-formatter-vs-validator" className="related-link-card">
                <span>JSON Formatter vs Validator</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/compare/yaml-vs-json" className="related-link-card">
                <span>YAML vs JSON</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/compare/md5-vs-sha256" className="related-link-card">
                <span>MD5 vs SHA-256 Hashing</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Guides Column */}
          <div className="pane">
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
              📖 Developer Guides
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Learn standard formatting and encoding practices, RFC guidelines, and syntax validation.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link href="/guides/json-formatting" className="related-link-card">
                <span>JSON Formatting</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/guides/xml-validation" className="related-link-card">
                <span>XML Validation</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/guides/yaml-validation-guide" className="related-link-card">
                <span>YAML Validation Guide</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/guides/jwt-decoding-guide" className="related-link-card">
                <span>JWT Decoding Guide</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/guides/uuid-version-4-generation" className="related-link-card">
                <span>UUID v4 Generation</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Errors Reference Column */}
          <div className="pane" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
              🔧 Debugging References
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Diagnose and solve common parse errors, incorrect characters, and padding issues.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link href="/errors/json-parse-unexpected-token" className="related-link-card">
                <span>Unexpected JSON Token</span>
                <span>🔧</span>
              </Link>
              <Link href="/errors/yaml-syntax-error" className="related-link-card">
                <span>Fix YAML Syntax Errors</span>
                <span>🔧</span>
              </Link>
              <Link href="/errors/jwt-invalid-signature-or-token" className="related-link-card">
                <span>Invalid JWT Signature</span>
                <span>🔧</span>
              </Link>
              <Link href="/errors/color-converter-invalid-hex-code" className="related-link-card">
                <span>Invalid HEX Color Code</span>
                <span>🔧</span>
              </Link>
              <Link href="/errors/base64-invalid-input" className="related-link-card">
                <span>Base64 Invalid Input</span>
                <span>🔧</span>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
