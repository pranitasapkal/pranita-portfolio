/**
 * Navbar — sticky top bar (Manav's ref, 2026-08-16): his line-art avatar +
 * name left, the same menu right. Dark glass only — never a white bg — text
 * white, hover in the site cobalt. Replaces the floating pill.
 *
 * Mobile (<768px): avatar + hamburger → full-screen overlay. Escape closes,
 * focus-trapped, body scroll locked — behavior carried over from v1 verbatim.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { site } from '../../content/site'
import { draft } from '../../content/site-v2-draft'

/* White text, cobalt hover (#5b7cff = 5.38:1 on the dark glass) — his spec. */
const LINK_CLS =
  'px-3 py-1.5 font-sans text-[14px] font-medium text-[#edeff3] hover:text-[#5b7cff] focus-visible:text-[#5b7cff] transition-colors duration-200'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const linkedIn = site.footer.socials.find((s) => s.label === 'LinkedIn')

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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => firstLinkRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

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
    } else if (document.activeElement === last) {
      e.preventDefault()
      first?.focus()
    }
  }, [])

  return (
    <div className="force-dark">
      {/* Full-width sticky bar, dark glass — no white bg by spec. */}
      <header
        role="banner"
        className="fixed top-0 inset-x-0 z-50 bg-[#0b0c0e]/80 backdrop-blur-md border-b border-line-soft"
      >
        <div className="max-w-[1800px] mx-auto px-5 md:px-[4vw] py-2.5 flex items-center justify-between gap-4">
        <a
          href="/"
          aria-label={site.nav.homeAriaLabel}
          className="flex items-center gap-3 font-sans font-bold text-[15px] text-[#edeff3] tracking-tight whitespace-nowrap"
        >
          <img
            src="/home/nav-avatar.png"
            alt=""
            width={240}
            height={259}
            className="h-10 w-10 object-contain"
          />
          {draft.nav.name}
        </a>

        {/* Desktop links */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label={site.nav.primaryNavLabel}
        >
          <a href={draft.nav.workHref} className={LINK_CLS}>
            {draft.nav.workLabel}
          </a>
          {linkedIn && (
            <a href={linkedIn.href} target="_blank" rel="noopener noreferrer" className={LINK_CLS}>
              {draft.nav.linkedInLabel}
            </a>
          )}
          <a
            href={site.nav.resumeHref}
            download
            className="px-3 py-1.5 font-sans text-[14px] font-bold text-[#edeff3] hover:text-[#5b7cff] focus-visible:text-[#5b7cff] transition-colors duration-200"
          >
            {draft.nav.resumeLabel}
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          className="md:hidden flex flex-col gap-1 p-2"
          onClick={() => setMenuOpen(true)}
          aria-label={site.nav.openMenuLabel}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className="w-5 h-0.5 bg-strong rounded-full" />
          <span className="w-5 h-0.5 bg-strong rounded-full" />
        </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="fixed inset-0 z-[800] bg-surface-0/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
          role="dialog"
          aria-modal="true"
          aria-label={site.nav.menuAriaLabel}
          onKeyDown={handleMenuKeyDown}
        >
          <button
            className="absolute top-6 right-6 font-mono text-sm text-soft hover:text-strong"
            onClick={closeMenu}
            aria-label={site.nav.closeMenuLabel}
          >
            ✕
          </button>

          <nav className="flex flex-col items-center gap-7" aria-label={site.nav.mobileNavLabel}>
            <a
              ref={firstLinkRef}
              href={draft.nav.workHref}
              onClick={closeMenu}
              className="font-serif-display text-4xl font-semibold text-strong hover:text-accent transition-colors duration-200"
            >
              {draft.nav.workLabel}
            </a>
            {linkedIn && (
              <a
                href={linkedIn.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="font-serif-display text-4xl font-semibold text-strong hover:text-accent transition-colors duration-200"
              >
                {draft.nav.linkedInLabel}
              </a>
            )}
            <a
              href={site.nav.resumeHref}
              download
              onClick={closeMenu}
              className="font-serif-display text-4xl font-semibold text-strong hover:text-accent transition-colors duration-200"
            >
              {draft.nav.resumeLabel}
            </a>
          </nav>
        </div>
      )}
    </div>
  )
}
