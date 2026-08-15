/**
 * ScreensGrid — gallery grid of real UI screens with captions (ADR-002).
 * Reference: Bao/ASM full-bleed screen collages; shows breadth (many screens),
 * where `board` shows one hero screen. Falls back to a pending frame on 404.
 */
import { useState } from 'react'
import { useReveal } from './useReveal'

interface ScreensGridProps {
  cols?: 2 | 3
  items: { src: string; alt: string; caption?: string }[]
}

function Cell({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const [errored, setErrored] = useState(false)
  return (
    <figure className="flex flex-col gap-2 min-w-0">
      <div className="overflow-hidden rounded-lg border border-line bg-paper">
        {errored ? (
          <div
            className="aspect-[16/9] flex items-center justify-center px-4"
            aria-label={alt}
          >
            <span className="font-mono text-[10px] tracking-widest uppercase text-ink-0/40">
              screen pending
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full block"
            onError={() => setErrored(true)}
          />
        )}
      </div>
      {caption && (
        <figcaption className="font-mono text-[11px] text-text-lo tracking-wide">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export function ScreensGrid({ cols = 2, items }: ScreensGridProps) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`grid gap-4 ${cols === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}
    >
      {items.map((it, i) => (
        <Cell key={i} {...it} />
      ))}
    </div>
  )
}
