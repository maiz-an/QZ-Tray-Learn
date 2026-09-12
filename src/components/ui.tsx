import React from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------
 * Spinner — the tiny circle used inside loading buttons
 * ----------------------------------------------------------------- */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-3 w-3 flex-none rounded-full border-2 border-current border-t-transparent animate-spin-fast",
        className
      )}
    />
  );
}

/* -----------------------------------------------------------------
 * Button
 * ----------------------------------------------------------------- */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "ghost",
  loading,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm border px-4 py-2.5 text-[12.5px] font-semibold tracking-[.03em] transition",
        variant === "primary"
          ? "border-accent bg-accent text-void hover:border-accent-glow hover:bg-accent-glow"
          : "border-line bg-panel-2 text-ink hover:border-accent-dim hover:bg-[#241210]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
    >
      {loading && <Spinner />}
      <span className={cn(loading && "opacity-40")}>{children}</span>
    </button>
  );
}

/* -----------------------------------------------------------------
 * Skeleton bar
 * ----------------------------------------------------------------- */
export function SkeletonBar({
  className,
  onWhite
}: {
  className?: string;
  onWhite?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-sm",
        onWhite ? "skeleton-bar skeleton-bar-on-white" : "skeleton-bar",
        className
      )}
    />
  );
}

/* -----------------------------------------------------------------
 * Loading note — small spinner + caption
 * ----------------------------------------------------------------- */
export function LoadingNote({
  text = "connecting to QZ Tray…"
}: {
  text?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1 text-xs text-ink-dim">
      <span className="h-2.5 w-2.5 flex-none rounded-full border-2 border-accent-dim border-t-accent-glow animate-spin-slow" />
      {text}
    </div>
  );
}

/* -----------------------------------------------------------------
 * Section heading with trailing rule
 * ----------------------------------------------------------------- */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[.14em] text-ink-dim">
      <span>{children}</span>
      <span className="h-px flex-1 bg-line-dim" />
    </div>
  );
}