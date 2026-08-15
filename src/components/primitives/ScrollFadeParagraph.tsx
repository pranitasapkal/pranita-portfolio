/**
 * Per-word scroll-linked opacity fade: 0.2 → 1 as text scrolls into view.
 * ScrollTrigger scrub between 'start 0.8' and 'end 0.35'.
 * A11y: wrapper aria-label with full text, word spans aria-hidden.
 */
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'

interface ScrollFadeParagraphProps {
  children: string
  className?: string
}

export function ScrollFadeParagraph({ children, className = '' }: ScrollFadeParagraphProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const el = containerRef.current
      if (!el) return
      const wordEls = el.querySelectorAll<HTMLSpanElement>('[data-word]')
      if (!wordEls.length) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          wordEls,
          { opacity: 0.2 },
          {
            opacity: 1,
            stagger: 0.02,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              end: 'bottom 35%',
              scrub: true,
            },
          },
        )
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(wordEls, { opacity: 1 })
      })
    },
    { scope: containerRef, dependencies: [children] },
  )

  const words = children.split(' ')

  return (
    <p
      ref={containerRef}
      className={`flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`}
      aria-label={children}
    >
      {words.map((word, i) => (
        <span key={i} data-word aria-hidden="true" className="inline-block opacity-20">
          {word}
        </span>
      ))}
    </p>
  )
}
