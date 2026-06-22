"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function TextToSpeech() {
  const [speakText, setSpeakText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load voices for Speech Synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoiceName) {
          // Select default or first english voice
          const defaultVoice = availableVoices.find(v => v.lang.startsWith("en")) || availableVoices[0];
          setSelectedVoiceName(defaultVoice.name);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceName]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speech Synthesis Controls
  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    if (!speakText.trim()) return;

    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(speakText);
    const selectedVoice = voices.find(v => v.name === selectedVoiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    setIsSpeaking(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const loadSpeechSample = () => {
    setSpeakText(
      "Welcome to DevSuite voice synthesizer. You can configure different system voices, speed, and pitch levels. Have a great day!"
    );
  };

  const handleDownload = async () => {
    if (!speakText.trim()) return;

    setIsDownloading(true);
    try {
      const selectedVoice = voices.find(v => v.name === selectedVoiceName);
      const lang = selectedVoice ? selectedVoice.lang.toLowerCase().replace("_", "-") : "en";

      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: speakText,
          lang,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate MP3");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "synthesized-speech.mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Error generating MP3 file.");
    } finally {
      setIsDownloading(false);
    }
  };

  // SEO Data
  const faqs = [
    {
      q: "How does the Text to Speech tool work?",
      a: "This tool uses the browser Speech Synthesis interface of the Web Speech API. It reads the raw text input, binds it with the selected system vocal model and parameters (speed, pitch), and narrates it directly through your system's default audio output channel."
    },
    {
      q: "Why are some voices missing?",
      a: "The available voices depend on your operating system, device, and web browser. Mobile devices and desktop platforms have different sets of pre-installed speech synthesizer models."
    },
    {
      q: "Does it support custom speech rates?",
      a: "Yes! You can adjust the speed multiplier slider from 0.5x (slow) up to 2x (fast) to fit your auditory preferences."
    }
  ];

  const useCases = [
    {
      title: "Audio Narration Mockups",
      desc: "Instantly vocalize paragraphs, copy, or scripts to preview auditory pacing and phrasing before recording professional voiceovers."
    },
    {
      title: "Proofreading & Reading Aid",
      desc: "Listen to written articles, documentation, or code comments read aloud to identify grammatical mistakes or structural bugs."
    }
  ];

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Text to Speech Online | DevSuite",
    "url": "https://dev-suit.vercel.app/tools/text-to-speech",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5. Requires Audio system support.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Convert typed paragraphs into speech narration instantly. Configure system voice models, speed rates, pitch, with dynamic visual waveform indicators."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="workspace">
      {/* Schema Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>🗣️</span> Text to Speech
          </h1>
          <p className="workspace-desc">
            Transform typed paragraphs into spoken audio narration instantly using browser speech synthesis tools.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      {/* Control Bar */}
      <div className="control-bar">
        <div className="control-options">
          <span className="option-label" style={{ color: "var(--neon-cyan)" }}>
            ⚡ Client-Side Web Speech Synthesis
          </span>
        </div>
        <Link href="/tools/speech-to-text" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
          Switch to Speech to Text &rarr;
        </Link>
      </div>

      <div className="workspace-grid tts-grid">
        {/* Input Text Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Input Text (Paragraphs)</h2>
            <div className="pane-actions">
              <button
                className="btn-secondary"
                style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
                onClick={loadSpeechSample}
              >
                Load Sample
              </button>
              <button className="btn-icon" onClick={() => setSpeakText("")} title="Clear text">
                🗑️
              </button>
            </div>
          </div>

          <div className="editor-wrapper" style={{ minHeight: "300px" }}>
            <textarea
              className="editor-textarea"
              placeholder="Type or paste paragraphs here to listen to them..."
              value={speakText}
              onChange={(e) => setSpeakText(e.target.value)}
              style={{ minHeight: "300px" }}
            />
          </div>
        </div>

        {/* Configuration Pane */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="pane">
            <h2 className="pane-title" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
              Voice Settings
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "0.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span className="option-label">System Voice:</span>
                <select
                  className="select-custom"
                  style={{ width: "100%" }}
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="option-label">Speed (Rate)</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--neon-cyan)", fontWeight: 600 }}>{speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(Number(e.target.value))}
                  style={{ accentColor: "var(--neon-cyan)", cursor: "pointer" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="option-label">Pitch</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--neon-cyan)", fontWeight: 600 }}>{speechPitch}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(Number(e.target.value))}
                  style={{ accentColor: "var(--neon-cyan)", cursor: "pointer" }}
                />
              </div>
            </div>

            {/* Speak Triggers */}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
              {isSpeaking ? (
                <>
                  <button className="btn-secondary" onClick={handlePause}>
                    ⏸️ Pause
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleStopSpeech}
                    style={{ background: "var(--danger-grad)", border: "none", color: "#fff" }}
                  >
                    ⏹️ Stop
                  </button>
                </>
              ) : (
                <button className="btn-primary" onClick={handleSpeak} disabled={!speakText.trim()} style={{ width: "100%", justifyContent: "center" }}>
                  🔊 {isPaused ? "Resume" : "Speak Text"}
                </button>
              )}
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              <button
                className="btn-secondary"
                onClick={handleDownload}
                disabled={!speakText.trim() || isDownloading}
                style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {isDownloading ? "⏳ Generating MP3..." : "📥 Download MP3"}
              </button>
            </div>

            {/* Waveform Visualization */}
            {isSpeaking && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "3px", height: "20px", marginTop: "1rem" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
                  <div
                    key={bar}
                    style={{
                      width: "3px",
                      height: "100%",
                      background: "var(--primary-grad)",
                      borderRadius: "3px",
                      animation: `waveBounce ${0.3 + bar * 0.08}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <section className="seo-section">
        <div>
          <h2 className="seo-title">About Text to Speech Generators</h2>
          <p className="seo-subtitle">How converting typed letters into audio narrations helps content readability.</p>
        </div>

        <div className="seo-grid">
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Practical Use Cases
            </h3>
            <div className="use-cases-list">
              {useCases.map((uc, idx) => (
                <div key={idx} className="use-case-card">
                  <div className="use-case-title">
                    <span>🗣️</span> {uc.title}
                  </div>
                  <p className="use-case-desc">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Frequently Asked Questions
            </h3>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      {openFaq === idx ? "▲" : "▼"}
                    </span>
                  </button>
                  {openFaq === idx && <div className="faq-answer">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Related Developer Tools & Guides
          </h3>
          <div className="related-links-grid">
            <Link href="/tools/speech-to-text" className="related-link-card">
              <span>Speech to Text Tool</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/tools/json-formatter" className="related-link-card">
              <span>JSON Formatter & Validator</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes waveBounce {
          0% { height: 4px; }
          100% { height: 18px; }
        }
      `}</style>
    </div>
  );
}
