import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import Link from "next/link";
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
            <nav className="header-links" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link href="/" className="nav-link">
                Dashboard
              </Link>
              <Link href="/json-formatter" className="nav-link">
                JSON Formatter
              </Link>
              <Link href="/xml-to-json" className="nav-link">
                XML to JSON
              </Link>
              <Link href="/json-to-xml" className="nav-link">
                JSON to XML
              </Link>
              <div className="dropdown">
                <span className="dropdown-trigger">
                  More Tools <span style={{ fontSize: "0.75rem" }}>▼</span>
                </span>
                <div className="dropdown-menu">
                  <Link href="/base64" className="dropdown-item">
                    Base64
                  </Link>
                  <Link href="/url-encode" className="dropdown-item">
                    URL Encode
                  </Link>
                  <Link href="/sip-calculator" className="dropdown-item">
                    SIP Calculator
                  </Link>
                  <Link href="/mp4-to-mp3" className="dropdown-item">
                    MP4 to MP3
                  </Link>
                  <Link href="/voice-text" className="dropdown-item">
                    Voice & Text
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
    </html>
  );
}
