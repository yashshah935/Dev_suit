"use client";

import { useState, useEffect } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<{ match: string; index: number; groups: string[] }[]>([]);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Check flag status helper
  const handleFlagChange = (flagChar: string) => {
    if (flags.includes(flagChar)) {
      setFlags(flags.replace(flagChar, ""));
    } else {
      setFlags(flags + flagChar);
    }
  };

  useEffect(() => {
    if (!pattern || !text) {
      setMatches([]);
      setHighlightedHtml(text);
      setError(null);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      setError(null);

      // Perform matching
      const foundMatches: { match: string; index: number; groups: string[] }[] = [];
      let matchesHtml = "";
      let lastIndex = 0;

      if (flags.includes("g")) {
        const iterator = text.matchAll(regex);
        for (const match of iterator) {
          if (match.index === undefined) continue;
          
          // Add highlights
          matchesHtml += escapeHtml(text.substring(lastIndex, match.index));
          matchesHtml += `<mark style="background: rgba(0, 242, 254, 0.3); color: var(--text-primary); border-radius: 3px; padding: 1px 2px; border-bottom: 2px solid var(--neon-cyan)">${escapeHtml(match[0])}</mark>`;
          lastIndex = match.index + match[0].length;

          // Push details
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: Array.from(match).slice(1)
          });

          // Prevent infinite loop if regex is empty/zero width
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
        matchesHtml += escapeHtml(text.substring(lastIndex));
      } else {
        const match = text.match(regex);
        if (match && match.index !== undefined) {
          matchesHtml += escapeHtml(text.substring(0, match.index));
          matchesHtml += `<mark style="background: rgba(0, 242, 254, 0.3); color: var(--text-primary); border-radius: 3px; padding: 1px 2px; border-bottom: 2px solid var(--neon-cyan)">${escapeHtml(match[0])}</mark>`;
          matchesHtml += escapeHtml(text.substring(match.index + match[0].length));

          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: Array.from(match).slice(1)
          });
        } else {
          matchesHtml = escapeHtml(text);
        }
      }

      setMatches(foundMatches);
      setHighlightedHtml(matchesHtml);
    } catch (err: any) {
      setError(err.message || "Invalid regular expression pattern.");
      setMatches([]);
      setHighlightedHtml(text);
    }
  }, [pattern, flags, text]);

  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const loadSample = () => {
    setPattern(`\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b`);
    setFlags("g");
    setText(`Hello! You can reach support at support@devsuite.app or sales at sales-team99@dev-suit.vercel.app.\nHave a wonderful day!`);
    setError(null);
  };

  return (
    <div>
      <div className="control-bar" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start", padding: "1.2rem" }}>
        
        {/* Pattern Input and Flags bar */}
        <div style={{ display: "flex", width: "100%", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Regular Expression:</span>
            <div style={{ display: "flex", position: "relative" }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--neon-purple)", fontWeight: 700 }}>/</span>
              <input
                type="text"
                className="select-custom"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="([A-Za-z0-9]+)..."
                style={{ width: "100%", paddingLeft: "1.75rem", paddingRight: "1.75rem", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}
              />
              <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--neon-purple)", fontWeight: 700 }}>/{flags}</span>
            </div>
          </div>

          <div>
            <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Flags:</span>
            <div style={{ display: "flex", gap: "0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", padding: "0.45rem 1rem", borderRadius: "8px" }}>
              {["g", "i", "m", "s", "u", "y"].map((f) => (
                <label key={f} style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer", fontSize: "0.9rem", color: flags.includes(f) ? "var(--neon-cyan)" : "var(--text-secondary)" }}>
                  <input
                    type="checkbox"
                    checked={flags.includes(f)}
                    onChange={() => handleFlagChange(f)}
                  />
                  <strong>{f}</strong>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn-secondary" onClick={loadSample}>
              Load Email Sample
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="status-panel error" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <span className="status-icon">⚠️</span>
          <div className="status-details">
            <span className="status-title">Regex Pattern Syntax Error</span>
            <span className="status-message" style={{ fontFamily: "var(--font-mono)" }}>{error}</span>
          </div>
        </div>
      )}

      <div className="workspace-grid">
        {/* Test Text Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Test Text Input</h2>
          </div>
          <div className="editor-wrapper">
            <textarea
              className="code-editor-textarea"
              placeholder="Type or paste matching text string here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ height: "250px", fontFamily: "var(--font-mono)", fontSize: "0.9rem", padding: "1rem", width: "100%", borderRadius: "6px" }}
            />
          </div>
        </div>

        {/* Visual Highlighting Results */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Visual Highlighting Matches</h2>
          </div>
          <div
            style={{
              height: "250px",
              background: "rgba(13, 17, 28, 0.4)",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              padding: "1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              color: "var(--text-primary)"
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml || "Matches will be highlighted in cyan..." }}
          />
        </div>
      </div>

      {matches.length > 0 && (
        <div className="pane" style={{ marginTop: "1.5rem" }}>
          <div className="pane-header">
            <h2 className="pane-title">Captured Matches ({matches.length})</h2>
          </div>
          <div style={{ padding: "1rem", maxHeight: "200px", overflowY: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              <div>Index</div>
              <div>Match Segment</div>
              <div>Capture Groups</div>
            </div>
            {matches.map((m, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.03)", padding: "0.5rem 0", fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>
                <div style={{ color: "var(--text-muted)" }}>{m.index}</div>
                <div style={{ color: "var(--neon-cyan)" }}>{m.match}</div>
                <div style={{ color: "var(--neon-purple)" }}>
                  {m.groups.length > 0 ? m.groups.map((g, gIdx) => `Group ${gIdx+1}: "${g}"`).join(", ") : "None"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
