"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<{ md5: string; sha1: string; sha256: string; sha512: string } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Simple client-side MD5 implementation
  const calculateMd5 = (str: string): string => {
    const k = [
      0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
      0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
      0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
      0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
      0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
      0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
      0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
      0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ];
    const r = [
      7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
      5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
      4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
      6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];
    
    const words: number[] = [];
    const len = str.length * 8;
    for (let i = 0; i < str.length * 8; i += 8) {
      words[i >> 5] |= (str.charCodeAt(i / 8) & 0xff) << (i % 32);
    }
    words[len >> 5] |= 0x80 << (len % 32);
    words[(((len + 64) >>> 9) << 4) + 14] = len;

    let h0 = 0x67452301;
    let h1 = 0xefcdab89;
    let h2 = 0x98badcfe;
    let h3 = 0x10325476;

    for (let i = 0; i < words.length; i += 16) {
      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;

      for (let j = 0; j < 64; j++) {
        let f = 0;
        let g = 0;
        if (j < 16) {
          f = (b & c) | (~b & d);
          g = j;
        } else if (j < 32) {
          f = (d & b) | (~d & c);
          g = (5 * j + 1) % 16;
        } else if (j < 48) {
          f = b ^ c ^ d;
          g = (3 * j + 5) % 16;
        } else {
          f = c ^ (b | ~d);
          g = (7 * j) % 16;
        }

        const temp = d;
        d = c;
        c = b;
        const rotateLeft = (val: number, shift: number) => (val << shift) | (val >>> (32 - shift));
        b = b + rotateLeft(a + f + k[j] + (words[i + g] || 0), r[j]);
        a = temp;
      }

      h0 = (h0 + a) | 0;
      h1 = (h1 + b) | 0;
      h2 = (h2 + c) | 0;
      h3 = (h3 + d) | 0;
    }

    const toHex = (n: number) => {
      let out = "";
      for (let i = 0; i < 4; i++) {
        out += ((n >> (i * 8 + 4)) & 0xf).toString(16) + ((n >> (i * 8)) & 0xf).toString(16);
      }
      return out;
    };

    return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3);
  };

  const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleGenerate = async () => {
    if (!input) {
      setHashes(null);
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    // Compute WebCrypto hashes
    const sha1Buffer = await crypto.subtle.digest("SHA-1", data);
    const sha256Buffer = await crypto.subtle.digest("SHA-256", data);
    const sha512Buffer = await crypto.subtle.digest("SHA-512", data);

    setHashes({
      md5: calculateMd5(input),
      sha1: bufferToHex(sha1Buffer),
      sha256: bufferToHex(sha256Buffer),
      sha512: bufferToHex(sha512Buffer),
    });
  };

  const handleCopy = (text: string, type: string) => {
    copyToClipboard(text).then(() => {
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  return (
    <div>
      <div className="pane" style={{ marginBottom: "1.5rem" }}>
        <div className="pane-header">
          <h2 className="pane-title">Input Text</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <textarea
            className="code-editor-textarea"
            placeholder="Type or paste text here to generate hashes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              height: "100px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              padding: "1rem",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              width: "100%"
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button className="btn-primary" onClick={handleGenerate} disabled={!input}>
              Generate Hashes
            </button>
          </div>
        </div>
      </div>

      {hashes && (
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Cryptographic Signatures</h2>
          </div>
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            
            {/* MD5 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--neon-pink)" }}>MD5 (Legacy Hashing)</span>
                <button
                  className="btn-secondary"
                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => handleCopy(hashes.md5, "md5")}
                >
                  {copyFeedback === "md5" ? "Copied!" : "Copy MD5"}
                </button>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", background: "rgba(0,0,0,0.25)", padding: "0.75rem", borderRadius: "6px", overflowX: "auto", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                {hashes.md5}
              </div>
            </div>

            {/* SHA-1 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--neon-purple)" }}>SHA-1</span>
                <button
                  className="btn-secondary"
                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => handleCopy(hashes.sha1, "sha1")}
                >
                  {copyFeedback === "sha1" ? "Copied!" : "Copy SHA-1"}
                </button>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", background: "rgba(0,0,0,0.25)", padding: "0.75rem", borderRadius: "6px", overflowX: "auto", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                {hashes.sha1}
              </div>
            </div>

            {/* SHA-256 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--neon-cyan)" }}>SHA-256 (Highly Secure)</span>
                <button
                  className="btn-secondary"
                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => handleCopy(hashes.sha256, "sha256")}
                >
                  {copyFeedback === "sha256" ? "Copied!" : "Copy SHA-256"}
                </button>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", background: "rgba(0,0,0,0.25)", padding: "0.75rem", borderRadius: "6px", overflowX: "auto", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                {hashes.sha256}
              </div>
            </div>

            {/* SHA-512 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>SHA-512</span>
                <button
                  className="btn-secondary"
                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => handleCopy(hashes.sha512, "sha512")}
                >
                  {copyFeedback === "sha512" ? "Copied!" : "Copy SHA-512"}
                </button>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", background: "rgba(0,0,0,0.25)", padding: "0.75rem", borderRadius: "6px", overflowX: "auto", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                {hashes.sha512}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
