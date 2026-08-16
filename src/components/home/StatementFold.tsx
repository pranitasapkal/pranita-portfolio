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
        gsap.set(tailRef.current, { rotation: -4, svgOrigin: '236 166' })
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
        <ellipse cx="172" cy="188" rx="104" ry="8" fill="#9a94c4" opacity="0.35" />

        {/* tail curled on the ground, separate layer — wags around (236,166) */}
        <g ref={tailRef}>
          <path
            d="M236 168 C262 174 286 164 294 148 C299 138 291 129 283 134"
            fill="none"
            stroke="#454c66"
            strokeWidth="13"
            strokeLinecap="round"
          />
        </g>

        {/* sitting body — haunches + chest tapering up to the head */}
        <ellipse cx="196" cy="154" rx="48" ry="36" fill="#454c66" />
        <ellipse cx="180" cy="124" rx="33" ry="42" fill="#454c66" />
        {/* hind paw peeking */}
        <ellipse cx="222" cy="184" rx="16" ry="8" fill="#3a4058" />
        {/* straight front leg */}
        <rect x="168" y="146" width="15" height="42" rx="7.5" fill="#3a4058" />
        <ellipse cx="175.5" cy="186" rx="10" ry="6" fill="#3a4058" />
        {/* playing paw, resting on the wool */}
        <path
          d="M162 146 Q150 154 141 161"
          fill="none"
          stroke="#454c66"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle cx="139" cy="163" r="8.5" fill="#3a4058" />

        {/* woolen ball + loose thread */}
        <circle cx="124" cy="172" r="17" fill="#e8a0b4" />
        <g stroke="#d17f98" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M110 165 Q124 158 138 165" />
          <path d="M108 174 Q124 168 140 174" />
          <path d="M112 181 Q124 176 136 181" />
          <path d="M117 158 Q112 172 118 187" />
          <path d="M131 158 Q136 172 130 187" />
        </g>
        <path
          d="M108 178 C92 184 78 180 64 187 C58 190 54 186 58 183"
          fill="none"
          stroke="#e8a0b4"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="0.1 6"
        />

        {/* ears */}
        <path d="M152 58 Q146 28 154 24 Q168 26 180 42 Z" fill="#454c66" />
        <path d="M208 58 Q214 28 206 24 Q192 26 180 42 Z" fill="#454c66" />
        <path d="M157 50 Q153 34 157 32 Q166 35 172 43 Z" fill="#2b3147" />
        <path d="M203 50 Q207 34 203 32 Q194 35 188 43 Z" fill="#2b3147" />

        {/* big round head */}
        <circle cx="180" cy="80" r="42" fill="#454c66" />

        {/* happy closed eyes */}
        <path d="M154 79 q10 -12 20 0" fill="none" stroke="#dce1f0" strokeWidth="5" strokeLinecap="round" />
        <path d="M186 79 q10 -12 20 0" fill="none" stroke="#dce1f0" strokeWidth="5" strokeLinecap="round" />
        {/* nose + smile */}
        <path d="M175.5 87 Q180 84 184.5 87 Q184.5 92 180 94.5 Q175.5 92 175.5 87 Z" fill="#e8a0b4" />
        <path d="M171 97 q4.5 5 9 0 q4.5 5 9 0" fill="none" stroke="#dce1f0" strokeWidth="2.6" strokeLinecap="round" />
        {/* blush */}
        <ellipse cx="150" cy="91" rx="8" ry="4.5" fill="#e8a0b4" opacity="0.7" />
        <ellipse cx="210" cy="91" rx="8" ry="4.5" fill="#e8a0b4" opacity="0.7" />
        {/* whiskers */}
        <g stroke="#9aa0b8" strokeWidth="1.4" strokeLinecap="round" opacity="0.65">
          <line x1="142" y1="80" x2="124" y2="77" />
          <line x1="142" y1="87" x2="125" y2="90" />
          <line x1="218" y1="80" x2="236" y2="77" />
          <line x1="218" y1="87" x2="235" y2="90" />
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
