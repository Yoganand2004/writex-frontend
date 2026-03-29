import { useState, useRef, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import Cookies from 'js-cookie';
import { io } from "socket.io-client";

const socket = io("https://anywherewritex.onrender.com");

function generatePort() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export default function RemoteClipboard() {
  const navigate = useNavigate();
  
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [flash, setFlash] = useState(false);

  const [port, setPort] = useState(() => generatePort());
  const [inputPort, setInputPort] = useState("");
  const [portCopied, setPortCopied] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const textareaRef = useRef(null);

  useEffect(() => {
    socket.emit("join-port", port);
  }, []); 

  useEffect(() => {
    setCharCount(text.length);
    socket.on("load-text", (data) => {
      setText(data);
    });
    socket.on("receive-text", (data) => {
      setText(data);
    });
    return () => {
      socket.off("load-text");
      socket.off("receive-text");
    };
  }, []);

  const handleNewPort = () => {
    socket.emit("clear-room", port);    
    socket.emit("leave-port", port);
    const portGeneratednow = generatePort();
    setPort(portGeneratednow);
    socket.emit("join-port", portGeneratednow);
    setText("");
    setJoinError("");
  };

  const handleCopyPort = async () => {
    await navigator.clipboard.writeText(port);
    setPortCopied(true);
    setTimeout(() => setPortCopied(false), 2000);
  };

  const handleJoin = () => {
    const token = Cookies.get('token');
    const val = inputPort.trim();
    if (!/^\d{5}$/.test(val)) {
      setJoinError("Enter a valid 5-digit port");
      return;
    }
    socket.emit("leave-port", port);
    socket.emit("join-port", val);
    setPort(val);
    setInputPort("");
    setJoinError("");
    setText("");
  };

  const handleCopy = async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFlash(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setFlash(false), 600);
    } catch {
      const el = textareaRef.current;
      el.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setText("");
    textareaRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
    } catch {
      textareaRef.current?.focus();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    socket.emit("send-text", {
      roomId: port,
      text: e.target.value,
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)",
        fontFamily: "'DM Mono', 'Courier New', monospace",
      }}
    >
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <style>{`
        textarea::placeholder { color: rgba(255,255,255,0.18); }
        textarea:focus { outline: none; }
        * { box-sizing: border-box; }
        
        /* Prevent iOS zoom on input focus */
        input, textarea { font-size: 16px !important; }

        @media (max-width: 640px) {
          .port-digits-wrap { flex-wrap: wrap; gap: 8px; }
        }
      `}</style>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-white/5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6ee7b7, #3b82f6)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="6" rx="1" fill="white" opacity="0.9" />
              <rect x="9" y="2" width="5" height="6" rx="1" fill="white" opacity="0.6" />
              <rect x="2" y="10" width="5" height="4" rx="1" fill="white" opacity="0.6" />
              <rect x="9" y="10" width="5" height="4" rx="1" fill="white" opacity="0.9" />
            </svg>
          </div>
          <span
            className="text-base sm:text-lg font-bold tracking-tight"
            style={{
              background: "linear-gradient(90deg, #6ee7b7, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PastePort
          </span>
        </div>

        {/* Port badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs text-white/30 uppercase tracking-widest hidden sm:inline">Port</span>
          <div
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-lg"
            style={{ background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)" }}
          >
            <span style={{ color: "#6ee7b7", letterSpacing: "0.15em", fontFamily: "inherit", fontSize: "13px", fontWeight: 700 }}>
              {port}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-white/30">live</span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 sm:px-6 py-6 sm:py-12">
        <div className="w-full max-w-3xl">

          {/* Title block */}
          <div className="mb-5 sm:mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-2 sm:mb-3">
              Remote Clipboard
            </p>
            <h1
              className="text-2xl sm:text-4xl font-bold tracking-tight mb-1 sm:mb-2"
              style={{
                fontFamily: "'DM Mono', monospace",
                background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Write. Share. Paste.
            </h1>
          </div>

          {/* Port panel */}
          <div
            className="mb-4 sm:mb-6 rounded-2xl px-4 sm:px-6 py-4 sm:py-5"
            style={{
              background: "rgba(110,231,183,0.04)",
              border: "1px solid rgba(110,231,183,0.12)",
            }}
          >
            {/* YOUR PORT section */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-2">Your Port</p>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Digit boxes */}
                <div className="flex gap-1 sm:gap-1.5">
                  {port.split("").map((d, i) => (
                    <div
                      key={i}
                      className="w-8 h-10 sm:w-9 sm:h-11 flex items-center justify-center rounded-lg text-lg sm:text-xl font-bold"
                      style={{
                        background: "rgba(110,231,183,0.1)",
                        border: "1px solid rgba(110,231,183,0.25)",
                        color: "#6ee7b7",
                        fontFamily: "inherit",
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Copy port */}
                <button
                  onClick={handleCopyPort}
                  title="Copy port number"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 active:scale-95"
                  style={{
                    background: portCopied ? "rgba(110,231,183,0.2)" : "rgba(255,255,255,0.06)",
                    color: portCopied ? "#6ee7b7" : "rgba(255,255,255,0.4)",
                    border: portCopied ? "1px solid rgba(110,231,183,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "inherit",
                    minHeight: "36px",
                  }}
                >
                  {portCopied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="3" y="3" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M2 8.5H1.5C1.22 8.5 1 8.28 1 8V2C1 1.72 1.22 1.5 1.5 1.5H7C7.28 1.5 7.5 1.72 7.5 2V3" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                      Copy
                    </>
                  )}
                </button>

                {/* New port */}
                <button
                  onClick={handleNewPort}
                  title="Generate new port"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.3)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontFamily: "inherit",
                    minHeight: "36px",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 6A4 4 0 1 1 6 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M6 0l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  New
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 mb-4" />

            {/* JOIN section */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/30 mb-2">Join a Port</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  value={inputPort}
                  onChange={(e) => {
                    setJoinError("");
                    const v = e.target.value.replace(/\D/g, "").slice(0, 5);
                    setInputPort(v);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="_ _ _ _ _"
                  className="text-center font-bold rounded-lg outline-none transition-all"
                  style={{
                    width: "110px",
                    background: "rgba(255,255,255,0.05)",
                    border: joinError ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontFamily: "inherit",
                    padding: "10px 10px",
                    letterSpacing: "0.2em",
                    caretColor: "#6ee7b7",
                    minHeight: "44px",
                  }}
                />
                <button
                  onClick={handleJoin}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
                    color: "#0a0a0f",
                    fontFamily: "inherit",
                    minHeight: "44px",
                  }}
                >
                  Join
                </button>
              </div>
              {joinError && (
                <p className="text-xs mt-1.5" style={{ color: "rgba(239,68,68,0.8)" }}>{joinError}</p>
              )}
            </div>
          </div>

          {/* Editor card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: flash
                ? "0 0 0 2px rgba(110,231,183,0.4), 0 24px 80px rgba(0,0,0,0.5)"
                : "0 24px 80px rgba(0,0,0,0.5)",
              transition: "box-shadow 0.3s ease",
            }}
          >
            {/* Editor toolbar */}
            <div
              className="flex items-center justify-between px-4 sm:px-5 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-white/20">clipboard.txt</span>
              <span className="text-xs text-white/20">{charCount} chars</span>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              placeholder="Type or paste your text here..."
              className="w-full bg-transparent text-white/85 resize-none outline-none leading-relaxed"
              style={{
                minHeight: "220px",
                padding: "16px sm:24px",
                paddingTop: "20px",
                paddingBottom: "20px",
                paddingLeft: "16px",
                paddingRight: "16px",
                fontFamily: "'DM Mono', 'Courier New', monospace",
                lineHeight: "1.75",
                caretColor: "#6ee7b7",
                color: "rgba(255,255,255,0.85)",
              }}
            />

            {/* Action bar */}
            <div
              className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 gap-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex gap-2">
                {/* Paste button */}
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-sm transition-all duration-150 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "inherit",
                    minHeight: "44px",
                  }}
                  title="Paste from clipboard"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="3" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M4 3V2.5C4 1.67 4.67 1 5.5 1h3C9.33 1 10 1.67 10 2.5V3" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M3.5 7h6M3.5 9.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <span className="hidden xs:inline sm:inline">Paste</span>
                </button>

                {/* Clear button */}
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-sm transition-all duration-150 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.3)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontFamily: "inherit",
                    minHeight: "44px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <span className="hidden xs:inline sm:inline">Clear</span>
                </button>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                disabled={!text.trim()}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: copied
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #6ee7b7, #3b82f6)",
                  color: "#0a0a0f",
                  fontFamily: "inherit",
                  boxShadow: copied
                    ? "0 0 24px rgba(16,185,129,0.4)"
                    : "0 0 24px rgba(110,231,183,0.25)",
                  minHeight: "44px",
                  whiteSpace: "nowrap",
                }}
              >
                {copied ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M2.5 7.5l3.5 3.5 6.5-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="4" y="4" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M3 10.5H2.5C1.67 10.5 1 9.83 1 9V2.5C1 1.67 1.67 1 2.5 1H9C9.83 1 10.5 1.67 10.5 2.5V4" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                    Copy Text
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom hint */}
          <p className="text-center text-xs text-white/20 mt-4 sm:mt-6 tracking-wide px-4">
            Share your 5-digit port — anyone with the same port sees the same clipboard
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-5 sm:pb-6">
        <p className="text-xs text-white/15">PastePort © 2026 — Instant remote clipboard</p>
      </footer>
    </div>
  );
}