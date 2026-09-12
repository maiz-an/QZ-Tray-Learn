import React, { useEffect } from "react";
import type { QzStatus } from "@/hooks/useQz";
import type { PrinterKind } from "@/lib/storage";
import { LoadingNote, SkeletonBar } from "./ui";

interface Props {
  status: QzStatus;
  printers: string[];
  errorMessage: string;
  receiptPrinter: string;
  ticketPrinter: string;
  onSelect: (kind: PrinterKind, value: string) => void;
}

export function PrinterPanel({
  status,
  printers,
  errorMessage,
  receiptPrinter,
  ticketPrinter,
  onSelect
}: Props) {
  /* ---------- loading ---------- */
  if (status === "connecting" || status === "idle") {
    return (
      <div className="flex flex-col gap-3.5 rounded-sm border border-line-dim border-l-2 border-l-line bg-panel p-4 px-[18px]">
        <LoadingNote />
        <div className="flex flex-col gap-3.5">
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  /* ---------- error ---------- */
  if (status === "error" || printers.length === 0) {
    const isNotRunning = /not running/i.test(errorMessage);
    return (
      <div className="flex flex-col gap-2 rounded-sm border border-line-dim border-l-2 border-l-line bg-panel p-4 px-[18px]">
        <div className="text-[12.5px] leading-relaxed text-ink-dim before:mr-1 before:content-['▸'] before:text-line">
          {isNotRunning ? (
            <>
              QZ Tray is not running — start it from the system tray, then click{" "}
              <b className="text-ink">reconnect_qz</b>.
            </>
          ) : printers.length === 0 && status === "connected" ? (
            <>
              No printers found on this system. Install a printer (even Microsoft
              Print to PDF) and click <b className="text-ink">refresh printers</b>.
            </>
          ) : (
            <>
              Could not reach QZ Tray — {errorMessage}. Click{" "}
              <b className="text-ink">reconnect_qz</b> to retry.
            </>
          )}
        </div>
        <div className="text-[11px] tracking-[.04em] text-ink-dim">
          Once connected, printer dropdowns will appear here.
        </div>
      </div>
    );
  }

  /* ---------- dropdowns ---------- */
  return (
    <div className="flex flex-col gap-3.5 rounded-sm border border-line-dim border-l-2 border-l-line bg-panel p-4 px-[18px]">
      <SelectRow
        id="sel-receipt"
        label="Receipt printer"
        value={receiptPrinter}
        options={printers}
        onChange={(v) => onSelect("receipt", v)}
      />
      <SelectRow
        id="sel-ticket"
        label="Ticket printer"
        value={ticketPrinter}
        options={printers}
        onChange={(v) => onSelect("ticket", v)}
      />
      <div className="text-[11px] tracking-[.04em] text-ink-dim">
        Selections are saved automatically to this browser.
      </div>
    </div>
  );
}

/* ------------------ helpers ------------------ */

function SkeletonRow() {
  return (
    <div className="flex flex-col gap-1.5">
      <SkeletonBar className="!h-2.5 !w-[90px]" />
      <SkeletonBar className="!h-[38px] !rounded-sm" />
    </div>
  );
}

interface SelectRowProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function SelectRow({ id, label, value, options, onChange }: SelectRowProps) {
  // If the stored value is no longer present, clear it.
  useEffect(() => {
    if (value && !options.includes(value)) {
      onChange("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-dim"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-sm border border-line bg-panel-2 py-2.5 pl-3 pr-9 text-[12.5px] font-medium text-ink transition hover:border-accent-dim hover:bg-[#241210] focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2 4l4 4 4-4' stroke='%238f7570' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          backgroundSize: "12px"
        }}
      >
        <option value="">— select a printer —</option>
        {options.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}