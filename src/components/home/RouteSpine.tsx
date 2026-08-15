/**
 * RouteSpine — scroll-drawn vertical dashed path fixed along the left edge.
 * Wayfinding thread: draws from top as page scrolls, node dots activate at
 * section boundaries. Hidden below lg (1024px).
 *
 * Motion: stroke-dashoffset scrubbed by ScrollTrigger (trigger: body).
 * Reduced-motion: spine fully drawn, all dots active at load.
 * Touch / mobile: element hidden via Tailwind hidden lg:block.
 */
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { withReducedMotion } from '../../lib/motion'

// Section IDs to query for node dot placement.
const SECTION_IDS = ['#work', '#toolkit', '#process', '#contact'] as const

// Dot y positions in viewBox units (0–800). Dot 0 = page top; remaining 4
// correspond to the four section boundaries.
// These are set as approximate ratios; they also serve as the scroll-progress
// thresholds at which each dot activates.
const VIEWBOX_H = 800
const DOT_VY = [12, 160, 360, 544, 716] as const  // 5 dots

export function RouteSpine() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dotRefs = useRef<(SVGCircleElement | null)[]>([])

  useGSAP(() => {
    const path = pathRef.current
    if (!path) return

    const totalLength = path.getTotalLength()

    // Compute section progress thresholds from live DOM (once at mount).
    // Each value is the scroll progress (0–1) at which that section enters.
    const computeThresholds = (): number[] => {
      const docH = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        1,
      )
      const thresholds: number[] = [0] // dot 0 = top of page, always active
      SECTION_IDS.forEach((id) => {
        const el = document.querySelector(id) as HTMLElement | null
        thresholds.push(el ? el.offsetTop / docH : 0)
      })
      return thresholds
    }

    withReducedMotion(
      // ── Motion branch ──
      () => {
        // Start fully hidden
        gsap.set(path, { strokeDasharray: totalLength, strokeDashoffset: totalLength })

        // All dots start dim
        dotRefs.current.forEach((dot) => {
          if (dot) {
            dot.setAttribute('fill', 'rgba(155,163,176,0.35)')
            dot.setAttribute('r', '2')
          }
        })

        const thresholds = computeThresholds()

        ScrollTrigger.create({
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress
            // Draw the spine
            gsap.set(path, { strokeDashoffset: totalLength * (1 - p) })
            // Activate dots whose threshold has been passed
            dotRefs.current.forEach((dot, i) => {
              if (!dot) return
              const threshold = thresholds[i] ?? DOT_VY[i] / VIEWBOX_H
              if (p >= threshold) {
                dot.setAttribute('fill', 'var(--color-signal)')
                dot.setAttribute('r', '3')
              } else {
                dot.setAttribute('fill', 'rgba(155,163,176,0.35)')
                dot.setAttribute('r', '2')
              }
            })
          },
        })
      },
      // ── Reduced-motion branch: fully drawn, all dots lit ──
      () => {
        gsap.set(path, { strokeDasharray: totalLength, strokeDashoffset: 0 })
        dotRefs.current.forEach((dot) => {
          if (!dot) return
          dot.setAttribute('fill', 'var(--color-signal)')
          dot.setAttribute('r', '3')
        })
      },
    )
  })

  return (
    <div
      ref={containerRef}
      className="fixed left-5 top-0 h-screen z-10 hidden lg:block pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        width="12"
        viewBox={`0 0 12 ${VIEWBOX_H}`}
        preserveAspectRatio="none"
        style={{ height: '100%', width: '12px', overflow: 'visible' }}
      >
        {/* Dashed spine path */}
        <path
          ref={pathRef}
          d={`M 6 ${DOT_VY[0] + 6} L 6 ${DOT_VY[DOT_VY.length - 1] - 6}`}
          stroke="var(--color-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 8"
          fill="none"
        />

        {/* Node dots — one per section boundary */}
        {DOT_VY.map((vy, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={6}
            cy={vy}
            r={2}
            fill="rgba(155,163,176,0.35)"
          />
        ))}
      </svg>
    </div>
  )
}
