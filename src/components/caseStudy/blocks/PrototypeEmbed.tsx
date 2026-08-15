/**
 * PrototypeEmbed — facade poster + "▶ Load live prototype" button → lazy iframe.
 * NEVER auto-loads. Iframe injects /prototypes/<slug>/ on click.
 * Shows "best on desktop" chip below 768px.
 * "Open full screen ↗" link always present once loaded.
 */
import { useState } from 'react'
import { Button } from '../../primitives/Button'
import { PillTag } from '../../primitives/PillTag'

interface PrototypeEmbedProps {
  slug: string
  poster?: string
  title: string
  note?: string
}

export function PrototypeEmbed({ slug, poster, title, note }: PrototypeEmbedProps) {
  const [loaded, setLoaded] = useState(false)
  // Explicit index.html: Vite/static hosts don't reliably resolve directory
  // indexes under public/, and the bare dir URL falls through to the SPA shell.
  const src = `/prototypes/${slug}/index.html`

  return (
    <div className="flex flex-col gap-4 rounded-xl overflow-hidden border border-line bg-ink-1">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 pt-5">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs tracking-widest uppercase text-signal">
            Live Prototype
          </span>
          <span className="font-display font-bold text-text-hi text-sm">{title}</span>
        </div>
        {loaded && (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-text-lo hover:text-text-hi transition-colors duration-200 shrink-0"
            aria-label={`Open ${title} full screen`}
          >
            Open full screen ↗
          </a>
        )}
      </div>

      {/* Note */}
      {note && (
        <p className="px-5 font-mono text-xs text-text-lo leading-relaxed max-w-[60ch]">
          {note}
        </p>
      )}

      {/* Desktop-only advisory */}
      <div className="px-5 md:hidden">
        <PillTag>Best experienced on desktop</PillTag>
      </div>

      {/* Facade / iframe area */}
      <div className="relative mx-5 mb-5 rounded-lg overflow-hidden border border-line bg-ink-2"
        style={{ aspectRatio: '16 / 9' }}>
        {!loaded ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            style={poster ? { backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {poster && <div className="absolute inset-0 bg-ink-0/70" aria-hidden="true" />}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-ink-2/80 border border-line flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M7 4l9 6-9 6V4z" fill="var(--color-signal)" />
                </svg>
              </div>
              <Button onClick={() => setLoaded(true)} variant="solid">
                Load live prototype
              </Button>
              <p className="font-mono text-xs text-text-lo text-center max-w-xs">
                Prototype loads on demand — not auto-played.
              </p>
            </div>
          </div>
        ) : (
          <iframe
            src={src}
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            allow="fullscreen"
          />
        )}
      </div>
    </div>
  )
}
