/**
 * StatementFold — the manifesto fold (Divesh ref). Centered grotesk lines
 * revealed sequentially on scroll, closed by a handwritten signature.
 * Same dark surface as the hero (`.force-dark`), not the pitch-black band,
 * and sized to fit inside one viewport including the signature.
 *
 * Corner cat (krritika ref): a self-drawn flat SVG in the cat0 palette. The
 * tail is its own vector path rotating around the exact rump anchor
 * (svgOrigin), so the joint is geometric and can never split.
 *
 * Reveal: each line fades/rises on its own ScrollTrigger. Reduced motion:
 * lines render fully visible and the tail holds still — everything animated
 * lives in the motion branch only.
 */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { EASE, withReducedMotion } from '../../lib/motion'
import { draft } from '../../content/site-v2-draft'

function CornerCat() {
  const tailRef = useRef<SVGGElement>(null)

  useGSAP(
    () => {
      const mm = withReducedMotion(() => {
        if (!tailRef.current) return
        // Pivot where the tail meets the rear, at ground height.
        gsap.set(tailRef.current, { rotation: -4, svgOrigin: '238 158' })
        gsap.to(tailRef.current, {
          rotation: 9,
          duration: 0.9,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
      return () => mm.revert()
    },
    { scope: tailRef },
  )

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 right-[3%] w-[170px] md:w-[210px] pointer-events-none select-none"
    >
      <svg viewBox="0 0 320 200" className="w-full h-auto">
        {/* ground shadow */}
        <ellipse cx="160" cy="186" rx="118" ry="9" fill="#9a94c4" opacity="0.35" />

        {/* tail on the ground, separate layer — wags around (238,158) */}
        <g ref={tailRef}>
          <path
            d="M238 160 C264 166 286 160 297 147 C303 139 297 130 289 134"
            fill="none"
            stroke="#454c66"
            strokeWidth="13"
            strokeLinecap="round"
          />
        </g>

        {/* loaf body on all fours */}
        <rect x="88" y="116" width="152" height="56" rx="28" fill="#454c66" />
        {/* legs */}
        <rect x="102" y="158" width="15" height="26" rx="7" fill="#3a4058" />
        <rect x="130" y="160" width="15" height="26" rx="7" fill="#454c66" />
        <rect x="188" y="160" width="15" height="26" rx="7" fill="#454c66" />
        <rect x="214" y="158" width="15" height="26" rx="7" fill="#3a4058" />

        {/* ears */}
        <path d="M58 84 Q52 54 60 50 Q74 52 86 68 Z" fill="#454c66" />
        <path d="M114 84 Q120 54 112 50 Q98 52 86 68 Z" fill="#454c66" />
        <path d="M63 76 Q59 60 63 58 Q72 61 78 69 Z" fill="#2b3147" />
        <path d="M109 76 Q113 60 109 58 Q100 61 94 69 Z" fill="#2b3147" />

        {/* big round head */}
        <circle cx="86" cy="106" r="42" fill="#454c66" />

        {/* happy closed eyes */}
        <path d="M60 105 q10 -12 20 0" fill="none" stroke="#dce1f0" strokeWidth="5" strokeLinecap="round" />
        <path d="M92 105 q10 -12 20 0" fill="none" stroke="#dce1f0" strokeWidth="5" strokeLinecap="round" />
        {/* nose + smile */}
        <path d="M81.5 113 Q86 110 90.5 113 Q90.5 118 86 120.5 Q81.5 118 81.5 113 Z" fill="#e8a0b4" />
        <path d="M77 123 q4.5 5 9 0 q4.5 5 9 0" fill="none" stroke="#dce1f0" strokeWidth="2.6" strokeLinecap="round" />
        {/* blush */}
        <ellipse cx="56" cy="117" rx="8" ry="4.5" fill="#e8a0b4" opacity="0.7" />
        <ellipse cx="116" cy="117" rx="8" ry="4.5" fill="#e8a0b4" opacity="0.7" />
        {/* whiskers */}
        <g stroke="#9aa0b8" strokeWidth="1.4" strokeLinecap="round" opacity="0.65">
          <line x1="48" y1="106" x2="30" y2="103" />
          <line x1="48" y1="113" x2="31" y2="116" />
          <line x1="124" y1="106" x2="142" y2="103" />
          <line x1="124" y1="113" x2="141" y2="116" />
        </g>
      </svg>
    </div>
  )
}

export function StatementFold() {
  const hostRef = useRef<HTMLElement>(null)
  const s = draft.statement

  useGSAP(
    () => {
      const mm = withReducedMotion(() => {
        const lines = hostRef.current?.querySelectorAll<HTMLElement>('[data-statement-line]')
        if (!lines?.length) return
        lines.forEach((line) => {
          gsap.set(line, { y: 30, opacity: 0 })
          gsap.to(line, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: EASE,
            scrollTrigger: { trigger: line, start: 'top 82%' },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: hostRef },
  )

  // Grid-paper backdrop, carried over from the desk-scene hero experiment.
  // Slightly dimmer than --line-soft so it stays a texture, not a pattern.
  const GRID_BG: React.CSSProperties = {
    backgroundImage:
      'linear-gradient(rgba(242,242,243,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,243,0.07) 1px, transparent 1px)',
    backgroundSize: '56px 56px',
  }

  return (
    <section
      ref={hostRef}
      aria-label={s.ariaLabel}
      className="force-dark bg-surface-0 relative"
      style={GRID_BG}
    >
      <div className="max-w-[760px] mx-auto px-6 md:px-12 py-20 md:py-24 flex flex-col items-center gap-6 md:gap-7 text-center">
        {s.lines.map((line, i) => (
          <p
            key={i}
            data-statement-line
            className={`font-sans text-strong leading-snug ${
              i === s.lines.length - 1
                ? 'text-[clamp(1.25rem,2vw,1.7rem)] font-semibold'
                : 'text-[clamp(1.1rem,1.7vw,1.45rem)] font-medium'
            }`}
          >
            {line}
          </p>
        ))}
        <p
          data-statement-line
          aria-hidden="true"
          className="font-hand text-soft text-[clamp(1.9rem,3vw,2.6rem)] -rotate-3 mt-2"
        >
          {s.signature}
        </p>
      </div>
      <CornerCat />
    </section>
  )
}
