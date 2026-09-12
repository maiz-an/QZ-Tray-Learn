import React from "react";

export function Background() {
  return (
    <>
      <svg
        className="pointer-events-none fixed inset-0 z-0 opacity-55"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="fade" cx="0" cy="0" r="1">
            <stop offset="0%" stopColor="#3a1512" stopOpacity=".9" />
            <stop offset="100%" stopColor="#3a1512" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke="url(#fade)" strokeWidth="0.3" fill="none" vectorEffect="non-scaling-stroke">
          <line x1="0" y1="0" x2="42" y2="0" />
          <line x1="0" y1="0" x2="0" y2="42" />
          <line x1="0" y1="0" x2="30" y2="6" />
          <line x1="0" y1="0" x2="6" y2="30" />
          <line x1="0" y1="0" x2="20" y2="20" />
          <path d="M 4 0 Q 6 6 0 4" />
          <path d="M 11 0 Q 14 14 0 11" />
          <path d="M 20 0 Q 24 24 0 20" />
          <path d="M 32 0 Q 36 36 0 32" />
        </g>
        <g
          stroke="url(#fade)"
          strokeWidth="0.3"
          fill="none"
          transform="translate(100,100) rotate(180)"
          vectorEffect="non-scaling-stroke"
        >
          <line x1="0" y1="0" x2="42" y2="0" />
          <line x1="0" y1="0" x2="0" y2="42" />
          <line x1="0" y1="0" x2="30" y2="6" />
          <line x1="0" y1="0" x2="6" y2="30" />
          <line x1="0" y1="0" x2="20" y2="20" />
          <path d="M 4 0 Q 6 6 0 4" />
          <path d="M 11 0 Q 14 14 0 11" />
          <path d="M 20 0 Q 24 24 0 20" />
          <path d="M 32 0 Q 36 36 0 32" />
        </g>
      </svg>
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay"
        }}
      />
    </>
  );
}