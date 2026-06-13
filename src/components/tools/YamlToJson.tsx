"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function YamlToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // A robust client-side YAML to JSON parser
  const parseYaml = (yamlStr: string): any => {
    const lines = yamlStr.split("\n");
    const root: any = {};
    const stack: { indent: number; ref: any; key: string | number | null }[] = [{ indent: -1, ref: root, key: null }];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim() || line.trim().startsWith("#")) continue; // Skip comments and empty lines

      const indent = line.search(/\S/);
      const content = line.trim();

      // Determine parent based on stack indentation
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1];

      // Array Item
      if (content.startsWith("-")) {
        const itemVal = content.substring(1).trim();
        // Check if array exists in parent
        if (parent.key !== null) {
          const parentObj = stack[stack.length - 2].ref;
          if (!Array.isArray(parentObj[parent.key as any])) {
            parentObj[parent.key as any] = [];
          }
          const arr = parentObj[parent.key as any];

          if (itemVal.includes(":")) {
            // Array of Objects
            const colonIdx = itemVal.indexOf(":");
            const subKey = itemVal.substring(0, colonIdx).trim();
            const subVal = parseValue(itemVal.substring(colonIdx + 1).trim());
            const newObj = { [subKey]: subVal };
            arr.push(newObj);
            stack.push({ indent: indent + 2, ref: newObj, key: subKey });
          } else {
            // Simple array item
            arr.push(parseValue(itemVal));
          }
        }
      } else if (content.includes(":")) {
        // Key-Value pair
        const colonIdx = content.indexOf(":");
        const key = content.substring(0, colonIdx).trim();
        const rawVal = content.substring(colonIdx + 1).trim();

        const value = parseValue(rawVal);

        if (value === "" && rawVal === "") {
          // Object declaration (nested content follows)
          const newObj = {};
          if (Array.isArray(parent.ref)) {
            // Parent is an array of objects
            const lastItem = parent.ref[parent.ref.length - 1];
            if (lastItem && typeof lastItem === "object") {
              lastItem[key] = newObj;
            } else {
              parent.ref.push({ [key]: newObj });
            }
          } else {
            parent.ref[key] = newObj;
          }
          stack.push({ indent, ref: newObj, key });
        } else {
          // Plain value
          if (Array.isArray(parent.ref)) {
            const lastItem = parent.ref[parent.ref.length - 1];
            if (lastItem && typeof lastItem === "object") {
              lastItem[key] = value;
            } else {
              parent.ref.push({ [key]: value });
            }
          } else {
            parent.ref[key] = value;
          }
        }
      }
    }

    return root;
  };

  const parseValue = (val: string): any => {
    const clean = val.trim();
    if (!clean) return "";
    if (clean === "true") return true;
    if (clean === "false") return false;
    if (clean === "null") return null;
    if (!isNaN(Number(clean)) && clean !== "") return Number(clean);
    // Strip quotes if any
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      return clean.substring(1, clean.length - 1);
    }
    return clean;
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setError("Please input some YAML first.");
      setOutput("");
      return;
    }

    try {
      const parsed = parseYaml(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to convert YAML. Ensure indentation spaces are correct.");
      setOutput("");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    copyToClipboard(output).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const loadSample = () => {
    setInput(`server:\n  port: 8080\n  host: localhost\ndatabase:\n  enabled: true\n  pool: 10\n  credentials:\n    user: db_admin\n    pass: 'secret99'\ntags:\n  - api\n  - docker\n  - nextjs`);
    setError(null);
    setOutput("");
  };

  return (
    <div>
      <div className="control-bar">
        <div className="control-options">
          <button className="btn-secondary" onClick={loadSample}>
            Load Sample
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={() => { setInput(""); setOutput(""); setError(null); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleConvert}>
            Convert to JSON
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">YAML Code Input</h2>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="Paste YAML markup here..."
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(null); }}
                style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem" }}
              />
            </div>
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">JSON Object Output</h2>
            <div className="pane-actions">
              <button className="btn-icon" onClick={handleCopy} disabled={!output} title="Copy Output">
                📋
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <div className="code-editor-container">
              <textarea
                className="code-editor-textarea"
                placeholder="JSON output will appear here..."
                value={output}
                readOnly
                style={{ height: "300px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem" }}
              />
            </div>
            {copyFeedback && <span className="toast-feedback">Copied Output!</span>}
          </div>
        </div>
      </div>

      {error && (
        <div className="status-panel error" style={{ marginTop: "1.5rem" }}>
          <span className="status-icon">⚠️</span>
          <div className="status-details">
            <span className="status-title">Parsing Error</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
