/**
 * Hero — full-viewport opening section.
 *
 * Phase 6: 3D network hero.
 * - Outer section is ~150vh so ScrollTrigger has room to dolly the camera.
 * - Inner sticky div (h-screen) holds all visible content; camera rig runs
 *   inside the Canvas and scrubs against the outer section's scroll progress.
 * - NetworkScene is lazy-loaded (three.js stays in its own chunk).
 * - SceneFallback (static SVG) shown when: prefers-reduced-motion, <768 px,
 *   or WebGL unavailable; also used as Suspense placeholder while chunk loads.
 * - Entrance choreography fires after the Loader dispatches 'loader:done'
 *   (or after a 2.6 s fallback). Name words pull up, subline + stats fade in,
 *   canvas fades from 0 → 1 over 1200 ms.
 *
 * HeroBackdrop is kept as a named export for backwards-compatibility.
 */
import { lazy, Suspense, useRef, useState, useEffect, useLayoutEffect, Component, Fragment } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { MagneticWrap } from '../primitives/MagneticWrap'
import { Asterisk }     from '../primitives/Asterisk'
import { StatCallout }  from '../primitives/StatCallout'
import { SceneFallback } from '../three/SceneFallback'
import { gsap }          from '../../lib/gsap'
import { EASE, DURATIONS } from '../../lib/motion'
import { site }           from '../../content/site'

const NetworkScene = lazy(() => import('../three/NetworkScene'))

// ── WebGL Error Boundary — falls back to SceneFallback on R3F / GL errors ─────
interface EBState { failed: boolean }
class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, EBState> {
  state: EBState = { failed: false }
  static getDerivedStateFromError(): EBState { return { failed: true } }
  componentDidCatch(err: Error, info: ErrorInfo) {
    // Surface to console in dev; swallow in prod (scene silently becomes SVG)
    if (import.meta.env.DEV) console.warn('[NetworkScene] WebGL error boundary caught:', err, info)
  }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

// ── Fallback / backwards-compat export ────────────────────────────────────────
export function HeroBackdrop() {
  return <SceneFallback />
}

// ── Portrait placeholder ──────────────────────────────────────────────────────
interface PortraitPlaceholderProps {
  width?: number
  height?: number
  radius?: string
}
function PortraitPlaceholder({ width = 200, height = 258, radius = '28px' }: PortraitPlaceholderProps) {
  return (
    <div
      className="flex flex-col items-center justify-center bg-ink-2 border border-line overflow-hidden select-none"
      style={{ width, height, borderRadius: radius }}
      role="img"
      aria-label={site.hero.portraitAlt}
    >
      <div className="w-10 h-10 rounded-full border border-line mb-2" aria-hidden="true" />
      <div className="w-14 h-8 rounded-t-full border-t border-x border-line" aria-hidden="true" />
      <span className="font-mono text-[10px] text-text-lo tracking-[0.25em] uppercase mt-4">
        {site.hero.portraitPlaceholderLabel}
      </span>
    </div>
  )
}

// ── Scroll cue ────────────────────────────────────────────────────────────────
function ScrollCue({ innerRef }: { innerRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={innerRef} className="flex items-center gap-3" aria-hidden="true">
      <style>{`
        @keyframes scroll-arc-anim { to { stroke-dashoffset: -20; } }
        .scroll-arc { animation: scroll-arc-anim 3s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .scroll-arc { animation: none; } }
      `}</style>
      <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 15 Q22 3 42 15"
          stroke="var(--color-text-lo)"
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeLinecap="round"
          className="scroll-arc"
        />
        <path
          d="M18 19 L22 21 L26 19"
          stroke="var(--color-text-lo)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-mono text-[10px] text-text-lo tracking-[0.3em] uppercase">
        {site.hero.scrollCue}
      </span>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export function Hero() {
  // Decide once on mount whether to show the 3D canvas.
  // Probe actual WebGL context creation — constructor presence alone isn't enough;
  // sandboxed or low-end environments may advertise the API but fail at runtime.
  const [showCanvas] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (window.innerWidth < 768) return false
    try {
      const probe = document.createElement('canvas')
      const gl = probe.getContext('webgl2') ?? probe.getContext('webgl')
      if (!gl) return false
      // Eagerly release the context to avoid consuming a GPU slot
      ;(gl as WebGLRenderingContext & { getExtension(n: string): { loseContext(): void } | null })
        .getExtension('WEBGL_lose_context')?.loseContext()
      return true
    } catch {
      return false
    }
  })

  // Refs: outer section (150vh) used as ScrollTrigger trigger
  const heroRef     = useRef<HTMLElement>(null)
  // Canvas wrapper — starts at opacity 0; Hero fades it in on loader:done (both 3D and SVG paths)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  // Text elements for entrance animation
  const h1Ref       = useRef<HTMLHeadingElement>(null)
  const sublineRef  = useRef<HTMLParagraphElement>(null)
  const statsRef    = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)

