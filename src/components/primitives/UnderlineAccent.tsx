/**
 * UnderlineAccent — hand-drawn accent stroke under one word (Sandeep ref).
 * Draws on when scrolled into view; reduced motion renders it already drawn.
 * Wraps the word so the stroke tracks the word's own width.
 */
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { EASE, withReducedMotion } from '../../lib/motion'

interface UnderlineAccentProps {
  children: ReactNode
  /** 'accent' = blue on light surfaces; 'band' = light blue on the dark folds. */
  tone?: 'accent' | 'band'
}

export function UnderlineAccent({ children, tone = 'accent' }: UnderlineAccentProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const hostRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const path = pathRef.current
      if (!path) return
      const len = path.getTotalLength()
      const mm = withReducedMotion(() => {
        path.style.strokeDasharray = `${len}`
        path.style.strokeDashoffset = `${len}`
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: EASE,
          delay: 0.35,
          scrollTrigger: { trigger: hostRef.current, start: 'top 85%' },
        })
      })
      // Reduced branch intentionally absent: dasharray is never set, so the
      // stroke renders fully drawn from the first paint.
      return () => mm.revert()
    },
    { scope: hostRef },
  )

  const stroke = tone === 'band' ? 'var(--color-band-accent)' : 'var(--accent)'

  return (
    <span ref={hostRef} className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        className="absolute left-0 -bottom-[0.12em] w-full h-[0.22em] overflow-visible"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M2 9 Q 28 3.5, 52 7 T 98 6"
          fill="none"
          stroke={stroke}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
