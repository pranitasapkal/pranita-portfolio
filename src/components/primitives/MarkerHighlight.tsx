/**
 * MarkerHighlight — a hand-swiped highlighter sweep behind a phrase.
 * Soft accent tint, slightly rotated with uneven corners so it reads as a
 * marker stroke, not a CSS background. Pure decoration behind real text.
 */
import type { ReactNode } from 'react'

export function MarkerHighlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span
        aria-hidden="true"
        className="absolute -inset-x-[0.18em] top-[0.14em] bottom-[0.02em] bg-accent/15 -rotate-[0.8deg]"
        style={{ borderRadius: '0.4em 0.7em 0.5em 0.8em / 0.7em 0.4em 0.8em 0.5em' }}
      />
      <span className="relative">{children}</span>
    </span>
  )
}
