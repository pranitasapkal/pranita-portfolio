/**
 * SceneFallback — static India-network SVG backdrop.
 * Rendered when: prefers-reduced-motion, viewport <768 px, or WebGL unavailable.
 * Extracted from Hero.tsx Phase 5; kept 1-to-1 identical so the fallback
 * matches the poster frame the 3D scene fades in from.
 */
export function SceneFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Radial signal-tinted glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 72% 62% at 28% 54%, rgba(255,181,71,0.052) 0%, transparent 68%)',
        }}
      />
      {/* Arc keyframes */}
      <style>{`
        @keyframes arc-dash { to { stroke-dashoffset: -28; } }
        .arc-slow  { animation: arc-dash 15s linear infinite; }
        .arc-mid   { animation: arc-dash  9s linear infinite; }
        .arc-fast  { animation: arc-dash  6s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .arc-slow,.arc-mid,.arc-fast { animation: none; }
        }
      `}</style>
      {/* Network texture: sort-centre nodes + route arcs */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="142" cy="224" r="3.5" fill="#ffb547" opacity="0.8" />
        <circle cx="388" cy="118" r="2.5" fill="#9ba3b0" opacity="0.7" />
        <circle cx="720" cy="270" r="3"   fill="#ffb547" opacity="0.6" />
        <circle cx="260" cy="440" r="2"   fill="#9ba3b0" opacity="0.55" />
        <circle cx="560" cy="520" r="2.5" fill="#62d9c9" opacity="0.45" />
        <circle cx="940" cy="360" r="2.5" fill="#9ba3b0" opacity="0.55" />
        <circle cx="1120" cy="200" r="3"  fill="#ffb547" opacity="0.45" />
        <circle cx="1280" cy="450" r="2"  fill="#9ba3b0" opacity="0.4" />
        <circle cx="820"  cy="640" r="2"  fill="#9ba3b0" opacity="0.35" />
        <path d="M142 224 Q265 150 388 118"    stroke="#ffb547" strokeWidth="0.9" strokeDasharray="4 7" className="arc-slow" />
        <path d="M388 118 Q554 180 720 270"    stroke="#9ba3b0" strokeWidth="0.75" strokeDasharray="3 8" className="arc-mid" />
        <path d="M142 224 Q201 332 260 440"    stroke="#9ba3b0" strokeWidth="0.75" strokeDasharray="4 7" className="arc-slow" />
        <path d="M260 440 Q410 480 560 520"    stroke="#62d9c9" strokeWidth="0.8"  strokeDasharray="3 9" className="arc-fast" />
        <path d="M720 270 Q830 315 940 360"    stroke="#9ba3b0" strokeWidth="0.75" strokeDasharray="4 7" className="arc-mid" />
        <path d="M940 360 Q1030 280 1120 200"  stroke="#ffb547" strokeWidth="0.9"  strokeDasharray="3 8" className="arc-slow" />
        <path d="M560 520 Q750 440 940 360"    stroke="#9ba3b0" strokeWidth="0.6"  strokeDasharray="4 9" className="arc-mid" />
        <path d="M1120 200 Q1200 325 1280 450" stroke="#9ba3b0" strokeWidth="0.7"  strokeDasharray="3 8" className="arc-slow" />
        <path d="M720 270 Q770 455 820 640"    stroke="#9ba3b0" strokeWidth="0.6"  strokeDasharray="4 8" className="arc-fast" />
      </svg>
    </div>
  )
}
