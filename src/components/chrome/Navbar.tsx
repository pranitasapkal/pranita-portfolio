/**
 * Fixed top-center liquid-glass pill navbar.
 * - Logo: "PS" two-node inline SVG (filled signal circle + stroked beacon circle + dashed arc).
 * - Links: Work / Toolkit / Process / Contact (hash anchor links).
 * - "Resume ↓" download link.
 * - Live IST clock (font-mono, updates every minute).
 * - Shadow appears after scrollY > 100.
 * - Mobile (<768px): logo + hamburger → full-screen overlay menu.
 *   Staggered link entrance, Escape closes, focus-trapped, body scroll locked.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { site } from '../../content/site'

const NAV_LINKS = site.nav.links

function getISTTime(): string {
  const now = new Date()
  // IST = UTC+5:30
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const ist = new Date(utc + 5.5 * 3600000)
  const h = String(ist.getHours()).padStart(2, '0')
  const m = String(ist.getMinutes()).padStart(2, '0')
  return `${h}:${m} IST`
}

/** Logo mark: two connected node dots */
function LogoMark() {
  return (
    <svg
      width="28"
      height="16"
      viewBox="0 0 28 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Dashed connecting arc */}
      <path
        d="M6 8 Q14 0 22 8"
        stroke="var(--color-text-lo)"
        strokeWidth="1"
        strokeDasharray="2 2"
        fill="none"
      />
      {/* Left: filled signal circle */}
      <circle cx="5" cy="8" r="4.5" fill="var(--color-signal)" />
      {/* Right: stroked beacon circle */}
      <circle
        cx="23"
        cy="8"
        r="4"
        stroke="var(--color-beacon)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState(getISTTime)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // IST clock — update once a minute
  useEffect(() => {
    const tick = () => setTime(getISTTime())
    // align to next minute boundary
    const ms = (60 - new Date().getSeconds()) * 1000
    const timeout = setTimeout(() => {
      tick()
      const interval = setInterval(tick, 60000)
      return () => clearInterval(interval)
    }, ms)
    return () => clearTimeout(timeout)
  }, [])

  // Escape key closes menu
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    hamburgerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, closeMenu])

  // Body scroll lock
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      // Focus first link when overlay opens
      setTimeout(() => firstLinkRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Focus trap inside mobile menu
  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !menuRef.current) return
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }, [])

  return (
    <>
      <header
        className={[
          'fixed top-4 left-1/2 -translate-x-1/2 z-50',
          'flex items-center gap-6 px-5 py-2.5',
          'rounded-full border border-line',
          'bg-ink-2/70 backdrop-blur-md',
          'transition-shadow duration-300',
          scrolled ? 'shadow-[0_4px_32px_rgba(0,0,0,0.5)]' : '',
        ].join(' ')}
        role="banner"
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label={site.nav.homeAriaLabel}
        >
          <LogoMark />
          <span className="font-mono text-sm font-medium text-text-hi tracking-wider">
            {site.nav.wordmark}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label={site.nav.primaryNavLabel}>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-3 py-1 font-mono text-xs text-text-lo tracking-wider hover:text-text-hi transition-colors duration-200 rounded-full hover:bg-line"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* IST clock + Resume (desktop) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs text-text-lo tabular-nums">{time}</span>
          <a
            href={site.nav.resumeHref}
            download
            className="font-mono text-xs text-signal border border-signal/40 rounded-full px-3 py-1 hover:bg-signal/10 transition-colors duration-200"
          >
            {site.nav.resumeLabel}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          className="md:hidden ml-auto flex flex-col gap-1 p-1"
          onClick={() => setMenuOpen(true)}
          aria-label={site.nav.openMenuLabel}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className="w-5 h-0.5 bg-text-hi rounded-full" />
          <span className="w-5 h-0.5 bg-text-hi rounded-full" />
        </button>
      </header>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="fixed inset-0 z-[800] bg-ink-0/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
          role="dialog"
          aria-modal="true"
          aria-label={site.nav.menuAriaLabel}
          onKeyDown={handleMenuKeyDown}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 font-mono text-sm text-text-lo hover:text-text-hi"
            onClick={closeMenu}
            aria-label={site.nav.closeMenuLabel}
          >
            ✕
          </button>

          <nav className="flex flex-col items-center gap-6" aria-label={site.nav.mobileNavLabel}>
            {NAV_LINKS.map(({ label, href }, i) => (
              <a
                key={label}
                ref={i === 0 ? firstLinkRef : undefined}
                href={href}
                onClick={closeMenu}
                className="font-display font-black text-4xl text-text-hi hover:text-signal transition-colors duration-200"
                style={{
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href={site.nav.resumeHref}
            download
            className="font-mono text-sm text-signal border border-signal/40 rounded-full px-5 py-2 hover:bg-signal/10 transition-colors duration-200"
          >
            {site.nav.resumeLabel}
          </a>

          <span className="font-mono text-xs text-text-lo tabular-nums absolute bottom-6">
            {time}
          </span>
        </div>
      )}
    </>
  )
}
