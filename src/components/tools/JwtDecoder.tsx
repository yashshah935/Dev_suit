"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [expInfo, setExpInfo] = useState<{ date: string; expired: boolean; timeLeft: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const base64UrlDecode = (str: string): string => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return atob(base64);
  };

  const handleDecode = () => {
    if (!token.trim()) {
      setError("Please input a JWT token first.");
      setHeader("");
      setPayload("");
      setExpInfo(null);
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT structure. A JWT must consist of three parts separated by dots (Header.Payload.Signature).");
      }

      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError(null);

      // Handle Expiration details
      if (decodedPayload.exp) {
        const expTimeSecs = decodedPayload.exp;
        const expDate = new Date(expTimeSecs * 1000);
        const now = new Date();
        const diffMs = expDate.getTime() - now.getTime();

        const expired = diffMs <= 0;
        let timeLeft = "";

        if (expired) {
          timeLeft = `Expired ${(Math.abs(diffMs) / 1000 / 60).toFixed(1)} minutes ago`;
        } else {
          const mins = Math.floor(diffMs / 1000 / 60);
          const hours = Math.floor(mins / 60);
          const days = Math.floor(hours / 24);

          if (days > 0) {
            timeLeft = `${days} days, ${hours % 24} hours remaining`;
          } else if (hours > 0) {
            timeLeft = `${hours} hours, ${mins % 60} minutes remaining`;
          } else {
            timeLeft = `${mins} minutes, ${Math.floor((diffMs / 1000) % 60)} seconds remaining`;
          }
        }

        setExpInfo({
          date: expDate.toLocaleString(),
          expired,
          timeLeft,
        });
      } else {
        setExpInfo(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to decode JWT token. Ensure it is a valid base64url encoded token.");
      setHeader("");
      setPayload("");
      setExpInfo(null);
    }
  };

  const handleCopy = (text: string, type: string) => {
    copyToClipboard(text).then(() => {
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  const loadSample = () => {
    // Generate a valid mock JWT token with 1 hour expiration in future
    const headerMock = { alg: "HS256", typ: "JWT" };
    const payloadMock = {
      sub: "1234567890",
      name: "John Doe",
      admin: true,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
    };

    const b64Header = btoa(JSON.stringify(headerMock)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    const b64Payload = btoa(JSON.stringify(payloadMock)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    const signatureMock = "dYgNs7_v4aG2z_v-92aN";

    setToken(`${b64Header}.${b64Payload}.${signatureMock}`);
    setError(null);
    setHeader("");
    setPayload("");
    setExpInfo(null);
  };

  return (
    <div>
      <div className="control-bar">
        <div className="control-options">
          <button className="btn-secondary" onClick={loadSample}>
            Load Mock Token Sample
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={() => { setToken(""); setHeader(""); setPayload(""); setError(null); setExpInfo(null); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleDecode}>
            Decode JWT
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Input JWT Token</h2>
          </div>
          <div className="editor-wrapper">
            <textarea
              className="code-editor-textarea"
              placeholder="Paste encoded JWT token here (Header.Payload.Signature)..."
              value={token}
              onChange={(e) => { setToken(e.target.value); setError(null); }}
              style={{
                height: "100px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                padding: "1rem",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                width: "100%"
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="status-panel error" style={{ marginBottom: "1.5rem" }}>
          <span className="status-icon">⚠️</span>
          <div className="status-details">
            <span className="status-title">Decoding Error</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}

      {expInfo && (
        <div className={`status-panel ${expInfo.expired ? "error" : "success"}`} style={{ marginBottom: "1.5rem" }}>
          <span className="status-icon">{expInfo.expired ? "⏰" : "✅"}</span>
          <div className="status-details">
            <span className="status-title">{expInfo.expired ? "Token Expired" : "Active Token Signature"}</span>
            <span className="status-message">
              Expires at: <strong>{expInfo.date}</strong> ({expInfo.timeLeft})
            </span>
          </div>
        </div>
      )}

      <div className="workspace-grid">
        {/* Header Decoded */}
        <div className="pane">
          <div className="pane-header" style={{ borderLeft: "3px solid var(--neon-cyan)" }}>
            <h2 className="pane-title" style={{ color: "var(--neon-cyan)" }}>Decoded Header (ALGORITHM & TOKEN TYPE)</h2>
            <div className="pane-actions">
              <button className="btn-icon" onClick={() => handleCopy(header, "header")} disabled={!header} title="Copy Header">
                📋
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="Decoded header details..."
                value={header}
                readOnly
                style={{ height: "250px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem" }}
              />
            </div>
            {copyFeedback === "header" && <span className="toast-feedback">Copied Header!</span>}
          </div>
        </div>

        {/* Payload Decoded */}
        <div className="pane">
          <div className="pane-header" style={{ borderLeft: "3px solid var(--neon-purple)" }}>
            <h2 className="pane-title" style={{ color: "var(--neon-purple)" }}>Decoded Payload (DATA CLAIMS)</h2>
            <div className="pane-actions">
              <button className="btn-icon" onClick={() => handleCopy(payload, "payload")} disabled={!payload} title="Copy Payload">
                📋
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="Decoded payload claims..."
                value={payload}
                readOnly
                style={{ height: "250px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem" }}
              />
            </div>
            {copyFeedback === "payload" && <span className="toast-feedback">Copied Claims!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
