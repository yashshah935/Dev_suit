"use client";

import { useState, useEffect } from "react";

export default function TimestampConverter() {
  // Epoch to Date states
  const [epochInput, setEpochInput] = useState("");
  const [epochUnit, setEpochUnit] = useState("s"); // 's' or 'ms'
  const [dateResults, setDateResults] = useState<{ utc: string; local: string; iso: string } | null>(null);
  const [epochError, setEpochError] = useState<string | null>(null);

  // Date to Epoch states
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");
  const [second, setSecond] = useState("00");
  const [epochResult, setEpochResult] = useState<{ s: number; ms: number } | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  // Set current time values as placeholder/default
  useEffect(() => {
    const now = new Date();
    setEpochInput(Math.floor(now.getTime() / 1000).toString());
    setYear(now.getFullYear().toString());
    setMonth((now.getMonth() + 1).toString().padStart(2, "0"));
    setDay(now.getDate().toString().padStart(2, "0"));
  }, []);

  const handleEpochConvert = () => {
    if (!epochInput.trim()) {
      setEpochError("Please input an epoch timestamp.");
      setDateResults(null);
      return;
    }

    const val = Number(epochInput.trim());
    if (isNaN(val)) {
      setEpochError("Timestamp must be a valid number.");
      setDateResults(null);
      return;
    }

    try {
      const ms = epochUnit === "s" ? val * 1000 : val;
      const date = new Date(ms);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid epoch timestamp value.");
      }

      setDateResults({
        utc: date.toUTCString(),
        local: date.toString(),
        iso: date.toISOString()
      });
      setEpochError(null);
    } catch (err: any) {
      setEpochError(err.message || "Failed to convert epoch timestamp.");
      setDateResults(null);
    }
  };

  const handleDateConvert = () => {
    if (!year || !month || !day) {
      setDateError("Please enter Year, Month, and Day.");
      setEpochResult(null);
      return;
    }

    try {
      const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
      const date = new Date(dateStr);

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date parameters entered.");
      }

      const ms = date.getTime();
      setEpochResult({
        s: Math.floor(ms / 1000),
        ms: ms
      });
      setDateError(null);
    } catch (err: any) {
      setDateError(err.message || "Failed to parse date string.");
      setEpochResult(null);
    }
  };

  const loadCurrentTime = () => {
    const now = Date.now();
    setEpochInput(epochUnit === "s" ? Math.floor(now / 1000).toString() : now.toString());
    handleEpochConvert();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Epoch to Human Date */}
      <div className="pane">
        <div className="pane-header" style={{ borderLeft: "3px solid var(--neon-cyan)" }}>
          <h2 className="pane-title">Epoch Timestamp &rarr; Human Readable Date</h2>
        </div>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Epoch Timestamp:</span>
              <input
                type="text"
                className="select-custom"
                value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)}
                placeholder="e.g. 1780896754..."
                style={{ width: "100%", fontFamily: "var(--font-mono)" }}
              />
            </div>
            <div>
              <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Unit:</span>
              <select
                className="select-custom"
                value={epochUnit}
                onChange={(e) => setEpochUnit(e.target.value)}
              >
                <option value="s">Seconds (s)</option>
                <option value="ms">Milliseconds (ms)</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-secondary" onClick={loadCurrentTime}>
                Current Time
              </button>
              <button className="btn-primary" onClick={handleEpochConvert}>
                Convert
              </button>
            </div>
          </div>

          {epochError && (
            <div className="status-panel error" style={{ margin: "1rem 0" }}>
              <span className="status-icon">⚠️</span>
              <span className="status-message">{epochError}</span>
            </div>
          )}

          {dateResults && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "var(--bg-nav-hover)", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>ISO 8601:</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--neon-cyan)" }}>{dateResults.iso}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>UTC Time:</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{dateResults.utc}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Local Time:</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", textAlign: "right" }}>{dateResults.local}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Human Date to Epoch */}
      <div className="pane">
        <div className="pane-header" style={{ borderLeft: "3px solid var(--neon-purple)" }}>
          <h2 className="pane-title">Human Readable Date &rarr; Epoch Timestamp</h2>
        </div>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Year:</span>
              <input type="text" className="select-custom" style={{ width: "100%", textAlign: "center" }} value={year} onChange={(e) => setYear(e.target.value)} placeholder="YYYY" />
            </div>
            <div>
              <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Month:</span>
              <input type="text" className="select-custom" style={{ width: "100%", textAlign: "center" }} value={month} onChange={(e) => setMonth(e.target.value)} placeholder="MM" />
            </div>
            <div>
              <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Day:</span>
              <input type="text" className="select-custom" style={{ width: "100%", textAlign: "center" }} value={day} onChange={(e) => setDay(e.target.value)} placeholder="DD" />
            </div>
            <div>
              <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Hr (24h):</span>
              <input type="text" className="select-custom" style={{ width: "100%", textAlign: "center" }} value={hour} onChange={(e) => setHour(e.target.value)} />
            </div>
            <div>
              <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Min:</span>
              <input type="text" className="select-custom" style={{ width: "100%", textAlign: "center" }} value={minute} onChange={(e) => setMinute(e.target.value)} />
            </div>
            <div>
              <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>Sec:</span>
              <input type="text" className="select-custom" style={{ width: "100%", textAlign: "center" }} value={second} onChange={(e) => setSecond(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
            <button className="btn-primary" onClick={handleDateConvert}>
              Generate Epoch
            </button>
          </div>

          {dateError && (
            <div className="status-panel error" style={{ margin: "1rem 0" }}>
              <span className="status-icon">⚠️</span>
              <span className="status-message">{dateError}</span>
            </div>
          )}

          {epochResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "var(--bg-nav-hover)", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Seconds (s):</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--neon-purple)", fontSize: "1.05rem" }}>{epochResult.s}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Milliseconds (ms):</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{epochResult.ms}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
