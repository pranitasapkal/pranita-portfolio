/**
 * Visually-hidden-until-focus "Skip to content" link.
 * Targets #main — must exist on every page.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className={[
        'fixed top-3 left-3 z-[999]',
        'px-4 py-2 rounded-full',
        'font-mono text-xs text-ink-0 bg-signal',
        // Visually hidden until focused
        'translate-y-[-200%] focus:translate-y-0',
        'transition-transform duration-200',
      ].join(' ')}
    >
      Skip to content
    </a>
  )
}
