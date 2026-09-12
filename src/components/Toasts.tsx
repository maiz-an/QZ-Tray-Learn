import React from "react";
import type { ToastItem } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

interface Props {
  toasts: ToastItem[];
}

export function Toasts({ toasts }: Props) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex max-w-[340px] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto rounded-sm border border-line border-l-[3px] bg-panel-2 p-3 text-xs leading-normal",
            "animate-[fadeIn_180ms_ease-out_forwards]",
            t.type === "success" && "border-l-ok",
            t.type === "error" && "border-l-accent",
            t.type === "warning" && "border-l-warn",
            t.type === "info" && "border-l-ink-dim"
          )}
        >
          <div className="mb-0.5 font-semibold text-ink">
            <span className="text-ink-dim">&gt; </span>
            {t.title}
          </div>
          {t.body && <div className="break-words text-ink-dim">{t.body}</div>}
        </div>
      ))}
      <style>{`@keyframes fadeIn { from { opacity:0; transform: translateX(16px);} to {opacity:1; transform:translateX(0);} }`}</style>
    </div>
  );
}