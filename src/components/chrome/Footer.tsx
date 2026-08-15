/**
 * Site footer.
 * - Giant email in font-display uppercase, clamp sizing, wrapped in MagneticWrap.
 * - Scramble-settle hover: on mouseenter, the visual characters scramble and
 *   re-settle left-to-right over ~600ms. The mailto link and aria-label are
 *   unaffected — scramble is purely cosmetic via an aria-hidden span.
 * - Social pill links: LinkedIn, Behance, Dribbble, Medium.
 * - Asterisk footnote paragraph.
 * - Mono stamp "LAST DISPATCH: 2026-07".
 */
import { useRef } from 'react'
import { MagneticWrap } from '../primitives/MagneticWrap'
import { site } from '../../content/site'

const EMAIL = site.footer.email

// Mono-safe character pool for scramble — avoids characters that look broken
// in IBM Plex Mono or cause layout shifts (wide chars excluded).
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789!@#$%^&*-+=:;<>?'

/**
 * Animates characters in `el` scrambling then settling left-to-right.
 * Returns a cancel function. Preserves '@' and '.' in place throughout.
 */
function scrambleSettle(el: HTMLElement, original: string, duration = 600): () => void {
  let rafId: number
  const start = performance.now()

  const tick = (now: number) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // Number of characters already settled (left → right)
    const settled = Math.round(progress * original.length)

    let result = ''
    for (let i = 0; i < original.length; i++) {
      const ch = original[i]
      if (i < settled) {
        // Already settled — show correct character
        result += ch
      } else if (ch === '@' || ch === '.' || ch === ' ') {
        // Structural characters stay visible at all times
        result += ch
      } else {
        // Still scrambling — random mono-safe char
        result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
    }

    el.textContent = result

    if (progress < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      // Ensure exact original text is restored
      el.textContent = original
    }
  }

  rafId = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(rafId)
    // Restore original on cancel so text is never left in a scrambled state
    el.textContent = original
  }
}

export function Footer() {
  const visualSpanRef = useRef<HTMLSpanElement>(null)
  const cancelRef     = useRef<(() => void) | null>(null)

  // Detect once — values stable for component lifetime
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleMouseEnter = () => {
    if (isTouch || prefersReduced) return
    const span = visualSpanRef.current
    if (!span) return
    // Cancel any in-flight scramble before starting a new one
    cancelRef.current?.()
    cancelRef.current = scrambleSettle(span, EMAIL)
  }

  return (
    <footer className="relative w-full bg-ink-0 border-t border-line pt-16 pb-10 px-6 md:px-12 flex flex-col items-center gap-12">
      {/* Giant email — MagneticWrap + scramble on hover */}
      <MagneticWrap strength={6} className="w-full text-center">
        <a
          href={`mailto:${EMAIL}`}
          className="font-display font-black uppercase text-text-hi hover:text-signal transition-colors duration-300 leading-none whitespace-nowrap"
          style={{ fontSize: 'clamp(1.375rem, 5.2vw, 5rem)' }}
          aria-label={site.footer.emailAriaLabel}
          onMouseEnter={handleMouseEnter}
        >
          {/*
            The real text lives in aria-label above.
            This span is aria-hidden — scramble modifies only its textContent,
            so screen readers always announce the clean address.
          */}
          <span ref={visualSpanRef} aria-hidden="true">
            {EMAIL}
          </span>
        </a>
      </MagneticWrap>

      {/* Social pills */}
      <nav
        className="flex flex-wrap justify-center gap-3"
        aria-label={site.footer.socialsAriaLabel}
      >
        {site.footer.socials.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-text-lo border border-line rounded-full px-4 py-1.5 hover:text-text-hi hover:border-text-lo transition-colors duration-200"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Divider */}
      <div className="w-full h-px bg-line" aria-hidden="true" />

      {/* Asterisk footnote */}
      <p className="font-mono text-xs text-text-lo text-center max-w-lg leading-relaxed">
        {site.footer.footnote}
      </p>

      {/* Mono stamp */}
      <span className="font-mono text-[10px] text-text-lo tracking-[0.2em] uppercase">
        {site.footer.stamp}
      </span>
    </footer>
  )
}
