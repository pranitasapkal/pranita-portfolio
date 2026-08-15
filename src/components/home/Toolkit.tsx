/**
 * Toolkit — id="toolkit". THE WAYBILL section.
 * Light paper background (bg-paper text-paper-ink), rounded-t-[40px] transition
 * from dark. 8 Figma plugin cards in a 2×4 grid styled as printed spec-sheet rows.
 * "SPEC SHEET NO. 08" stamp in the corner.
 *
 * Stamp entrance (on first scroll-into-view, once):
 *   scale 1.6→1 + opacity 0→1 + rotation -8°→-2°, 380ms power4.out.
 *   At impact: a one-time 4px y-jitter on the section (2 keyframes).
 *   Reduced-motion: stamp shown at final resting state, no animation.
 */
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { withReducedMotion } from '../../lib/motion'
import { site } from '../../content/site'
import type { Plugin, PluginCategory } from '../../content/site'

// Amber = AUDIT/ENFORCE/GENERATE/SYNC; teal = CHECK/SPEC
const CATEGORY_STYLE: Record<PluginCategory, string> = {
  AUDIT:    'border-[rgba(255,181,71,0.35)] text-[#b07b20]',
  ENFORCE:  'border-[rgba(255,181,71,0.35)] text-[#b07b20]',
  CHECK:    'border-[rgba(98,217,201,0.35)]  text-[#2a7a70]',
  GENERATE: 'border-[rgba(255,181,71,0.35)] text-[#b07b20]',
  SPEC:     'border-[rgba(98,217,201,0.35)]  text-[#2a7a70]',
  SYNC:     'border-[rgba(255,181,71,0.35)] text-[#b07b20]',
}

function PluginCard({ plugin, index }: { plugin: Plugin; index: number }) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <div className="flex flex-col gap-2 py-5 px-4 border-b border-[rgba(22,24,29,0.1)] last:border-b-0">
      {/* Row: number + name + category chip */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <span className="font-mono text-[10px] text-paper-mute tabular-nums shrink-0">{num}</span>
          <span className="font-mono text-[11px] font-medium text-paper-ink tracking-wider leading-snug">
            {plugin.name}
          </span>
        </div>
        <span
          className={`shrink-0 font-mono text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 ${CATEGORY_STYLE[plugin.category]}`}
        >
          {plugin.category}
        </span>
      </div>
      {/* One-liner */}
      <p className="font-body text-xs text-paper-mute leading-relaxed pl-7">
        {plugin.oneLiner}
      </p>
    </div>
  )
}

export function Toolkit() {
  const sectionRef = useRef<HTMLElement>(null)
  const stampRef   = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const stamp   = stampRef.current
      const section = sectionRef.current
      if (!stamp || !section) return

      withReducedMotion(
        // ── Motion branch ──
        () => {
          // Set initial (pre-animation) state — overrides the CSS rotate(-2deg)
          gsap.set(stamp, { scale: 1.6, opacity: 0, rotation: -8, transformOrigin: 'center center' })

          ScrollTrigger.create({
            trigger: stamp,
            start: 'top 82%',
            once: true,
            onEnter: () => {
              // Stamp lands: scale + fade + settle rotation
              gsap.to(stamp, {
                scale: 1,
                opacity: 1,
                rotation: -2,
                duration: 0.38,
                ease: 'power4.out',
              })

              // Impact jitter on the section — 4px y bounce, 2 keyframes
              gsap.to(section, {
                keyframes: [
                  { y: 4,  duration: 0.06, ease: 'power2.out' },
                  { y: 0,  duration: 0.18, ease: 'power2.inOut' },
                ],
              })
            },
          })
        },
        // ── Reduced-motion branch: render at final resting state ──
        () => {
          gsap.set(stamp, { scale: 1, opacity: 1, rotation: -2, transformOrigin: 'center center' })
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="toolkit"
      ref={sectionRef}
      className="relative bg-paper text-paper-ink rounded-t-[40px] -mt-1 pt-20 pb-24 px-6 md:px-12"
      style={{ boxShadow: '0 -2px 0 rgba(237,239,243,0.06)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Paper-variant section label */}
        <div className="inline-flex items-center gap-3 mb-14">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(22,24,29,0.08)] border border-[rgba(22,24,29,0.15)] font-mono text-xs text-paper-mute shrink-0">
            {site.toolkit.sectionNumber}
          </span>
          <span className="flex items-center gap-2">
            <span className="font-mono text-paper-mute text-xs">/</span>
            <span className="font-mono text-xs tracking-widest uppercase text-paper-mute border border-[rgba(22,24,29,0.15)] rounded-full px-3 py-0.5">
              {site.toolkit.sectionLabel}
            </span>
          </span>
        </div>

        {/* Headline */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16 items-end">
          <div>
            <h2 className="font-display font-black text-3xl md:text-5xl text-paper-ink leading-tight tracking-tight">
              {site.toolkit.headline}
            </h2>
            <p className="font-serif italic text-paper-mute mt-4 text-lg md:text-xl leading-relaxed max-w-md">
              {site.toolkit.subline}
            </p>
          </div>

          {/* Spec-sheet stamp — animated on first scroll-into-view */}
          <div className="hidden md:flex justify-end items-end pb-1">
            <div
              ref={stampRef}
              className="relative inline-flex flex-col items-center justify-center border-2 border-[rgba(22,24,29,0.18)] rounded px-5 py-3"
              aria-hidden="true"
            >
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-paper-mute">
                {site.toolkit.stamp.top}
              </span>
              <span className="font-display font-black text-4xl text-paper-ink leading-none whitespace-nowrap">
                {site.toolkit.stamp.number}
              </span>
              <span className="font-mono text-[8px] tracking-[0.15em] text-paper-mute mt-1">
                {site.toolkit.stamp.bottom}
              </span>
            </div>
          </div>
        </div>

        {/* 2×4 plugin grid */}
        <div
          className="grid md:grid-cols-2 gap-0 border border-[rgba(22,24,29,0.12)] rounded-xl overflow-hidden"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(22,24,29,0.04) 0px, rgba(22,24,29,0.04) 1px, transparent 1px, transparent 40px)',
          }}
        >
          {site.toolkit.plugins.map((plugin, i) => (
            <PluginCard key={plugin.name} plugin={plugin} index={i} />
          ))}
        </div>

        {/* Footnote */}
        <p className="font-mono text-[10px] text-paper-mute mt-6 text-center tracking-wider">
          {site.toolkit.footnote.text}{' '}
          <code className="bg-[rgba(22,24,29,0.06)] rounded px-1">
            {site.toolkit.footnote.code}
          </code>
        </p>
      </div>
    </section>
  )
}
