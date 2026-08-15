/**
 * useReveal — shared scroll-reveal (fade + rise) for editorial blocks (ADR-002).
 * Same motion as Board.tsx: gsap.matchMedia with a prefers-reduced-motion branch,
 * master ease cubic-bezier(0.65,0,0.35,1). No new motion vocabulary.
 */
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../../lib/gsap'

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'cubic-bezier(0.65,0,0.35,1)',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(el, { opacity: 1, y: 0 })
      })
    },
    { scope: ref },
  )

  return ref
}
