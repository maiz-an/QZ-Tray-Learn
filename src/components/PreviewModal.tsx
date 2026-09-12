import React, { useEffect, useRef, useState } from "react";

export type PreviewKind = "receipt" | "ticket";

interface PreviewModalProps {
  kind: PreviewKind | null;
  html: string;
  widthMm: number;
  onClose: () => void;
}

export function PreviewModal({
  kind,
  html,
  widthMm,
  onClose
}: PreviewModalProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [ready, setReady] = useState(false);

  /* Reset ready state every time the modal opens or HTML changes */
  useEffect(() => {
    if (!kind) {
      setReady(false);
      return;
    }
    setReady(false);
  }, [kind, html]);

  /* Fit the iframe to the content height once loaded */
  useEffect(() => {
    if (!kind) return;
    const frame = frameRef.current;
    if (!frame) return;

    const fit = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc || !doc.body) return;
        const h = Math.max(
          doc.documentElement.scrollHeight,
          doc.documentElement.offsetHeight,
          doc.body.scrollHeight,
          doc.body.offsetHeight
        );
        if (h > 0) frame.style.height = h + "px";
      } catch {
        /* ignore cross-doc errors */
      }
    };

    const onLoad = () => {
      fit();
      window.setTimeout(fit, 250);
      setReady(true);
    };

    frame.addEventListener("load", onLoad);
    return () => frame.removeEventListener("load", onLoad);
  }, [kind, html]);

  if (!kind) return null;

  const title = kind === "ticket" ? "TICKET PREVIEW" : "RECEIPT PREVIEW";

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92vh] w-[min(520px,100%)] flex-col border border-line bg-panel shadow-[0_24px_80px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,30,30,.08),0_0_60px_rgba(255,30,30,.06)]">
        {/* header */}
        <div className="flex flex-none items-center justify-between border-b border-line-dim bg-panel-2 px-[18px] py-3 text-[11px] uppercase tracking-[.14em] text-ink-dim">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_1px_#ff1e1e]" />
            {title}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-line bg-transparent px-2 py-1 text-[11px] font-semibold text-ink transition hover:border-accent-dim hover:bg-[#241210]"
          >
            ✕ close
          </button>
        </div>

        {/* body */}
        <div className="hide-scrollbar relative flex flex-none items-start justify-center overflow-y-auto overflow-x-hidden bg-[#0d0402] p-6">
          {/* skeleton placeholder */}
          <div
            className={
              "pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 transition-opacity duration-200 " +
              (ready ? "opacity-0" : "opacity-100")
            }
          >
            <div
              className="flex h-[520px] flex-col gap-3 rounded-sm bg-white p-5 shadow-[0_0_0_1px_rgba(0,0,0,.6),0_18px_50px_rgba(0,0,0,.75)]"
              style={{ width: `${widthMm}mm`, minWidth: 260, maxWidth: "100%" }}
            >
              <div className="skeleton-bar skeleton-bar-on-white mx-auto mb-2 !h-[18px] !w-[60%]" />
              <div className="skeleton-bar skeleton-bar-on-white mx-auto !h-2.5 !w-[40%]" />
              <div className="!h-4" />
              <div className="skeleton-bar skeleton-bar-on-white !h-2.5" />
              <div className="skeleton-bar skeleton-bar-on-white !h-2.5 !w-[70%]" />
              <div className="skeleton-bar skeleton-bar-on-white !h-2.5" />
              <div className="!h-4" />
              <div className="skeleton-bar skeleton-bar-on-white !h-2.5" />
              <div className="skeleton-bar skeleton-bar-on-white !h-2.5 !w-[70%]" />
              <div className="skeleton-bar skeleton-bar-on-white !h-2.5" />
              <div className="skeleton-bar skeleton-bar-on-white !h-2.5 !w-[70%]" />
              <div className="skeleton-bar skeleton-bar-on-white mt-2.5 !h-[22px]" />
            </div>
          </div>

          {/* preview iframe */}
          <iframe
            ref={frameRef}
            title="Preview"
            scrolling="no"
            srcDoc={html}
            className="mx-auto block rounded-sm bg-white shadow-[0_0_0_1px_rgba(0,0,0,.6),0_18px_50px_rgba(0,0,0,.75),0_0_90px_rgba(255,30,30,.08)]"
            style={{
              width: `${widthMm}mm`,
              minWidth: 260,
              maxWidth: "100%",
              height: 1,
              border: 0,
              overflow: "hidden",
              opacity: ready ? 1 : 0,
              transition: "opacity 200ms ease"
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;