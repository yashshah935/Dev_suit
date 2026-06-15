"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Read preference on mount
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.add("light-theme");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn-theme-toggle"
      aria-label="Toggle light/dark theme"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid var(--border-color)",
        color: "var(--text-primary)",
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "1.1rem",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "var(--shadow-glass)",
        userSelect: "none"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        e.currentTarget.style.borderColor = "var(--neon-cyan)";
        e.currentTarget.style.boxShadow = "var(--shadow-neon)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
        e.currentTarget.style.borderColor = "var(--border-color)";
        e.currentTarget.style.boxShadow = "var(--shadow-glass)";
      }}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
