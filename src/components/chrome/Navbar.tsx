/**
 * Navbar — v2 floating pill (Sandeep ref): name left; Work · LinkedIn ·
 * Resume right. Always the dark glass pill (single standard mode, `.force-dark`
 * scope) — legible over both dark and light sections.
 *
 * Mobile (<768px): name + hamburger → full-screen overlay. Escape closes,
 * focus-trapped, body scroll locked — behavior carried over from v1 verbatim.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { site } from '../../content/site'
import { draft } from '../../content/site-v2-draft'

const LINK_CLS =
  'px-3 py-1.5 font-sans text-[14px] font-medium text-soft hover:text-strong transition-colors duration-200 rounded-full'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const linkedIn = site.footer.socials.find((s) => s.label === 'LinkedIn')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      {/* Translucent glass pill. Big at rest, shrinks on scroll (Yantrava ref):
          width + padding animate via CSS transition on the master ease; the
          global reduced-motion rule collapses it to an instant snap. */}
      <header
        role="banner"
        className={[
          'fixed left-1/2 -translate-x-1/2 z-50',
          'flex items-center justify-between gap-2 md:gap-5',
          'w-[calc(100vw-2rem)]',
          'rounded-full backdrop-blur-xl border border-line-soft',
          'transition-[width,max-width,padding,top,background-color,box-shadow]',
          'duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]',
          scrolled
            ? 'top-4 max-w-[640px] pl-6 pr-2.5 py-2 bg-surface-2/75 shadow-[var(--shadow-pill)]'
            : 'top-6 max-w-[min(88vw,1080px)] pl-6 md:pl-9 pr-2.5 md:pr-4 py-2 md:py-4 bg-surface-2/55 shadow-[0_2px_14px_rgba(0,0,0,0.07)]',
        ].join(' ')}
      >
        <a
          href="/"
          aria-label={site.nav.homeAriaLabel}
          className="font-sans font-bold text-[15px] text-strong tracking-tight whitespace-nowrap"
        >
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
            className="px-4 py-1.5 font-sans text-[14px] font-bold text-strong bg-surface-1 rounded-full hover:bg-line-soft transition-colors duration-200"
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
