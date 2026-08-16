/**
 * StatementFold — the manifesto fold (Divesh ref). Centered grotesk lines
 * revealed sequentially on scroll, closed by a handwritten signature.
 * Same dark surface as the hero (`.force-dark`), not the pitch-black band,
 * and sized to fit inside one viewport including the signature.
 *
 * Corner illustration (Manav, 2026-08-16): his white line-art pour-over scene
 * as a transparent PNG (public/home/pourover-lineart.png), doubled in size
 * per his call — replaces the self-drawn SVG and its tail-wag tween.
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
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 right-[2%] w-[340px] md:w-[420px] pointer-events-none select-none"
    >
      <img
        src="/home/pourover-lineart.png"
        alt=""
        width={1161}
        height={1354}
        loading="lazy"
        draggable={false}
        className="w-full h-auto"
      />
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