  // Set initial hidden state before first paint (prevents flash before loader fires)
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const words = h1Ref.current?.querySelectorAll<HTMLSpanElement>('[data-word]')
    if (words?.length) gsap.set(words, { y: 28, opacity: 0 })
    if (sublineRef.current)  gsap.set(sublineRef.current, { opacity: 0 })
    const stats = statsRef.current?.children
    if (stats?.length)       gsap.set(stats, { opacity: 0, y: 10 })
    if (scrollCueRef.current) gsap.set(scrollCueRef.current, { opacity: 0 })
  }, [])

  // Run entrance timeline on loader:done (or fallback timeout)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let fired = false

    const run = () => {
      if (fired) return
      fired = true

      // Always fade in the backdrop wrapper (covers both 3D and SVG fallback paths)
      if (canvasWrapRef.current) {
        canvasWrapRef.current.style.transition = 'opacity 1.2s cubic-bezier(0.65,0,0.35,1)'
        canvasWrapRef.current.style.opacity = '1'
      }

      if (reduced) return  // reduced-motion: text already visible (no gsap.set ran)

      const words = h1Ref.current?.querySelectorAll<HTMLSpanElement>('[data-word]')
      const tl = gsap.timeline()

      if (words?.length) {
        tl.to(words, {
          y: 0,
          opacity: 1,
          duration: DURATIONS.reveal,
          ease: EASE,
          stagger: 0.055,
        })
      }
      if (sublineRef.current) {
        tl.to(sublineRef.current, { opacity: 1, duration: 0.55, ease: EASE }, '-=0.28')
      }
      const stats = statsRef.current?.children
      if (stats?.length) {
        tl.to(stats, { opacity: 1, y: 0, duration: 0.5, ease: EASE, stagger: 0.07 }, '-=0.22')
      }
      if (scrollCueRef.current) {
        tl.to(scrollCueRef.current, { opacity: 1, duration: 0.4, ease: EASE }, '-=0.15')
      }
    }

    window.addEventListener('loader:done', run as EventListener)
    const fallback = setTimeout(run, 2600)
    return () => {
      window.removeEventListener('loader:done', run as EventListener)
      clearTimeout(fallback)
    }
  }, [])

  return (
    /* Outer section — 150 vh gives the ScrollTrigger room for the camera dolly.
       The inner sticky wrapper keeps all visible content pinned at the top. */
    <section
      ref={heroRef}
      style={{ minHeight: '150vh' }}
      aria-label={site.hero.sectionAriaLabel}
    >
      <div className="sticky top-0 h-screen bg-ink-0 flex flex-col justify-center overflow-hidden">

        {/* Ghost text — "THE NETWORK" at ~3% opacity behind everything.
            Barely-there on close inspection; never competes with the name.
            Shown in both 3D and SVG fallback paths (nice static treatment on mobile). */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
          <span
            className="font-display font-black uppercase text-text-hi"
            style={{
              fontSize: 'clamp(9vw, 18vw, 18vw)',
              opacity: 0.034,
              letterSpacing: '-0.025em',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {site.hero.ghost}
          </span>
        </div>

        {/* Backdrop: 3D scene (desktop/no-reduced-motion) OR static SVG */}
        <div
          ref={canvasWrapRef}
          className="absolute inset-0"
          style={{ opacity: 0, zIndex: 1 }}
          aria-hidden="true"
        >
          {showCanvas ? (
            <WebGLErrorBoundary fallback={<SceneFallback />}>
              <Suspense fallback={<SceneFallback />}>
                <NetworkScene heroRef={heroRef} wrapperRef={canvasWrapRef} />
              </Suspense>
            </WebGLErrorBoundary>
          ) : (
            <SceneFallback />
          )}
        </div>

        {/* Desktop portrait — absolute right, behind text layer */}
        <div className="absolute right-10 xl:right-16 top-1/2 -translate-y-[46%] hidden md:block z-10">
          <MagneticWrap strength={4}>
            <PortraitPlaceholder />
          </MagneticWrap>
        </div>

        {/* Main content */}
        <div className="relative z-20 px-6 md:px-12 pt-28 pb-36 w-full max-w-[1200px] mx-auto">
          {/* Mobile portrait */}
          <div className="md:hidden mb-8">
            <MagneticWrap strength={3}>
              <PortraitPlaceholder width={140} height={178} radius="20px" />
            </MagneticWrap>
          </div>

          {/* Giant name — words split for pull-up entrance */}
          <h1
            ref={h1Ref}
            className="font-display font-black uppercase text-text-hi leading-[0.88] tracking-tight"
            style={{ fontSize: 'clamp(3rem,11vw,11rem)' }}
            aria-label={site.hero.nameAriaLabel}
          >
            {site.hero.nameWords.map((word, i) => (
              <Fragment key={word}>
                {i > 0 && ' '}
                <span className="inline-block overflow-hidden" style={{ paddingBottom: '0.1em' }}>
                  <span data-word className="inline-block" aria-hidden="true">
                    {word}
                    {i === site.hero.nameWords.length - 1 && <Asterisk />}
                  </span>
                </span>
              </Fragment>
            ))}
          </h1>

          {/* Serif-italic subline */}
          <p
            ref={sublineRef}
            className="font-serif italic text-text-lo mt-5 md:mt-7 max-w-xl leading-relaxed"
            style={{ fontSize: 'clamp(1rem,1.4vw,1.35rem)' }}
          >
            {site.hero.subline}
          </p>

          {/* Stats row */}
          <div
            ref={statsRef}
            className="mt-12 md:mt-16 pt-8 border-t border-line flex flex-wrap gap-8 md:gap-14"
          >
            {site.hero.stats.map((s) => (
              <StatCallout key={s.label} value={s.value} label={s.label} fuzzed={s.fuzzed} />
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-6 md:left-12 z-20">
          <ScrollCue innerRef={scrollCueRef} />
        </div>

      </div>
    </section>
  )
}
