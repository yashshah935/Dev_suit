"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function UuidGenerator() {
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const generateUuidV4 = (): string => {
    let uuid = crypto.randomUUID();
    if (noHyphens) {
      uuid = uuid.replace(/-/g, "");
    }
    return uppercase ? uuid.toUpperCase() : uuid.toLowerCase();
  };

  const handleGenerate = () => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      list.push(generateUuidV4());
    }
    setUuids(list);
  };

  const handleCopy = () => {
    if (uuids.length === 0) return;
    copyToClipboard(uuids.join("\n")).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  return (
    <div>
      <div className="control-bar" style={{ flexWrap: "wrap", gap: "1.2rem", padding: "1.2rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          
          {/* Quantity */}
          <div className="option-group">
            <span className="option-label">Quantity:</span>
            <select
              className="select-custom"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            >
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {/* Capitalization */}
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
            />
            Uppercase (A-F)
          </label>

          {/* Hyphens */}
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={noHyphens}
              onChange={(e) => setNoHyphens(e.target.checked)}
            />
            Strip Hyphens
          </label>
        </div>

        <button className="btn-primary" onClick={handleGenerate}>
          Generate UUIDs
        </button>
      </div>

      <div className="pane" style={{ marginTop: "1.5rem" }}>
        <div className="pane-header">
          <h2 className="pane-title">Generated Identifiers ({uuids.length})</h2>
          <div className="pane-actions">
            <button className="btn-icon" onClick={handleCopy} disabled={uuids.length === 0} title="Copy All">
              📋
            </button>
          </div>
        </div>
        <div className="editor-wrapper">
          <textarea
            className="code-editor-textarea"
            placeholder="Click Generate UUIDs to create high-entropy keys..."
            value={uuids.join("\n")}
            readOnly
            style={{
              height: "250px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              padding: "1rem",
              borderRadius: "6px",
              width: "100%"
            }}
          />
          {copyFeedback && <span className="toast-feedback">Copied All UUIDs!</span>}
        </div>
      </div>
    </div>
  );
}
