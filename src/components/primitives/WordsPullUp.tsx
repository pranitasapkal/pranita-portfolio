/**
 * Headline reveal: splits children string by spaces, each word in an
 * overflow-hidden span, slides up y:24→0 staggered 0.06s on mount.
 * ScrollTrigger once:true triggers when element enters viewport.
 *
 * A11y: aria-label with full text on wrapper, word spans aria-hidden.
 */
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'
import { EASE, DURATIONS } from '../../lib/motion'

interface WordsPullUpProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  className?: string
  delay?: number
}

export function WordsPullUp({
  children,
  as: Tag = 'h2',
  className = '',
  delay = 0,
}: WordsPullUpProps) {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = containerRef.current
      if (!el) return

      const wordEls = el.querySelectorAll<HTMLSpanElement>('[data-word]')
      if (!wordEls.length) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(wordEls, {
          y: 24,
          opacity: 0,
          duration: DURATIONS.reveal,
          ease: EASE,
          stagger: 0.06,
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(wordEls, { y: 0, opacity: 1 })
      })
    },
    { scope: containerRef, dependencies: [children, delay] },
  )

  const words = children.split(' ')

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={`flex flex-wrap gap-x-[0.3em] gap-y-0 ${className}`}
      aria-label={children}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block leading-none" style={{ paddingBottom: '0.1em' }}>
          <span data-word aria-hidden="true" className="inline-block">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  )
}
