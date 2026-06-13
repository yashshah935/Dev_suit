"use client";

import { useState, useEffect } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function ColorConverter() {
  const [hex, setHex] = useState("#00f2fe");
  const [rgb, setRgb] = useState("rgb(0, 242, 254)");
  const [hsl, setHsl] = useState("hsl(182, 100%, 50%)");
  const [cmyk, setCmyk] = useState("cmyk(100%, 0%, 0%, 0%)");
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Conversion logic helpers
  const hexToRgb = (hexStr: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hexStr.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 242, b: 254 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rPerc = r / 255;
    const gPerc = g / 255;
    const bPerc = b / 255;

    const k = 1 - Math.max(rPerc, gPerc, bPerc);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    const c = Math.round(((1 - rPerc - k) / (1 - k)) * 100);
    const m = Math.round(((1 - gPerc - k) / (1 - k)) * 100);
    const y = Math.round(((1 - bPerc - k) / (1 - k)) * 100);

    return { c, m, y, k: Math.round(k * 100) };
  };

  const updateAllColors = (colorHex: string) => {
    const { r, g, b } = hexToRgb(colorHex);
    const hslObj = rgbToHsl(r, g, b);
    const cmykObj = rgbToCmyk(r, g, b);

    setHex(colorHex);
    setRgb(`rgb(${r}, ${g}, ${b})`);
    setHsl(`hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`);
    setCmyk(`cmyk(${cmykObj.c}%, ${cmykObj.m}%, ${cmykObj.y}%, ${cmykObj.k}%)`);
  };

  const handleHexInput = (val: string) => {
    setHex(val);
    if (/^#[0-9A-F]{6}$/i.test(val) || /^#[0-9A-F]{3}$/i.test(val)) {
      updateAllColors(val);
    }
  };

  const handleCopy = (text: string, type: string) => {
    copyToClipboard(text).then(() => {
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  return (
    <div>
      <div className="workspace-grid" style={{ gridTemplateColumns: "1fr 1.5fr" }}>
        
        {/* Color Preview & Picker */}
        <div className="pane" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              backgroundColor: hex,
              boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 0 20px " + hex + "40",
              marginBottom: "1.5rem",
              border: "4px solid rgba(255,255,255,0.08)"
            }}
          />
          <span className="option-label" style={{ marginBottom: "0.5rem" }}>Color Swatch Picker:</span>
          <input
            type="color"
            value={hex}
            onChange={(e) => updateAllColors(e.target.value)}
            style={{
              cursor: "pointer",
              border: "none",
              background: "none",
              width: "100px",
              height: "40px"
            }}
          />
        </div>

        {/* Color Conversion Outputs */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Color Space Mappings</h2>
          </div>
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {/* Hex */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--neon-cyan)" }}>
                <span>Hexadecimal Code (HEX)</span>
                <button
                  className="btn-secondary"
                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => handleCopy(hex, "hex")}
                >
                  {copyFeedback === "hex" ? "Copied!" : "Copy"}
                </button>
              </div>
              <input
                type="text"
                className="select-custom"
                value={hex}
                onChange={(e) => handleHexInput(e.target.value)}
                style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}
              />
            </div>

            {/* RGB */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--neon-purple)" }}>
                <span>Red Green Blue (RGB)</span>
                <button
                  className="btn-secondary"
                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => handleCopy(rgb, "rgb")}
                >
                  {copyFeedback === "rgb" ? "Copied!" : "Copy"}
                </button>
              </div>
              <input
                type="text"
                className="select-custom"
                value={rgb}
                readOnly
                style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}
              />
            </div>

            {/* HSL */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--neon-pink)" }}>
                <span>Hue Saturation Lightness (HSL)</span>
                <button
                  className="btn-secondary"
                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => handleCopy(hsl, "hsl")}
                >
                  {copyFeedback === "hsl" ? "Copied!" : "Copy"}
                </button>
              </div>
              <input
                type="text"
                className="select-custom"
                value={hsl}
                readOnly
                style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}
              />
            </div>

            {/* CMYK */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                <span>Cyan Magenta Yellow Key (CMYK - Print Specs)</span>
                <button
                  className="btn-secondary"
                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => handleCopy(cmyk, "cmyk")}
                >
                  {copyFeedback === "cmyk" ? "Copied!" : "Copy"}
                </button>
              </div>
              <input
                type="text"
                className="select-custom"
                value={cmyk}
                readOnly
                style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
