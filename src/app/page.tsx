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
    path: "/json-formatter",
    icon: "🗂️",
    nodeBackend: false,
  },
  {
    id: "xml-to-json",
    name: "XML to JSON Converter",
    description: "Convert XML data structures into parsed JSON format with deep hierarchy representation using Node.js.",
    path: "/xml-to-json",
    icon: "🔌",
    badge: "Node Backend",
    nodeBackend: true,
  },
  {
    id: "json-to-xml",
    name: "JSON to XML Converter",
    description: "Convert structured JSON data into cleanly formatted XML declarations using Node.js.",
    path: "/json-to-xml",
    icon: "📝",
    badge: "Node Backend",
    nodeBackend: true,
  },
  {
    id: "base64",
    name: "Base64 Encoder & Decoder",
    description: "Encode text to Base64 format or decode Base64 strings back to readable text instantly.",
    path: "/base64",
    icon: "🔐",
    nodeBackend: false,
  },
  {
    id: "url-encode",
    name: "URL Encoder & Decoder",
    description: "Convert special characters in text to URL-encoded percentage representations and back.",
    path: "/url-encode",
    icon: "🔗",
    nodeBackend: false,
  },
  {
    id: "sip-calculator",
    name: "SIP Calculator with Inflation",
    description: "Calculate compound interest returns for Systemic Investment Plans adjusted for annual inflation.",
    path: "/sip-calculator",
    icon: "📈",
    nodeBackend: false,
  },
  {
    id: "mp4-to-mp3",
    name: "MP4 to MP3 Converter",
    description: "Upload an MP4 video file and extract its audio stream directly as a downloadable MP3 using Node.js & FFmpeg.",
    path: "/mp4-to-mp3",
    icon: "🎵",
    badge: "Node Backend",
    nodeBackend: true,
  },
  {
    id: "voice-text",
    name: "Voice & Text Converter",
    description: "Convert speech to written text in real-time or vocalize text inputs into speech using Web Speech APIs.",
    path: "/voice-text",
    icon: "🗣️",
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

      <div className="grid-tools">
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
    </div>
  );
}
