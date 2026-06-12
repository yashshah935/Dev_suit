import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DevSuite - Premium Developer Utilities",
  description: "A gorgeous, high-performance developer tool suite with JSON formatter, XML/JSON converters, and encoding utilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable}`}>
      <body>
        <div className="app-container">
          <header className="header">
            <Link href="/" className="logo-container">
              <div className="logo-icon">D</div>
              <span className="logo-text">DevSuite</span>
            </Link>
            <nav className="header-links" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link href="/" className="nav-link">
                Dashboard
              </Link>
              <div className="dropdown">
                <span className="dropdown-trigger">
                  Formatters & Converters <span style={{ fontSize: "0.75rem" }}>▼</span>
                </span>
                <div className="dropdown-menu">
                  <Link href="/tools/json-formatter" className="dropdown-item">
                    JSON Formatter
                  </Link>
                  <Link href="/tools/xml-to-json" className="dropdown-item">
                    XML to JSON
                  </Link>
                  <Link href="/tools/json-to-xml" className="dropdown-item">
                    JSON to XML
                  </Link>
                  <Link href="/tools/markdown-parser" className="dropdown-item">
                    Markdown Parser
                  </Link>
                </div>
              </div>
              <div className="dropdown">
                <span className="dropdown-trigger">
                  Utility Tools <span style={{ fontSize: "0.75rem" }}>▼</span>
                </span>
                <div className="dropdown-menu">
                  <Link href="/tools/base64-encoder" className="dropdown-item">
                    Base64 Encoder
                  </Link>
                  <Link href="/tools/base64-decoder" className="dropdown-item">
                    Base64 Decoder
                  </Link>
                  <Link href="/tools/url-encoder" className="dropdown-item">
                    URL Encoder
                  </Link>
                  <Link href="/tools/url-decoder" className="dropdown-item">
                    URL Decoder
                  </Link>
                  <Link href="/tools/speech-to-text" className="dropdown-item">
                    Speech to Text
                  </Link>
                  <Link href="/tools/text-to-speech" className="dropdown-item">
                    Text to Speech
                  </Link>
                  <Link href="/tools/sip-calculator" className="dropdown-item">
                    SIP Calculator
                  </Link>
                </div>
              </div>
              <div className="dropdown">
                <span className="dropdown-trigger">
                  Comparisons <span style={{ fontSize: "0.75rem" }}>▼</span>
                </span>
                <div className="dropdown-menu">
                  <Link href="/compare/json-vs-xml" className="dropdown-item">
                    JSON vs XML
                  </Link>
                  <Link href="/compare/json-vs-yaml" className="dropdown-item">
                    JSON vs YAML
                  </Link>
                  <Link href="/compare/mp3-vs-wav" className="dropdown-item">
                    MP3 vs WAV
                  </Link>
                  <Link href="/compare/markdown-vs-html" className="dropdown-item">
                    Markdown vs HTML
                  </Link>
                </div>
              </div>
              <div className="dropdown">
                <span className="dropdown-trigger">
                  Resources <span style={{ fontSize: "0.75rem" }}>▼</span>
                </span>
                <div className="dropdown-menu">
                  <Link href="/guides/json-formatting" className="dropdown-item">
                    JSON Formatting Guide
                  </Link>
                  <Link href="/guides/xml-validation" className="dropdown-item">
                    XML Validation Guide
                  </Link>
                  <Link href="/guides/base64-encoding" className="dropdown-item">
                    Base64 Encoding Guide
                  </Link>
                  <Link href="/guides/markdown-syntax" className="dropdown-item">
                    Markdown Syntax Guide
                  </Link>
                  <Link href="/errors/json-parse-unexpected-token" className="dropdown-item" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
                    JSON Parse Error Fix
                  </Link>
                  <Link href="/errors/invalid-xml-character" className="dropdown-item" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
                    XML Char Error Fix
                  </Link>
                  <Link href="/errors/base64-invalid-input" className="dropdown-item" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
                    Base64 Input Error Fix
                  </Link>
                  <Link href="/errors/markdown-rendering-issues" className="dropdown-item" style={{ borderLeft: "3px solid var(--neon-pink)" }}>
                    Markdown Render Fix
                  </Link>
                </div>
              </div>
            </nav>
          </header>

          <main className="main-content">{children}</main>

          <footer className="footer">
            <p>
              &copy; {new Date().getFullYear()} <strong>DevSuite</strong>. Crafted for developers. Powered by Next.js & Node.js.
            </p>
          </footer>
        </div>
      </body>
      <GoogleAnalytics gaId="G-X2QDECQ10Z" />
    </html>
  );
}
