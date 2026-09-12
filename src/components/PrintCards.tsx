import React, { useState } from "react";
import { Button } from "./ui";

interface PrintCardsProps {
  receiptPrinter: string;
  ticketPrinter: string;
  onPreviewReceipt: () => void;
  onPreviewBill: () => void;
  onPreviewTicket: () => void;
  onPreviewCancellation: () => void;
  onPrintReceipt: () => Promise<void>;
  onPrintBill: () => Promise<void>;
  onPrintTicket: () => Promise<void>;
  onPrintCancellation: () => Promise<void>;
}

/** One preview/print card — same markup for all four print kinds. */
interface PrintCardProps {
  title: string;
  badge: string;
  printer: string;
  onPreview: () => void;
  onPrint: () => Promise<void>;
}

function PrintCard({ title, badge, printer, onPreview, onPrint }: PrintCardProps) {
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    try {
      await onPrint();
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-line-dim border-l-2 border-l-line bg-panel p-4 px-[18px] transition hover:border-l-accent hover:bg-panel-2">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-bold uppercase tracking-[.06em] text-ink">
          {title}
        </span>
        <span className="rounded-sm border border-accent-dim px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[.18em] text-accent-glow">
          {badge}
        </span>
      </div>

      <div
        className={
          "flex min-h-[34px] items-center break-all rounded-sm border border-line-dim bg-panel-2 px-2.5 py-2 text-xs font-medium leading-snug " +
          (printer ? "text-ink" : "italic text-ink-dim")
        }
      >
        {printer || "— no printer assigned —"}
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={onPreview}>
          preview
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          loading={printing}
          onClick={handlePrint}
        >
          print ▸
        </Button>
      </div>
    </div>
  );
}

export function PrintCards({
  receiptPrinter,
  ticketPrinter,
  onPreviewReceipt,
  onPreviewBill,
  onPreviewTicket,
  onPreviewCancellation,
  onPrintReceipt,
  onPrintBill,
  onPrintTicket,
  onPrintCancellation
}: PrintCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {/* -------- Customer receipt (after payment) -------- */}
      <PrintCard
        title="Customer receipt"
        badge="with prices"
        printer={receiptPrinter}
        onPreview={onPreviewReceipt}
        onPrint={onPrintReceipt}
      />

      {/* -------- Bill (before payment) -------- */}
      <PrintCard
        title="Bill"
        badge="before payment"
        printer={receiptPrinter}
        onPreview={onPreviewBill}
        onPrint={onPrintBill}
      />

      {/* -------- Order ticket -------- */}
      <PrintCard
        title="Order ticket"
        badge="KOT / BOT"
        printer={ticketPrinter}
        onPreview={onPreviewTicket}
        onPrint={onPrintTicket}
      />

      {/* -------- Cancellation ticket -------- */}
      <PrintCard
        title="Cancellation ticket"
        badge="void order"
        printer={ticketPrinter}
        onPreview={onPreviewCancellation}
        onPrint={onPrintCancellation}
      />
    </div>
  );
}

export default PrintCards;