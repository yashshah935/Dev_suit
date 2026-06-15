"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const FEATURED_TOOLS = [
  { name: "JSON Formatter & Validator", path: "/tools/json-formatter", icon: "🗂️" },
  { name: "Interactive Diff Checker", path: "/tools/diff-checker", icon: "⚖️" },
  { name: "JWT Token Decoder", path: "/tools/jwt-decoder", icon: "🔐" },
  { name: "YAML to JSON Converter", path: "/tools/yaml-to-json", icon: "🔌" },
  { name: "Version 4 UUID Generator", path: "/tools/uuid-generator", icon: "🔑" },
  { name: "QR Code Generator", path: "/tools/qr-generator", icon: "📱" },
  { name: "CRON Expression Translator", path: "/tools/cron-expression", icon: "⏰" },
];

export default function TypingCarousel() {
  const [toolIndex, setToolIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentTool = FEATURED_TOOLS[toolIndex];
    const fullText = `${currentTool.icon} ${currentTool.name}`;

    const handleType = () => {
      if (!isDeleting) {
        // Typing
        setDisplayText(fullText.substring(0, displayText.length + 1));
        setTypingSpeed(100);

        if (displayText === fullText) {
          // Pause before deleting
          setTypingSpeed(2500);
          setIsDeleting(true);
        }
      } else {
        // Deleting
        setDisplayText(fullText.substring(0, displayText.length - 1));
        setTypingSpeed(50);

        if (displayText === "") {
          setIsDeleting(false);
          setToolIndex((prev) => (prev + 1) % FEATURED_TOOLS.length);
          setTypingSpeed(500);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, toolIndex, typingSpeed]);

  const currentTool = FEATURED_TOOLS[toolIndex];

  return (
    <div
      className="typing-carousel-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "0.5rem",
        marginBottom: "1.5rem",
        fontSize: "1.15rem",
        fontWeight: 500,
        color: "var(--text-secondary)",
        minHeight: "2.5rem",
        userSelect: "none",
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
        textAlign: "left"
      }}
    >
      <span>💡 Try out:</span>
      <Link
        href={currentTool.path}
        style={{
          color: "var(--neon-cyan)",
          textDecoration: "none",
          fontWeight: 600,
          borderBottom: "1px dashed var(--neon-cyan)",
          paddingBottom: "1px",
          transition: "all 0.2s ease-in-out",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = "var(--neon-purple)";
          e.currentTarget.style.borderBottomColor = "var(--neon-purple)";
          e.currentTarget.style.textShadow = "0 0 8px rgba(177, 92, 255, 0.4)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = "var(--neon-cyan)";
          e.currentTarget.style.borderBottomColor = "var(--neon-cyan)";
          e.currentTarget.style.textShadow = "none";
        }}
      >
        {displayText}
      </Link>
      <span className="typing-cursor">|</span>
    </div>
  );
}
