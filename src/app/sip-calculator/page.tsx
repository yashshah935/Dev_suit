"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface YearBreakdown {
  year: number;
  totalInvestment: number;
  futureValue: number;
  realFutureValue: number;
  wealthGained: number;
}

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [inflation, setInflation] = useState<number>(6);
  const [currency, setCurrency] = useState("INR");
  
  const [summary, setSummary] = useState({
    investedAmount: 0,
    futureValue: 0,
    realFutureValue: 0,
    wealthGained: 0,
  });
  
  const [breakdown, setBreakdown] = useState<YearBreakdown[]>([]);

  useEffect(() => {
    // Calculations
    const monthlyRate = expectedReturn / 12 / 100;
    const months = years * 12;
    const investedAmount = monthlyInvestment * months;

    // Standard SIP Future Value: P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
    let futureValue = 0;
    if (monthlyRate === 0) {
      futureValue = investedAmount;
    } else {
      futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    }

    // Real Return Rate adjusted for inflation: realRate = ((1 + returnRate) / (1 + inflationRate) - 1)
    const realAnnualRate = ((1 + expectedReturn / 100) / (1 + inflation / 100) - 1) * 100;
    const realMonthlyRate = realAnnualRate / 12 / 100;

    let realFutureValue = 0;
    if (realMonthlyRate === 0) {
      realFutureValue = investedAmount;
    } else {
      realFutureValue = monthlyInvestment * ((Math.pow(1 + realMonthlyRate, months) - 1) / realMonthlyRate) * (1 + realMonthlyRate);
    }

    const wealthGained = Math.max(0, futureValue - investedAmount);

    setSummary({
      investedAmount,
      futureValue,
      realFutureValue,
      wealthGained,
    });

    // Generate year-by-year breakdown
    const list: YearBreakdown[] = [];
    for (let y = 1; y <= years; y++) {
      const yMonths = y * 12;
      const yInvested = monthlyInvestment * yMonths;
      
      let yFV = 0;
      if (monthlyRate === 0) {
        yFV = yInvested;
      } else {
        yFV = monthlyInvestment * ((Math.pow(1 + monthlyRate, yMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      }

      let yRealFV = 0;
      if (realMonthlyRate === 0) {
        yRealFV = yInvested;
      } else {
        yRealFV = monthlyInvestment * ((Math.pow(1 + realMonthlyRate, yMonths) - 1) / realMonthlyRate) * (1 + realMonthlyRate);
      }

      list.push({
        year: y,
        totalInvestment: yInvested,
        futureValue: yFV,
        realFutureValue: yRealFV,
        wealthGained: Math.max(0, yFV - yInvested),
      });
    }
    setBreakdown(list);
  }, [monthlyInvestment, expectedReturn, years, inflation]);

  const formatCurrency = (val: number) => {
    let locale = "en-IN";
    let currSymbol = "INR";
    
    if (currency === "USD") {
      locale = "en-US";
      currSymbol = "USD";
    } else if (currency === "EUR") {
      locale = "de-DE";
      currSymbol = "EUR";
    } else if (currency === "GBP") {
      locale = "en-GB";
      currSymbol = "GBP";
    }
    
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currSymbol,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>📈</span> SIP Calculator (Inflation-Adjusted)
          </h1>
          <p className="workspace-desc">
            Calculate your Systemic Investment Plan growth and see what your returns will be worth in today's money.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      {/* Control Bar (Now at the top) */}
      <div className="control-bar">
        <div className="control-options">
          <div className="option-group">
            <span className="option-label">Currency Symbol:</span>
            <select
              className="select-custom"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
          📊 Inflation Adjusted Projections
        </span>
      </div>

      <div className="workspace-grid" style={{ gridTemplateColumns: "1fr 1.5fr" }}>
        {/* Left Side: Inputs */}
        <div className="pane">
          <h2 className="pane-title" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
            Calculator Inputs
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "0.5rem" }}>
            {/* Monthly Investment */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="option-label">Monthly Investment</span>
                <span style={{ fontWeight: 600, color: "var(--neon-cyan)" }}>
                  {formatCurrency(monthlyInvestment)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="200000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                style={{ accentColor: "var(--neon-cyan)", cursor: "pointer" }}
              />
              <input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Math.max(0, Number(e.target.value)))}
                className="select-custom"
                style={{ width: "100%", padding: "0.4rem" }}
              />
            </div>

            {/* Expected Returns */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="option-label">Expected Return Rate (p.a.)</span>
                <span style={{ fontWeight: 600, color: "var(--neon-cyan)" }}>
                  {expectedReturn}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                style={{ accentColor: "var(--neon-cyan)", cursor: "pointer" }}
              />
            </div>

            {/* Duration */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="option-label">Time Period</span>
                <span style={{ fontWeight: 600, color: "var(--neon-cyan)" }}>
                  {years} Years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                style={{ accentColor: "var(--neon-cyan)", cursor: "pointer" }}
              />
            </div>

            {/* Inflation Rate */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="option-label">Expected Inflation Rate (p.a.)</span>
                <span style={{ fontWeight: 600, color: "var(--neon-pink)" }}>
                  {inflation}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                style={{ accentColor: "var(--neon-pink)", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Results Dashboard */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Result Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="pane" style={{ padding: "1.25rem", borderLeft: "4px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Total Invested</span>
              <span style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0.25rem 0", color: "#e2e8f0" }}>
                {formatCurrency(summary.investedAmount)}
              </span>
            </div>

            <div className="pane" style={{ padding: "1.25rem", borderLeft: "4px solid var(--success)" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Est. Wealth Gained</span>
              <span style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0.25rem 0", color: "var(--success)" }}>
                {formatCurrency(summary.wealthGained)}
              </span>
            </div>

            <div className="pane" style={{ padding: "1.25rem", borderLeft: "4px solid var(--neon-cyan)" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Future Value (Nominal)</span>
              <span style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0.25rem 0", color: "var(--neon-cyan)" }}>
                {formatCurrency(summary.futureValue)}
              </span>
            </div>

            <div className="pane" style={{ padding: "1.25rem", borderLeft: "4px solid var(--neon-pink)", background: "rgba(255, 94, 98, 0.03)" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Future Value (Real / Adjusted)</span>
              <span style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0.25rem 0", color: "var(--neon-pink)" }}>
                {formatCurrency(summary.realFutureValue)}
              </span>
            </div>
          </div>

          {/* Quick Explanation */}
          <div className="status-panel success" style={{ background: "rgba(255,255,255,0.02)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
            <span style={{ fontSize: "1.2rem" }}>ℹ️</span>
            <div>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Inflation Impact</span>
              <p style={{ fontSize: "0.8rem", marginTop: "0.2rem" }}>
                At {inflation}% annual inflation, your future wealth of {formatCurrency(summary.futureValue)} will have the buying power of {formatCurrency(summary.realFutureValue)} in today's currency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Breakdown Table */}
      <div className="pane" style={{ marginTop: "1rem" }}>
        <h2 className="pane-title" style={{ marginBottom: "1rem" }}>Year-by-Year Growth Timeline</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "0.75rem" }}>Year</th>
                <th style={{ padding: "0.75rem" }}>Total Investment</th>
                <th style={{ padding: "0.75rem" }}>Wealth Gained</th>
                <th style={{ padding: "0.75rem" }}>Future Value (Nominal)</th>
                <th style={{ padding: "0.75rem", color: "var(--neon-pink)" }}>Future Value (Inflation-Adjusted)</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row) => (
                <tr key={row.year} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s" }} className="table-row-hover">
                  <td style={{ padding: "0.75rem", fontWeight: 600 }}>Year {row.year}</td>
                  <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>{formatCurrency(row.totalInvestment)}</td>
                  <td style={{ padding: "0.75rem", color: "var(--success)" }}>{formatCurrency(row.wealthGained)}</td>
                  <td style={{ padding: "0.75rem", fontWeight: 500 }}>{formatCurrency(row.futureValue)}</td>
                  <td style={{ padding: "0.75rem", fontWeight: 600, color: "var(--neon-pink)" }}>{formatCurrency(row.realFutureValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
