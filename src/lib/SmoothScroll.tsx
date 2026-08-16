/**
 * Lenis smooth-scroll provider.
 * - Single instance per app, driven by gsap.ticker (lagSmoothing = 0).
 * - lenis.on('scroll', ScrollTrigger.update) keeps ScrollTrigger in sync.
 * - Completely disabled (native scroll) under prefers-reduced-motion.
 * - Cleans up lenis instance + ticker callback on unmount.
 */
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { usePrefersReducedMotion } from './useMediaQuery'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    // Native scroll under reduced motion — don't instantiate Lenis at all.
    // Reactive: toggling the preference mid-session tears Lenis down (or brings
    // it back) instead of leaving smooth scroll running against the user's wish.
    if (prefersReducedMotion) return

    const lenis = new Lenis()
    lenisRef.current = lenis

    // Keep ScrollTrigger in sync with Lenis scroll position.
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis via GSAP ticker so both run on the same frame.
    gsap.ticker.lagSmoothing(0)
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerFn)

    return () => {
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [prefersReducedMotion])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
