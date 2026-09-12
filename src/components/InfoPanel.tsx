import React from "react";

export function InfoPanel() {
  return (
    <div className="mt-8 border-l-2 border-l-line bg-panel px-[18px] py-4 text-xs leading-relaxed text-ink-dim">
      Don't have QZ Tray installed yet? Grab it from{" "}
      <a
        href="https://qz.io/download/"
        target="_blank"
        rel="noopener"
        className="border-b border-accent-dim text-accent-glow no-underline hover:border-b-accent-glow"
      >
        qz.io/download
      </a>
      , then see the README for generating a free signing certificate.
      <br />
      <br />
      <b className="text-ink">Printer choices are saved</b> to this browser.
      Reload the page and your receipt &amp; ticket printers are remembered
      automatically.
      <br />
      <br />
      <b className="text-ink">Edit src/config/receipt-config.ts</b> to change
      business, logo, items, font sizes, printer density, and footer. Save —
      Vite hot-reloads instantly.
    </div>
  );
}

export default InfoPanel;