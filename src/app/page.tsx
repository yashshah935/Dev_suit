import Link from "next/link";

interface ToolInfo {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  badge?: string;
  nodeBackend: boolean;
}

const TOOLS: ToolInfo[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    description: "Format, beautify, minify, and validate JSON inputs with detailed syntax error highlighting.",
    path: "/tools/json-formatter",
    icon: "🗂️",
    nodeBackend: false,
  },
  {
    id: "xml-to-json",
    name: "XML to JSON Converter",
    description: "Convert XML data structures into parsed JSON format with deep hierarchy representation using Node.js.",
    path: "/tools/xml-to-json",
    icon: "🔌",
    badge: "Node Backend",
    nodeBackend: true,
  },
  {
    id: "json-to-xml",
    name: "JSON to XML Converter",
    description: "Convert structured JSON data into cleanly formatted XML declarations using Node.js.",
    path: "/tools/json-to-xml",
    icon: "📝",
    badge: "Node Backend",
    nodeBackend: true,
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder",
    description: "Encode raw plain text strings into standard Base64 representation instantly.",
    path: "/tools/base64-encoder",
    icon: "🔐",
    nodeBackend: false,
  },
  {
    id: "base64-decoder",
    name: "Base64 Decoder",
    description: "Decode Base64 string representations back to human-readable plain text instantly.",
    path: "/tools/base64-decoder",
    icon: "🔐",
    nodeBackend: false,
  },
  {
    id: "url-encoder",
    name: "URL Encoder",
    description: "Convert special characters inside URLs to percentage percent-encoded representations.",
    path: "/tools/url-encoder",
    icon: "🔗",
    nodeBackend: false,
  },
  {
    id: "url-decoder",
    name: "URL Decoder",
    description: "Convert percentage percent-escaped URLs back to standard text formats.",
    path: "/tools/url-decoder",
    icon: "🔗",
    nodeBackend: false,
  },
  {
    id: "sip-calculator",
    name: "SIP Calculator with Inflation",
    description: "Calculate compound interest returns for Systemic Investment Plans adjusted for annual inflation.",
    path: "/tools/sip-calculator",
    icon: "📈",
    nodeBackend: false,
  },
  {
    id: "speech-to-text",
    name: "Speech to Text Converter",
    description: "Transcribe spoken audio from your microphone to written text in real-time.",
    path: "/tools/speech-to-text",
    icon: "🗣️",
    nodeBackend: false,
  },
  {
    id: "text-to-speech",
    name: "Text to Speech Synthesizer",
    description: "Synthesize typed paragraphs into spoken audio narration using custom system voices.",
    path: "/tools/text-to-speech",
    icon: "🗣️",
    nodeBackend: false,
  },
  {
    id: "markdown-parser",
    name: "Markdown Parser & Viewer",
    description: "Convert and compile Markdown syntax to clean semantic HTML with visual live rendering and PDF downloads.",
    path: "/tools/markdown-parser",
    icon: "📝",
    nodeBackend: false,
  },
];

export default function Dashboard() {
  return (
    <div className="dashboard-view">
      <section className="dashboard-title-section">
        <h1 className="dashboard-title">Developer Tool Suite</h1>
        <p className="dashboard-subtitle">
          An aesthetic, high-fidelity toolbox for formatting, converting, and processing data. Pure client-side speed combined with Node.js backend power.
        </p>
      </section>

      {/* Main Grid: 10 Relocated Tools */}
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-primary)", fontFamily: "var(--font-outfit)" }}>
        Available Developer Utilities
      </h2>
      <div className="grid-tools" style={{ marginBottom: "4rem" }}>
        {TOOLS.map((tool) => (
          <Link href={tool.path} key={tool.id} className="tool-card">
            <div className="tool-icon-wrapper">{tool.icon}</div>
            <h2 className="tool-card-title">{tool.name}</h2>
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
        ))}
      </div>

      {/* SEO Discovery Section: Comparisons, Guides, and Errors */}
      <section className="seo-section" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
          
          {/* Comparisons Column */}
          <div className="pane" style={{ background: "rgba(8, 10, 16, 0.3)" }}>
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
              <Link href="/compare/mp3-vs-wav" className="related-link-card">
                <span>MP3 vs WAV</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/compare/markdown-vs-html" className="related-link-card">
                <span>Markdown vs HTML</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Guides Column */}
          <div className="pane" style={{ background: "rgba(8, 10, 16, 0.3)" }}>
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
              <Link href="/guides/base64-encoding" className="related-link-card">
                <span>Base64 Encoding</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/guides/markdown-syntax" className="related-link-card">
                <span>Markdown Syntax</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Errors Reference Column */}
          <div className="pane" style={{ background: "rgba(8, 10, 16, 0.3)", borderLeft: "3px solid var(--neon-pink)" }}>
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
              <Link href="/errors/invalid-xml-character" className="related-link-card">
                <span>Invalid XML Character</span>
                <span>🔧</span>
              </Link>
              <Link href="/errors/base64-invalid-input" className="related-link-card">
                <span>Base64 Invalid Input</span>
                <span>🔧</span>
              </Link>
              <Link href="/errors/markdown-rendering-issues" className="related-link-card">
                <span>Markdown Rendering Errors</span>
                <span>🔧</span>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
