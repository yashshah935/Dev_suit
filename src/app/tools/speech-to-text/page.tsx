"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { copyToClipboard } from "../../utils/clipboard";

export default function SpeechToText() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognitionLang, setRecognitionLang] = useState("en-US");
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionError("Web Speech API (Speech Recognition) is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = recognitionLang;

      recognition.onstart = () => {
        setIsListening(true);
        setRecognitionError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setRecognitionError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setRecognitionError(err.message || "Failed to initialize voice recording.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleCopy = (text: string, type: string) => {
    if (!text) return;
    copyToClipboard(text)
      .then(() => {
        setCopyFeedback(type);
        setTimeout(() => setCopyFeedback(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy transcript text:", err);
      });
  };

  const handleDownload = () => {
    if (!transcript) return;
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voice-transcript.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // SEO Data
  const faqs = [
    {
      q: "How does online Speech to Text translation work?",
      a: "This tool uses the native Web Speech API built into your web browser. When you speak, your microphone captures audio chunks and streams them to the browser's speech recognition engine, returning text transcriptions in real-time."
    },
    {
      q: "Does this require any external microservice or subscription?",
      a: "No! The Speech to Text recognition runs directly in compatible browsers (Chrome, Safari, Edge) without requiring any paid APIs or backend server processing."
    },
    {
      q: "Which languages are supported for speech transcription?",
      a: "We currently support multiple languages and locales including English (US/UK), Spanish, French, German, Hindi, and Chinese."
    }
  ];

  const useCases = [
    {
      title: "Real-time Meeting Dictation",
      desc: "Record conversations, speeches, or ideas hands-free to automatically generate meeting notes, saving hours of manual typing."
    },
    {
      title: "Accessibility Accommodations",
      desc: "Dictate documents, emails, or chat messages through vocal speech for users who have difficulties using traditional keyboards."
    }
  ];

  // Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Speech to Text Converter Online | DevSuite",
    "url": "https://dev-suit.vercel.app/tools/speech-to-text",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5. Requires Microphone permissions.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Convert speech into written text in real-time. Features multi-language speech recognition, local download options, and microphone controls."
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
            <span>🗣️</span> Speech to Text
          </h1>
          <p className="workspace-desc">
            Use your microphone to dictate text in real-time. Fast multi-language browser speech transcription.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      {/* Control Bar */}
      <div className="control-bar">
        <div className="control-options">
          <div className="option-group">
            <span className="option-label">Language:</span>
            <select
              className="select-custom"
              value={recognitionLang}
              onChange={(e) => setRecognitionLang(e.target.value)}
              disabled={isListening}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish (Spain)</option>
              <option value="fr-FR">French (France)</option>
              <option value="de-DE">German (Germany)</option>
              <option value="hi-IN">Hindi (India)</option>
              <option value="zh-CN">Chinese (Simplified)</option>
            </select>
          </div>
        </div>
        <Link href="/tools/text-to-speech" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
          Switch to Text to Speech &rarr;
        </Link>
      </div>

      <div className="workspace-grid" style={{ gridTemplateColumns: "1fr" }}>
        {/* Transcription Pane */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Speech to Text (Microphone)</h2>
            <div className="pane-actions">
              <button
                className="btn-icon"
                onClick={() => setTranscript("")}
                disabled={isListening}
                title="Clear transcript"
              >
                🗑️
              </button>
              <button
                className="btn-icon"
                onClick={handleDownload}
                disabled={!transcript}
                title="Download transcript"
              >
                💾
              </button>
              <button
                className="btn-icon"
                onClick={() => handleCopy(transcript, "transcript")}
                disabled={!transcript}
                title="Copy transcript"
              >
                📋
              </button>
            </div>
          </div>

          <div className="editor-wrapper" style={{ minHeight: "300px" }}>
            <textarea
              className="editor-textarea"
              placeholder="Your voice transcription will stream here. Click the record button below to start..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              style={{ minHeight: "300px" }}
            />
            {copyFeedback === "transcript" && (
              <span className="toast-feedback">Copied Transcript!</span>
            )}
          </div>

          {recognitionError && (
            <div className="status-panel error" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
              <span>⚠️</span>
              <span>{recognitionError}</span>
            </div>
          )}

          {/* Mic Trigger */}
          <div style={{ display: "flex", justifyContent: "center", padding: "0.5rem 0" }}>
            {isListening ? (
              <button
                className="btn-primary"
                onClick={stopListening}
                style={{
                  background: "var(--danger-grad)",
                  boxShadow: "0 0 15px rgba(255, 94, 98, 0.4)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 2rem",
                  borderRadius: "50px",
                }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    animation: "pulse 1s infinite alternate",
                  }}
                />
                Stop Listening
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={startListening}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 2rem",
                  borderRadius: "50px",
                }}
              >
                🎤 Start Recording
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <section className="seo-section">
        <div>
          <h2 className="seo-title">About speech-to-text converters</h2>
          <p className="seo-subtitle">Why voice-activated typing helps developers and creators write content faster.</p>
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
            <Link href="/tools/text-to-speech" className="related-link-card">
              <span>Text to Speech Tool</span>
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
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
