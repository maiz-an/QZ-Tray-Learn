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
  onClose,
}: PreviewModalProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [ready, setReady] = useState(false);

  /*
   * Reset preview whenever the preview type or HTML changes.
   */
  useEffect(() => {
    if (!kind) {
      setReady(false);
      return;
    }

    setReady(false);
  }, [kind, html]);

  /*
   * Resize iframe to the full height of the receipt.
   *
   * The iframe itself becomes as tall as the complete receipt.
   * The parent .modal-body handles scrolling.
   */
  useEffect(() => {
    if (!kind) return;

    const frame = frameRef.current;
    if (!frame) return;

    let resizeObserver: ResizeObserver | null = null;

    const fit = () => {
      try {
        const doc = frame.contentDocument;

        if (!doc || !doc.body) return;

        const htmlElement = doc.documentElement;
        const body = doc.body;

        const height = Math.max(
          htmlElement.scrollHeight,
          htmlElement.offsetHeight,
          htmlElement.clientHeight,
          body.scrollHeight,
          body.offsetHeight,
          body.clientHeight
        );

        if (height > 0) {
          frame.style.height = `${height}px`;
        }
      } catch {
        // Ignore iframe access errors.
      }
    };

    const onLoad = () => {
      /*
       * Run several times because receipt HTML/fonts/images
       * may finish rendering slightly after iframe load.
       */
      fit();

      window.setTimeout(fit, 50);
      window.setTimeout(fit, 150);
      window.setTimeout(fit, 300);
      window.setTimeout(fit, 600);

      setReady(true);

      /*
       * Watch the receipt content for changes.
       */
      try {
        const doc = frame.contentDocument;

        if (doc?.body && typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(() => {
            fit();
          });

          resizeObserver.observe(doc.body);
        }
      } catch {
        // Ignore observer errors.
      }
    };

    frame.addEventListener("load", onLoad);

    /*
     * If iframe has already loaded.
     */
    if (frame.contentDocument?.readyState === "complete") {
      onLoad();
    }

    return () => {
      frame.removeEventListener("load", onLoad);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [kind, html]);

  /*
   * Close preview when Escape is pressed.
   */
  useEffect(() => {
    if (!kind) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [kind, onClose]);

  if (!kind) {
    return null;
  }

  const title = kind === "ticket" ? "TICKET PREVIEW" : "RECEIPT PREVIEW";

  return (
    <div
      className="
        fixed
        inset-0
        z-[9998]
        flex
        items-center
        justify-center
        bg-black/85
        p-6
        backdrop-blur-sm
      "
      onClick={(event) => {
        /*
         * Close only when clicking the dark background,
         * not when clicking inside the modal.
         */
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* ============================================================
          MODAL CARD
          ============================================================ */}
      <div
        className="
          flex
          max-h-[92vh]
          w-[min(620px,100%)]
          flex-col
          overflow-hidden
          border
          border-line
          bg-panel
          shadow-[0_24px_80px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,30,30,.08),0_0_60px_rgba(255,30,30,.06)]
        "
      >
        {/* ==========================================================
            HEADER
            ========================================================== */}
        <div
          className="
            flex
            flex-none
            items-center
            justify-between
            border-b
            border-line-dim
            bg-panel-2
            px-[18px]
            py-3
            text-[11px]
            uppercase
            tracking-[.14em]
            text-ink-dim
          "
        >
          <span className="flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-accent
                shadow-[0_0_8px_1px_#ff1e1e]
              "
            />

            {title}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-sm
              border
              border-line
              bg-transparent
              px-2
              py-1
              text-[11px]
              font-semibold
              text-ink
              transition
              hover:border-accent-dim
              hover:bg-[#241210]
            "
          >
            ✕ close
          </button>
        </div>

        {/* ==========================================================
            SCROLLABLE PREVIEW AREA

            IMPORTANT:
            - NO flex-1 → the body does NOT grow to fill 92vh.
              Short receipts = short modal.
            - min-h-0 → allows the body to shrink below its content
              size when the receipt is taller than 92vh, so the
              vertical scroll actually engages instead of overflowing.
            - overflow-y-auto + overflow-x-auto → the receipt/ticket
              always renders at its REAL, full width (no shrink-to-fit).
              If it's wider or taller than the modal, you scroll to
              see the rest instead of it being squeezed down and
              becoming unreadable.
            - justify-start (not justify-center) → when the content is
              narrower than the modal, `mx-auto` on the iframe still
              centers it. When it's wider and overflows, it starts
              flush at the left edge so scrolling right reveals the
              rest, instead of overflowing equally (and confusingly)
              on both sides.
            ========================================================== */}
        <div
          className="
            hide-scrollbar
            relative
            min-h-0
            overflow-auto
            bg-[#0d0402]
            p-6
            flex
            items-start
            justify-start
          "
        >
          {/* ========================================================
              LOADING PLACEHOLDER
              ======================================================== */}
          <div
            className={
              "pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 transition-opacity duration-200 " +
              (ready ? "opacity-0" : "opacity-100")
            }
          >
            <div
              className="
                flex
                h-[520px]
                flex-col
                gap-3
                rounded-sm
                bg-white
                p-5
                shadow-[0_0_0_1px_rgba(0,0,0,.6),0_18px_50px_rgba(0,0,0,.75)]
              "
              style={{
                width: `${widthMm}mm`,
                minWidth: 260,
              }}
            >
              <div className="h-3 w-2/3 rounded bg-gray-200" />
              <div className="h-2 w-full rounded bg-gray-100" />
              <div className="h-2 w-5/6 rounded bg-gray-100" />
              <div className="h-2 w-full rounded bg-gray-100" />
              <div className="h-2 w-4/5 rounded bg-gray-100" />

              <div className="my-2 h-px w-full bg-gray-200" />

              <div className="h-2 w-full rounded bg-gray-100" />
              <div className="h-2 w-full rounded bg-gray-100" />
              <div className="h-2 w-3/4 rounded bg-gray-100" />

              <div className="mt-2 h-8 w-full rounded bg-gray-100" />

              <div className="h-2 w-full rounded bg-gray-100" />
              <div className="h-2 w-5/6 rounded bg-gray-100" />
              <div className="h-2 w-2/3 rounded bg-gray-100" />
            </div>
          </div>

          {/* ========================================================
              RECEIPT / TICKET IFRAME

              The iframe itself is NOT scrollable and is never shrunk
              below its real physical width (no maxWidth cap here) —
              it always renders at true size. It gets the full receipt
              height (set by JS above). The parent container handles
              both vertical AND horizontal scrolling, so the preview
              stays fully readable at its real width no matter how
              small the modal/viewport is.
              ======================================================== */}
          <iframe
            ref={frameRef}
            title="Preview"
            scrolling="no"
            srcDoc={html}
            className="
              mx-auto
              block
              flex-none
              rounded-sm
              bg-white
              shadow-[0_0_0_1px_rgba(0,0,0,.6),0_18px_50px_rgba(0,0,0,.75),0_0_90px_rgba(255,30,30,.08)]
            "
            style={{
              width: `${widthMm}mm`,
              minWidth: 260,
              height: 1,
              border: 0,
              overflow: "hidden",
              opacity: ready ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;