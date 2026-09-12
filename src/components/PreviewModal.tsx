import React, { useEffect, useRef, useState } from "react";

export type PreviewKind = "receipt" | "bill" | "ticket" | "cancellation";

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
   * The modal body (below) handles scrolling when that's taller
   * than the available space.
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

  const titles: Record<PreviewKind, string> = {
    receipt: "CHECKOUT RECEIPT PREVIEW",
    bill: "ORDER RECEIPT PREVIEW",
    ticket: "PREPARATION RECEIPT PREVIEW",
    cancellation: "CANCELLATION RECEIPT PREVIEW"
  };
  const title = titles[kind];

  return (
    /* ==============================================================
       BACKDROP — matches the old vanilla-JS preview modal exactly:
       fixed, centered, dimmed, blurred.
       ============================================================== */
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

          width: min(520px, 100%) and max-h: 92vh — same as the old
          working preview. The card itself never overflows the
          viewport; the body below handles scrolling internally.
          ============================================================ */}
      <div
        className="
          flex
          max-h-[92vh]
          w-[min(520px,100%)]
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
            MODAL BODY

            flex: 0 1 auto (→ flex-shrink), min-h-0, overflow-y-auto:
            short receipts keep the modal short; a receipt taller than
            92vh shrinks the body to the remaining space and scrolls
            internally — exactly like the old CSS's
            `flex:0 1 auto; overflow-y:auto`.
            justify-center + items-start (not justify-start): the
            iframe is centered when it fits, same as before, and
            scrollbar is hidden but scrolling still works.
            ========================================================== */}
        <div
          className="
            hide-scrollbar
            relative
            min-h-0
            overflow-y-auto
            overflow-x-hidden
            bg-[#0d0402]
            p-6
            flex
            items-start
            justify-center
          "
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(255,30,30,.05), transparent 60%)",
          }}
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
                maxWidth: "100%",
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

              width: widthMm mm, min-width 260px, max-width 100% —
              identical to the old .modal-body iframe rule. It sits at
              its natural print width and only shrinks on a viewport
              narrower than the card, exactly like before.
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
              maxWidth: "100%",
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