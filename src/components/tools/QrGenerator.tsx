"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";

export default function QrGenerator() {
  const [text, setText] = useState("https://dev-suit.vercel.app");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(2);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQr = () => {
    if (!text.trim()) {
      setError("Please input some text or a link.");
      return;
    }

    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      text,
      {
        width: size,
        margin: margin,
        color: {
          dark: darkColor,
          light: lightColor
        },
        errorCorrectionLevel: "H"
      },
      (err) => {
        if (err) {
          setError(err.message || "Failed to generate QR code.");
        } else {
          setError(null);
        }
      }
    );
  };

  useEffect(() => {
    generateQr();
  }, [text, size, margin, darkColor, lightColor]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <div className="control-bar" style={{ flexWrap: "wrap", gap: "1.5rem", padding: "1.2rem" }}>
        
        {/* Input Text */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>QR Payload (Link / Text):</span>
          <input
            type="text"
            className="select-custom"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type website link or text..."
            style={{ width: "100%" }}
          />
        </div>

        {/* Size */}
        <div className="option-group">
          <span className="option-label">Size:</span>
          <select
            className="select-custom"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
          >
            <option value="128">128 x 128</option>
            <option value="256">256 x 256</option>
            <option value="512">512 x 512</option>
          </select>
        </div>

        {/* Margin */}
        <div className="option-group">
          <span className="option-label">Quiet Zone:</span>
          <select
            className="select-custom"
            value={margin}
            onChange={(e) => setMargin(parseInt(e.target.value, 10))}
          >
            <option value="0">0 Margin</option>
            <option value="2">2 Margin</option>
            <option value="4">4 Margin</option>
            <option value="8">8 Margin</option>
          </select>
        </div>

        {/* Foreground Color */}
        <div>
          <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Foreground:</span>
          <input
            type="color"
            value={darkColor}
            onChange={(e) => setDarkColor(e.target.value)}
            style={{ cursor: "pointer", border: "none", background: "none", width: "40px", height: "36px" }}
          />
        </div>

        {/* Background Color */}
        <div>
          <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Background:</span>
          <input
            type="color"
            value={lightColor}
            onChange={(e) => setLightColor(e.target.value)}
            style={{ cursor: "pointer", border: "none", background: "none", width: "40px", height: "36px" }}
          />
        </div>
      </div>

      {error && (
        <div className="status-panel error" style={{ marginTop: "1rem" }}>
          <span className="status-icon">⚠️</span>
          <span className="status-message">{error}</span>
        </div>
      )}

      <div className="pane" style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", borderRadius: "4px" }} />
        </div>
        <button className="btn-primary" onClick={handleDownload} style={{ marginTop: "1.5rem" }} disabled={!text}>
          Download QR Image (PNG)
        </button>
      </div>
    </div>
  );
}
