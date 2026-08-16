/**
 * StatementFold — the manifesto fold (Divesh ref). Centered grotesk lines
 * revealed sequentially on scroll, closed by a handwritten signature.
 * Same dark surface as the hero (`.force-dark`), not the pitch-black band,
 * and sized to fit inside one viewport including the signature.
 *
 * Corner illustration (Manav's ref, 2026-08-16): pour-over coffee scene with
 * a cat tucked under her arm — self-drawn white line-art, no background. The
 * cat's hanging tail is its own path rotating around its body anchor
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
        // Pivot where the hanging tail leaves the cat's body.
        gsap.set(tailRef.current, { rotation: -4, svgOrigin: '244 152' })
        gsap.to(tailRef.current, {
          rotation: 5,
          duration: 1.1,
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
      <svg viewBox="0 0 340 240" className="w-full h-auto">
        {/* ── table + pour-over kit, all white line-work ── */}
        <g stroke="#edeff3" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 190 H166" />
          <path d="M18 190 V236" />
          <path d="M152 190 V236" />
          {/* coffee bag */}
          <path d="M24 190 V158 L30 148 H44 L50 158 V190" />
          <path d="M30 148 L32 141 H42 L44 148" />
          {/* hand grinder */}
          <path d="M60 190 V164 H78 V190" />
          <path d="M60 172 H78" />
          <path d="M69 164 V155 Q69 150 76 150 Q84 151 84 157" />
          <circle cx="85" cy="160" r="2.5" />
          {/* mug */}
          <path d="M92 190 V174 H108 V190" />
          <path d="M108 177 Q115 177 113 183 Q112 188 108 187" />
          {/* dripper on carafe */}
          <path d="M118 152 H150 L143 167 H125 Z" />
          <path d="M120 190 V175 Q120 170 125 170 H143 Q148 170 148 175 V190" />
          <path d="M148 176 Q156 176 154 182 Q153 187 148 186" />
          <path d="M126 185 H142" strokeWidth="4.5" />
        </g>
        {/* pour stream */}
        <path
          d="M138 140 Q137 146 136 151"
          stroke="#edeff3"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="1 5"
        />

        {/* ── her: hair and bun are the only filled shapes ── */}
        <path
          d="M208 46 Q206 26 228 22 Q254 19 258 42 Q260 54 253 63 Q252 48 240 45 Q224 41 215 51 Q209 57 211 66 Q205 57 208 46 Z"
          fill="#edeff3"
        />
        <circle cx="254" cy="31" r="11" fill="#edeff3" />
        <g stroke="#edeff3" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* profile, jaw, ear hint */}
          <path d="M212 62 Q209 73 215 81 Q221 87 230 85" />
          <path d="M218 66 h5" strokeWidth="2.5" />
          {/* neck into shoulders */}
          <path d="M233 85 Q234 92 239 96" />
          {/* tee — billowy back and open front */}
          <path d="M239 96 Q270 102 274 132 Q277 164 268 198" />
          <path d="M224 90 Q200 98 195 122 Q193 134 199 144" />
          {/* hem */}
          <path d="M199 198 Q234 206 268 198" />
          <path d="M199 144 Q197 172 199 198" />
          {/* pouring arm reaching the kettle */}
          <path d="M216 108 Q194 110 181 118" />
          <path d="M218 122 Q200 125 187 129" />
          <path d="M181 118 Q174 121 178 127 L187 129" />
        </g>
        {/* legs */}
        <g stroke="#edeff3" strokeWidth="9" strokeLinecap="round">
          <path d="M218 202 V234" />
          <path d="M250 202 V234" />
        </g>

        {/* kettle */}
        <g stroke="#edeff3" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M148 116 Q144 138 158 141 Q174 143 178 128 Q180 119 174 113 Z" />
          <path d="M150 119 Q136 122 134 134" />
          <path d="M156 110 Q164 100 176 108" />
          <circle cx="166" cy="103" r="2.5" />
        </g>

        {/* the cat, tucked under her left arm */}
        <g stroke="#edeff3" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="206" cy="136" r="12" />
          <path d="M198 127 L195 120 L202 123" />
          <path d="M212 126 L214 119 L218 124" />
          <path d="M202 136 h3 M211 136 h3" strokeWidth="2.5" />
          <path d="M205 141 q2 2 4 0" strokeWidth="2.5" />
          {/* body under the forearm, arm line over it */}
          <path d="M217 130 Q238 124 246 138 Q250 146 244 151" />
          <path d="M220 128 Q236 133 245 129" />
          {/* hanging front paws */}
          <path d="M204 149 v11 M212 151 v11" />
        </g>
        {/* hanging tail — wags around (244,152) */}
        <g ref={tailRef}>
          <path
            d="M244 152 Q251 170 245 188 Q242 195 237 193"
            fill="none"
            stroke="#edeff3"
            strokeWidth="3"
            strokeLinecap="round"
          />
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
