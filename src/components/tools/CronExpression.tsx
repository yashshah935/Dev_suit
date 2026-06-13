"use client";

import { useState, useEffect } from "react";
import { copyToClipboard } from "../../app/utils/clipboard";

export default function CronExpression() {
  const [cron, setCron] = useState("*/15 9-17 * * 1-5");
  const [humanReadable, setHumanReadable] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Generator selector states
  const [preset, setPreset] = useState("every-15-min");

  const parseCronField = (field: string, type: "min" | "hour" | "dom" | "month" | "dow"): string => {
    if (field === "*") {
      switch (type) {
        case "min": return "every minute";
        case "hour": return "every hour";
        case "dom": return "every day";
        case "month": return "every month";
        case "dow": return "every day of the week";
      }
    }

    if (field.includes("/")) {
      const [start, step] = field.split("/");
      const stepVal = parseInt(step, 10);
      const startText = start === "*" ? "starting from 0" : `starting at ${start}`;
      
      switch (type) {
        case "min": return `every ${stepVal} minutes`;
        case "hour": return `every ${stepVal} hours`;
        case "dom": return `every ${stepVal} days`;
        case "month": return `every ${stepVal} months`;
        case "dow": return `every ${stepVal} days of the week`;
      }
    }

    if (field.includes("-")) {
      const [start, end] = field.split("-");
      switch (type) {
        case "min": return `minutes ${start} through ${end}`;
        case "hour": return `hours ${start} through ${end}`;
        case "dom": return `days ${start} through ${end}`;
        case "month": return `months ${start} through ${end}`;
        case "dow": return `days ${start} through ${end}`;
      }
    }

    if (field.includes(",")) {
      return `at values: ${field}`;
    }

    // Single value
    switch (type) {
      case "min": return `at minute ${field}`;
      case "hour": return `at hour ${field}`;
      case "dom": return `on day ${field}`;
      case "month": return `in month ${field}`;
      case "dow": {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const val = parseInt(field, 10);
        return `on ${days[val] || field}`;
      }
    }
  };

  const translateCron = (cronStr: string) => {
    const fields = cronStr.trim().split(/\s+/);
    if (fields.length !== 5) {
      throw new Error("Cron expression must contain exactly 5 fields (Minute Hour Day-of-Month Month Day-of-Week).");
    }

    const [min, hr, dom, mon, dow] = fields;
    
    // Verify numeric values in general
    fields.forEach((f) => {
      if (/[^\d*,/\-]/g.test(f)) {
        throw new Error(`Invalid characters in field: "${f}"`);
      }
    });

    const minText = parseCronField(min, "min");
    const hrText = parseCronField(hr, "hour");
    const domText = parseCronField(dom, "dom");
    const monText = parseCronField(mon, "month");
    const dowText = parseCronField(dow, "dow");

    return `${minText} during ${hrText}, ${domText}, ${monText}, ${dowText}.`.replace(/\s+/g, " ");
  };

  const matchField = (val: number, field: string): boolean => {
    if (field === "*") return true;
    if (field.includes("/")) {
      const [left, right] = field.split("/");
      const step = parseInt(right, 10);
      if (left === "*") {
        return val % step === 0;
      }
      const start = parseInt(left, 10);
      return val >= start && (val - start) % step === 0;
    }
    if (field.includes("-")) {
      const [start, end] = field.split("-").map(Number);
      return val >= start && val <= end;
    }
    if (field.includes(",")) {
      return field.split(",").map(Number).includes(val);
    }
    return parseInt(field, 10) === val;
  };

  const calculateNextRuns = (cronStr: string) => {
    const parts = cronStr.trim().split(/\s+/);
    if (parts.length !== 5) return;

    const [minStr, hourStr, domStr, monthStr, dowStr] = parts;
    const runs: string[] = [];
    const current = new Date();
    current.setSeconds(0);
    current.setMilliseconds(0);

    let limit = 0;
    while (runs.length < 5 && limit < 15000) {
      current.setMinutes(current.getMinutes() + 1);
      limit++;

      if (
        matchField(current.getMinutes(), minStr) &&
        matchField(current.getHours(), hourStr) &&
        matchField(current.getDate(), domStr) &&
        matchField(current.getMonth() + 1, monthStr) &&
        matchField(current.getDay(), dowStr)
      ) {
        runs.push(current.toLocaleString());
      }
    }
    setNextRuns(runs);
  };

  useEffect(() => {
    try {
      const text = translateCron(cron);
      setHumanReadable(text);
      calculateNextRuns(cron);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid CRON expression syntax.");
      setHumanReadable("");
      setNextRuns([]);
    }
  }, [cron]);

  const handlePresetChange = (val: string) => {
    setPreset(val);
    switch (val) {
      case "every-min":
        setCron("* * * * *");
        break;
      case "every-15-min":
        setCron("*/15 * * * *");
        break;
      case "daily-3am":
        setCron("0 3 * * *");
        break;
      case "weekly-sun":
        setCron("0 0 * * 0");
        break;
      case "monthly-1st":
        setCron("0 0 1 * *");
        break;
      case "work-hours":
        setCron("*/15 9-17 * * 1-5");
        break;
    }
  };

  const handleCopy = () => {
    copyToClipboard(cron).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  return (
    <div>
      <div className="control-bar" style={{ flexWrap: "wrap", gap: "1rem", padding: "1.2rem" }}>
        
        {/* Preset Selector */}
        <div className="option-group">
          <span className="option-label">Expression Presets:</span>
          <select
            className="select-custom"
            value={preset}
            onChange={(e) => handlePresetChange(e.target.value)}
          >
            <option value="every-min">Every Minute (* * * * *)</option>
            <option value="every-15-min">Every 15 Minutes (*/15 * * * *)</option>
            <option value="daily-3am">Daily at 3:00 AM (0 3 * * *)</option>
            <option value="weekly-sun">Weekly on Sunday (0 0 * * 0)</option>
            <option value="monthly-1st">Monthly on the 1st (0 0 1 * *)</option>
            <option value="work-hours">Office Hours 15-min interval (*/15 9-17 * * 1-5)</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}>
          <button className="btn-secondary" onClick={() => setCron("* * * * *")}>
            Reset
          </button>
          <button className="btn-primary" onClick={handleCopy}>
            Copy Expression
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div className="pane" style={{ padding: "1.5rem" }}>
          <span className="option-label" style={{ display: "block", marginBottom: "0.5rem" }}>CRON Expression (5-Field String):</span>
          <input
            type="text"
            className="select-custom"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: "1.1rem", padding: "0.75rem 1rem", textAlign: "center" }}
            placeholder="* * * * *"
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem", marginTop: "0.5rem", textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            <div>Minute (0-59)</div>
            <div>Hour (0-23)</div>
            <div>Day of Month (1-31)</div>
            <div>Month (1-12)</div>
            <div>Day of Week (0-6)</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="status-panel error" style={{ marginBottom: "1.5rem" }}>
          <span className="status-icon">⚠️</span>
          <div className="status-details">
            <span className="status-title">Syntax Validation Failed</span>
            <span className="status-message">{error}</span>
          </div>
        </div>
      )}

      {copyFeedback && <span className="toast-feedback">Copied Cron String!</span>}

      <div className="workspace-grid">
        {/* Human Translation */}
        <div className="pane">
          <div className="pane-header" style={{ borderLeft: "3px solid var(--neon-cyan)" }}>
            <h2 className="pane-title" style={{ color: "var(--neon-cyan)" }}>Human English Translation</h2>
          </div>
          <div style={{ padding: "1.5rem", height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {humanReadable ? (
              <p style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", textAlign: "center", textTransform: "capitalize", lineHeight: "1.6" }}>
                📢 "{humanReadable}"
              </p>
            ) : (
              <span style={{ color: "var(--text-muted)" }}>Input valid CRON query...</span>
            )}
          </div>
        </div>

        {/* Next 5 Execution times */}
        <div className="pane">
          <div className="pane-header" style={{ borderLeft: "3px solid var(--neon-purple)" }}>
            <h2 className="pane-title" style={{ color: "var(--neon-purple)" }}>Next 5 Execution Dates (Local Time)</h2>
          </div>
          <div style={{ padding: "1rem 1.5rem", height: "200px", overflowY: "auto" }}>
            {nextRuns.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {nextRuns.map((run, idx) => (
                  <li key={idx} style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", borderBottom: "1px solid rgba(255,255,255,0.02)", paddingBottom: "0.4rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--neon-purple)", marginRight: "1rem" }}>▶ Run {idx + 1}:</span>
                    {run}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                No matching execution dates found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
