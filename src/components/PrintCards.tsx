import React, { useState } from "react";
import { Button } from "./ui";

interface PrintCardsProps {
  receiptPrinter: string;
  ticketPrinter: string;
  onPreviewReceipt: () => void;
  onPreviewTicket: () => void;
  onPrintReceipt: () => Promise<void>;
  onPrintTicket: () => Promise<void>;
}

export function PrintCards({
  receiptPrinter,
  ticketPrinter,
  onPreviewReceipt,
  onPreviewTicket,
  onPrintReceipt,
  onPrintTicket
}: PrintCardsProps) {
  const [printingReceipt, setPrintingReceipt] = useState(false);
  const [printingTicket, setPrintingTicket] = useState(false);

  const handlePrintReceipt = async () => {
    setPrintingReceipt(true);
    try {
      await onPrintReceipt();
    } finally {
      setPrintingReceipt(false);
    }
  };

  const handlePrintTicket = async () => {
    setPrintingTicket(true);
    try {
      await onPrintTicket();
    } finally {
      setPrintingTicket(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {/* -------- Customer receipt -------- */}
      <div className="flex flex-col gap-3 rounded-sm border border-line-dim border-l-2 border-l-line bg-panel p-4 px-[18px] transition hover:border-l-accent hover:bg-panel-2">
        <div className="flex items-center justify-between">
          <span className="text-[12.5px] font-bold uppercase tracking-[.06em] text-ink">
            Customer receipt
          </span>
          <span className="rounded-sm border border-accent-dim px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[.18em] text-accent-glow">
            with prices
          </span>
        </div>

        <div
          className={
            "flex min-h-[34px] items-center break-all rounded-sm border border-line-dim bg-panel-2 px-2.5 py-2 text-xs font-medium leading-snug " +
            (receiptPrinter ? "text-ink" : "italic text-ink-dim")
          }
        >
          {receiptPrinter || "— no printer assigned —"}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={onPreviewReceipt}>
            preview
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            loading={printingReceipt}
            onClick={handlePrintReceipt}
          >
            print ▸
          </Button>
        </div>
      </div>

      {/* -------- Order ticket -------- */}
      <div className="flex flex-col gap-3 rounded-sm border border-line-dim border-l-2 border-l-line bg-panel p-4 px-[18px] transition hover:border-l-accent hover:bg-panel-2">
        <div className="flex items-center justify-between">
          <span className="text-[12.5px] font-bold uppercase tracking-[.06em] text-ink">
            Order ticket
          </span>
          <span className="rounded-sm border border-accent-dim px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[.18em] text-accent-glow">
            KOT / BOT
          </span>
        </div>

        <div
          className={
            "flex min-h-[34px] items-center break-all rounded-sm border border-line-dim bg-panel-2 px-2.5 py-2 text-xs font-medium leading-snug " +
            (ticketPrinter ? "text-ink" : "italic text-ink-dim")
          }
        >
          {ticketPrinter || "— no printer assigned —"}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={onPreviewTicket}>
            preview
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            loading={printingTicket}
            onClick={handlePrintTicket}
          >
            print ▸
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PrintCards;