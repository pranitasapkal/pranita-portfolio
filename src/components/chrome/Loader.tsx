/**
 * Full-screen intro loader.
 * - Mono counter 000→100 (rAF over ~2000ms) bottom-right in giant font-display.
 * - Rotating words: ROUTING → SORTING → DISPATCHING → DELIVERED (400ms crossfades).
 * - Thin bottom progress bar in signal color.
 * - Max 2.2s then fades out (650ms) and unmounts.
 * - Runs ONCE per session via sessionStorage 'loader-seen'.
 * - Skipped entirely under prefers-reduced-motion or when sessionStorage set.
 * - Click or any key skips immediately.
 * - aria-hidden="true" — does not trap focus.
 */
import { useState, useEffect, useRef, useCallback } from 'react'

const WORDS = ['ROUTING', 'SORTING', 'DISPATCHING', 'DELIVERED']
const TOTAL_DURATION = 2000 // ms
const FADE_DURATION = 650 // ms

function pad(n: number): string {
  return String(Math.floor(n)).padStart(3, '0')
}

export function Loader() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const alreadySeen =
    typeof window !== 'undefined' &&
    sessionStorage.getItem('loader-seen') === '1'

  // Skip entirely if reduced motion or already seen
  const [active, setActive] = useState(!prefersReducedMotion && !alreadySeen)
  const [exiting, setExiting] = useState(false)
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const wordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    if (!active || exiting) return
    setExiting(true)
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    if (wordTimerRef.current !== null) clearTimeout(wordTimerRef.current)
    exitTimerRef.current = setTimeout(() => {
      setActive(false)
      sessionStorage.setItem('loader-seen', '1')
      window.dispatchEvent(new CustomEvent('loader:done'))
    }, FADE_DURATION)
  }, [active, exiting])

  // Word rotation
  useEffect(() => {
    if (!active) return
    let idx = 0
    const cycle = () => {
      idx = (idx + 1) % WORDS.length
      setWordVisible(false)
      wordTimerRef.current = setTimeout(() => {
        setWordIndex(idx)
        setWordVisible(true)
        wordTimerRef.current = setTimeout(cycle, 400)
      }, 200)
    }
    wordTimerRef.current = setTimeout(cycle, 400)
    return () => {
      if (wordTimerRef.current !== null) clearTimeout(wordTimerRef.current)
    }
  }, [active])

  // Counter animation
  useEffect(() => {
    if (!active) return

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / TOTAL_DURATION, 1)
      setCount(progress * 100)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        // Reached 100 — begin exit after brief pause
        exitTimerRef.current = setTimeout(dismiss, 200)
      }
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [active, dismiss])

  // Max cap at 2.2s
  useEffect(() => {
    if (!active) return
    const cap = setTimeout(dismiss, 2200)
    return () => clearTimeout(cap)
  }, [active, dismiss])

  // Key + click to skip
  useEffect(() => {
    if (!active) return
    const onKey = () => dismiss()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, dismiss])

  // Cleanup exit timer on unmount
  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) clearTimeout(exitTimerRef.current)
    }
  }, [])

  // When the loader is skipped (already-seen or reduced-motion) fire the event
  // immediately so Hero entrance doesn't wait for a fallback timeout.
  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => window.dispatchEvent(new CustomEvent('loader:done')), 0)
      return () => clearTimeout(t)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!active) return null

  return (
    <div
      aria-hidden="true"
      onClick={dismiss}
      className={[
        'fixed inset-0 z-[900] bg-ink-0 flex flex-col',
        'transition-opacity',
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100',
      ].join(' ')}
      style={{ transitionDuration: `${FADE_DURATION}ms` }}
    >
      {/* Rotating word — center */}
      <div className="flex-1 flex items-center justify-center">
        <span
          className={[
            'font-mono text-sm md:text-base tracking-[0.3em] uppercase text-text-lo',
            'transition-opacity duration-200',
            wordVisible ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          {WORDS[wordIndex]}
        </span>
      </div>

      {/* Counter — bottom right */}
      <div className="px-8 pb-6 flex justify-end">
        <span className="font-display font-black text-[clamp(4rem,12vw,9rem)] leading-none text-text-hi tabular-nums">
          {pad(count)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-ink-2">
        <div
          className="h-full bg-signal transition-none"
          style={{ width: `${count}%` }}
        />
      </div>
    </div>
  )
}
