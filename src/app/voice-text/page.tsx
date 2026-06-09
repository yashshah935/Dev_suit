"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function VoiceTextConverter() {
  // Speech to Text States
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognitionLang, setRecognitionLang] = useState("en-US");
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  
  // Text to Speech States
  const [speakText, setSpeakText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const recognitionRef = useRef<any>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

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

  const handleCopy = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
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

  const loadSpeechSample = () => {
    setSpeakText(
      "Welcome to DevSuite voice syntheiszer. You can configure different system voices, speed, and pitch levels. Have a great day!"
    );
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>🗣️</span> Voice & Text Converter
          </h1>
          <p className="workspace-desc">
            Use your microphone to dictate text in real-time or transform typed paragraphs into speech narration.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="workspace-grid">
        {/* Panel 1: Voice to Text */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Speech to Text (Microphone)</h2>
            <div className="pane-actions">
              <select
                className="select-custom"
                style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
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

        {/* Panel 2: Text to Voice */}
        <div className="pane">
          <div className="pane-header">
            <h2 className="pane-title">Text to Speech (Synthesizer)</h2>
            <div className="pane-actions">
              <button
                className="btn-secondary"
                style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
                onClick={loadSpeechSample}
              >
                Load Sample
              </button>
              <button
                className="btn-icon"
                onClick={() => setSpeakText("")}
                title="Clear text"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="editor-wrapper" style={{ minHeight: "220px" }}>
            <textarea
              className="editor-textarea"
              placeholder="Type or paste paragraphs here to listen to them..."
              value={speakText}
              onChange={(e) => setSpeakText(e.target.value)}
              style={{ minHeight: "220px" }}
            />
          </div>

          {/* Voice Settings */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border-color)",
              padding: "1rem",
              borderRadius: "12px",
            }}
          >
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="option-label">Speed (Rate)</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--neon-cyan)" }}>{speechRate}x</span>
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
                  <span style={{ fontSize: "0.8rem", color: "var(--neon-cyan)" }}>{speechPitch}</span>
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
          </div>

          {/* Speak Triggers */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
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
              <button className="btn-primary" onClick={handleSpeak} disabled={!speakText.trim()}>
                🔊 {isPaused ? "Resume" : "Speak Text"}
              </button>
            )}
          </div>

          {/* Waveform Visualization (Pure CSS) */}
          {isSpeaking && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "3px", height: "20px" }}>
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

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes waveBounce {
          0% { height: 4px; }
          100% { height: 18px; }
        }
      `}</style>
    </div>
  );
}
