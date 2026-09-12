import React from "react";

export function Header() {
  return (
    <header className="mb-8">
      {/* LIVE CONSOLE badge with pulsing red dot */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-accent-dim bg-[rgba(255,30,30,0.06)] px-2 py-1 text-[11px] tracking-[.08em] text-accent-glow">
        <span
          className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot"
          style={{ boxShadow: "0 0 8px 1px #ff1e1e" }}
        />
        LIVE CONSOLE
      </div>

      {/* Glitch heading — the animation + pseudo-elements live in index.css */}
      <h1 className="glitch" data-text=">_QZ-TRAY">
        <span className="prompt">&gt;_</span>QZ-TRAY
      </h1>

      <p className="max-w-[54ch] text-[13.5px] leading-relaxed text-ink-dim">
        Silent 80mm receipt printing over QZ Tray. Every request is{" "}
        <b className="font-semibold text-ink">signed</b> server-side — no
        exposed keys, no popup after the first handshake.
      </p>
    </header>
  );
}