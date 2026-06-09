"use client";

import { useState } from "react";
import Link from "next/link";

export default function Mp4ToMp3() {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState("192");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "video/mp4" || droppedFile.name.endsWith(".mp4")) {
        setFile(droppedFile);
        setError(null);
        setSuccess(false);
      } else {
        setError("Only MP4 files are supported.");
        setFile(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "video/mp4" || selectedFile.name.endsWith(".mp4")) {
        setFile(selectedFile);
        setError(null);
        setSuccess(false);
      } else {
        setError("Only MP4 files are supported.");
        setFile(null);
      }
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bitrate", bitrate);

    try {
      const response = await fetch("/api/mp4-to-mp3", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to extract audio. Check if the file is valid.");
      }

      // Read response as blob to download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const originalName = file.name || "audio.mp4";
      const outputName = originalName.replace(/\.[^/.]+$/, "") + ".mp3";
      
      a.download = outputName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during file upload or conversion.");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>🎵</span> MP4 to MP3 Converter
          </h1>
          <p className="workspace-desc">
            Upload any MP4 video file to extract its audio track and download it as a high-quality MP3.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="workspace-grid" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        {/* Upload Pane */}
        <div className="pane">
          <h2 className="pane-title" style={{ marginBottom: "1rem" }}>Upload Video</h2>
          
          <div
            style={{
              border: `2px dashed ${dragActive ? "var(--neon-cyan)" : "var(--border-color)"}`,
              borderRadius: "12px",
              padding: "3rem 2rem",
              textAlign: "center",
              background: dragActive ? "rgba(0, 242, 254, 0.03)" : "rgba(8, 10, 16, 0.4)",
              transition: "all 0.2s",
              cursor: "pointer",
              position: "relative",
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              accept="video/mp4"
              onChange={handleFileChange}
            />
            
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎥</div>
            <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              Drag & Drop your MP4 file here or click to browse
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Supported formats: MP4 video up to 50MB
            </p>
          </div>

          {file && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginTop: "1.5rem",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-color)",
                padding: "1rem",
                borderRadius: "10px",
              }}
            >
              <span style={{ fontSize: "2rem" }}>📄</span>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <p style={{ fontWeight: 600, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {file.name}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {formatSize(file.size)}
                </p>
              </div>
              <button
                className="btn-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setSuccess(false);
                }}
                title="Remove file"
              >
                ❌
              </button>
            </div>
          )}
        </div>

        {/* Configuration Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="pane">
            <h2 className="pane-title" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
              Extraction Settings
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span className="option-label">Audio Quality (Bitrate):</span>
                <select
                  className="select-custom"
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem" }}
                  disabled={loading}
                >
                  <option value="128">128 kbps (Standard Quality)</option>
                  <option value="192">192 kbps (High Quality)</option>
                  <option value="256">256 kbps (Very High Quality)</option>
                  <option value="320">320 kbps (Extreme Quality / Audiophile)</option>
                </select>
              </div>

              <button
                className="btn-primary"
                style={{ width: "100%", padding: "0.8rem", justifyContent: "center" }}
                onClick={handleConvert}
                disabled={!file || loading}
              >
                {loading ? "Extracting Audio..." : "Convert to MP3"}
              </button>
            </div>
          </div>

          {/* Status Indicators */}
          {loading && (
            <div className="status-panel success" style={{ background: "rgba(0, 242, 254, 0.05)", borderColor: "rgba(0, 242, 254, 0.2)", color: "var(--text-primary)" }}>
              <span className="status-icon" style={{ animation: "spin 2s linear infinite" }}>🔄</span>
              <div className="status-details">
                <span className="status-title">Processing file...</span>
                <span className="status-message" style={{ fontSize: "0.8rem" }}>
                  FFmpeg is extracting the audio stream. This might take a few seconds depending on the file size.
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="status-panel error">
              <span className="status-icon">⚠️</span>
              <div className="status-details">
                <span className="status-title">Extraction Failed</span>
                <span className="status-message">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="status-panel success">
              <span className="status-icon">✅</span>
              <div className="status-details">
                <span className="status-title">Conversion Complete</span>
                <span className="status-message">MP3 audio file extracted and downloaded successfully!</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
