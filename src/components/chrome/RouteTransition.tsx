/**
 * RouteTransition — 650ms crossfade dispatch overlay on pathname changes.
 *
 * Behaviour:
 *   - Watches useLocation().pathname. Hash-only changes (#work, #toolkit …)
 *     are intentionally ignored so navbar anchors are unaffected.
 *   - On pathname change: ink-0 overlay fades in (280ms) over the departing page
 *     while the new page renders underneath; then fades out (370ms).
 *   - A signal-coloured progress line sweeps left→right during cover.
 *   - Rapid successive navigations are safe: each new change resets in-flight
 *     timers and restarts the animation from scratch.
 *   - Reduced-motion: overlay is never shown; instant swap.
 *   - Browser back/forward: same pathname watch — behaves identically.
 *   - pointer-events restored to none immediately when reveal begins so
 *     interaction is never blocked past the cover phase.
 *
 * Mount: inside <BrowserRouter> in App.tsx (useLocation requires router context).
 */
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../lib/useMediaQuery'

export function RouteTransition() {
  const location = useLocation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const overlayRef = useRef<HTMLDivElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)

  // Skip the initial mount — no transition on first page load.
  const isFirst   = useRef(true)
  // Track previous pathname to ignore hash-only changes.
  const prevPath  = useRef(location.pathname)
  // Hold pending setTimeout IDs so we can cancel them on rapid nav.
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const pathname = location.pathname

    // Skip initial render
    if (isFirst.current) {
      isFirst.current = false
      prevPath.current = pathname
      return
    }

    // Skip hash-only changes (anchor navigation on the same page)
    if (pathname === prevPath.current) return
    prevPath.current = pathname

    // Skip under reduced motion — instant swap, no overlay
    if (prefersReducedMotion) return

    const overlay = overlayRef.current
    const line    = lineRef.current
    if (!overlay || !line) return

    // ── Reset any in-flight animation ──
    timers.current.forEach(clearTimeout)
    timers.current = []
    gsap.killTweensOf([overlay, line])

    // ── Initial state ──
    gsap.set(overlay, { opacity: 0 })
    gsap.set(line,    { scaleX: 0, transformOrigin: 'left center' })
    overlay.style.pointerEvents = 'all'

    // ── Cover phase: 280ms ──
    gsap.to(overlay, { opacity: 1, duration: 0.28, ease: 'power2.inOut' })
    gsap.to(line,    { scaleX: 1, duration: 0.28, ease: 'power2.inOut' })

    // ── Reveal phase: starts 30ms after cover completes ──
    timers.current.push(
      setTimeout(() => {
        // Release pointer-events immediately so the new page is interactive
        overlay.style.pointerEvents = 'none'

        gsap.to(overlay, {
          opacity: 0,
          duration: 0.37,
          ease: 'power2.inOut',
          onComplete: () => {
            // Reset line so it's ready for next transition
            gsap.set(line, { scaleX: 0 })
          },
        })
      }, 310), // 280ms cover + 30ms breathing room
    )

    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [location.pathname, prefersReducedMotion])

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-live="polite"
      aria-label="Navigating"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: 'var(--surface-0)',
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Signal progress line — sweeps left → right during cover */}
      <div
        ref={lineRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: 'var(--accent)',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
        }}
      />

    </div>
  )
}
