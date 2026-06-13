"use client";

import { useState } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumA?: number;
  lineNumB?: number;
}

export default function DiffChecker() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [selectedLines, setSelectedLines] = useState<Record<number, boolean>>({});
  const [stats, setStats] = useState<{ added: number; removed: number } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Myers/LCS line diff algorithm
  const handleDiff = () => {
    const linesA = textA.split(/\r?\n/);
    const linesB = textB.split(/\r?\n/);

    const n = linesA.length;
    const m = linesB.length;

    // LCS DP Table
    const dp: number[][] = Array(n + 1)
      .fill(0)
      .map(() => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (linesA[i - 1] === linesB[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to assemble diffs
    const diffs: DiffLine[] = [];
    let i = n;
    let j = m;
    let addedCount = 0;
    let removedCount = 0;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
        diffs.unshift({
          type: "unchanged",
          content: linesA[i - 1],
          lineNumA: i,
          lineNumB: j,
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        diffs.unshift({
          type: "added",
          content: linesB[j - 1],
          lineNumB: j,
        });
        addedCount++;
        j--;
      } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
        diffs.unshift({
          type: "removed",
          content: linesA[i - 1],
          lineNumA: i,
        });
        removedCount++;
        i--;
      }
    }

    setDiff(diffs);
    setStats({
      added: addedCount,
      removed: removedCount,
    });

    // Initialize selection states
    const initialSelection: Record<number, boolean> = {};
    diffs.forEach((line, idx) => {
      if (line.type === "added" || line.type === "unchanged") {
        initialSelection[idx] = true; // Added (Text B) and Unchanged checked by default
      } else {
        initialSelection[idx] = false; // Removed (Text A) excluded by default
      }
    });
    setSelectedLines(initialSelection);
  };

  const handleToggleLine = (idx: number) => {
    setSelectedLines((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const getFinalFileContent = (): string => {
    return diff
      .filter((line, idx) => line.type === "unchanged" || selectedLines[idx])
      .map((line) => line.content)
      .join("\n");
  };

  const handleDownloadFinalFile = () => {
    const content = getFinalFileContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cherry_picked_output.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyFinalFile = () => {
    const content = getFinalFileContent();
    copyToClipboard(content).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const loadSample = () => {
    setTextA(`const user = {\n  name: "John Doe",\n  age: 30,\n  skills: ["JS", "React"],\n  active: false\n};`);
    setTextB(`const user = {\n  name: "John Smith",\n  age: 31,\n  skills: ["JS", "React", "TypeScript"],\n  active: true,\n  verified: true\n};`);
    setDiff([]);
    setStats(null);
    setSelectedLines({});
  };

  return (
    <div>
      <div className="control-bar">
        <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}>
          <button className="btn-secondary" onClick={loadSample}>
            Load Sample
          </button>
          <button className="btn-secondary" onClick={() => { setTextA(""); setTextB(""); setDiff([]); setStats(null); setSelectedLines({}); }}>
            Clear
          </button>
          <button className="btn-primary" onClick={handleDiff}>
            Compare Files
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        {/* original */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Original Text (A)</h2>
          </div>
          <div className="editor-wrapper">
            <textarea
              className="code-editor-textarea"
              placeholder="Paste original file or text block..."
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              style={{ height: "200px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "6px", width: "100%" }}
            />
          </div>
        </div>

        {/* modified */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Modified Text (B)</h2>
          </div>
          <div className="editor-wrapper">
            <textarea
              className="code-editor-textarea"
              placeholder="Paste modified file or text block..."
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              style={{ height: "200px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "6px", width: "100%" }}
            />
          </div>
        </div>
      </div>

      {stats && (
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1.2rem", fontSize: "0.85rem", fontWeight: 600 }}>
          <span style={{ color: "var(--success)" }}>🟢 {stats.added} Additions</span>
          <span style={{ color: "var(--error)" }}>🔴 {stats.removed} Deletions</span>
          <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>
            💡 Check/uncheck rows in the diff list below to cherry-pick which modifications to keep in the final file.
          </span>
        </div>
      )}

      {diff.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "1.5rem" }}>
          
          {/* Diff Output List with cherry-picking */}
          <div className="pane">
            <div className="pane-header">
              <h2 className="pane-title">Interactive Gutter Line Comparisons</h2>
            </div>
            <div
              style={{
                padding: "1rem",
                background: "rgba(13, 17, 28, 0.4)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                overflowX: "auto",
                maxHeight: "350px",
                overflowY: "auto",
                borderRadius: "6px",
                border: "1px solid var(--border-color)"
              }}
            >
              {diff.map((line, idx) => {
                const isAdded = line.type === "added";
                const isRemoved = line.type === "removed";
                const isSelected = selectedLines[idx];
                
                let bg = "transparent";
                let color = "var(--text-secondary)";
                let prefix = " ";

                if (isAdded) {
                  bg = isSelected ? "rgba(16, 185, 129, 0.08)" : "rgba(255,255,255,0.01)";
                  color = isSelected ? "#a7f3d0" : "var(--text-muted)";
                  prefix = "+";
                } else if (isRemoved) {
                  bg = isSelected ? "rgba(239, 68, 68, 0.08)" : "transparent";
                  color = isSelected ? "#fca5a5" : "var(--text-muted)";
                  prefix = "-";
                }

                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: bg,
                      color: color,
                      padding: "0.2rem 0.5rem",
                      display: "flex",
                      borderRadius: "2px",
                      borderLeft: isAdded && isSelected ? "3px solid var(--success)" : isRemoved && isSelected ? "3px solid var(--error)" : "3px solid transparent",
                      alignItems: "center"
                    }}
                  >
                    {/* Cherry pick checkbox */}
                    <span style={{ width: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isAdded || isRemoved ? (
                        <input
                          type="checkbox"
                          checked={isSelected || false}
                          onChange={() => handleToggleLine(idx)}
                          style={{ cursor: "pointer", width: "13px", height: "13px" }}
                          title={isAdded ? "Include added line" : "Restore removed line"}
                        />
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", userSelect: "none" }}>✓</span>
                      )}
                    </span>
                    <span style={{ width: "40px", color: "var(--text-muted)", userSelect: "none", marginLeft: "0.5rem" }}>{line.lineNumA || ""}</span>
                    <span style={{ width: "40px", color: "var(--text-muted)", userSelect: "none" }}>{line.lineNumB || ""}</span>
                    <span style={{ width: "20px", color: "var(--text-muted)", userSelect: "none" }}>{prefix}</span>
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit", color: "inherit" }}>
                      {line.content}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final Cherry Picked File Output */}
          <div className="pane">
            <div className="pane-header">
              <h2 className="pane-title">Cherry-Picked Final Output File</h2>
              <div className="pane-actions">
                <button className="btn-secondary" onClick={handleDownloadFinalFile} disabled={diff.length === 0}>
                  Download Merged File 💾
                </button>
                <button className="btn-icon" onClick={handleCopyFinalFile} disabled={diff.length === 0} title="Copy Merged">
                  📋
                </button>
              </div>
            </div>
            <div className="editor-wrapper">
              <textarea
                className="code-editor-textarea"
                value={getFinalFileContent()}
                readOnly
                placeholder="Final cherry-picked outputs will appear here..."
                style={{
                  height: "220px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  padding: "1rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "6px",
                  width: "100%"
                }}
              />
              {copyFeedback && <span className="toast-feedback">Copied final file!</span>}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
