/**
 * DeviceFrame — a screenshot inside a laptop display (ADR-007).
 *
 * Screen only, no keyboard deck (Pranita's spec, 2026-08-16): a dark bezel with
 * a camera dot, the shot inside, and a soft cast shadow. The frame is pure CSS
 * so it costs nothing over the image itself and inherits the v1 tokens.
 */
import { useReveal } from './useReveal'

interface DeviceFrameProps {
  src: string
  alt: string
  caption?: string
  placeholder?: boolean
}

export function DeviceFrame({ src, alt, caption, placeholder }: DeviceFrameProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <figure ref={ref} className="m-0 flex flex-col items-center gap-4">
      <div
        className="w-full max-w-4xl rounded-[1.25rem] bg-[#1d1d1f] p-2.5 pt-5 relative"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        {/* Camera dot */}
        <span
          className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3a3a3e]"
          aria-hidden="true"
        />
        <div className="rounded-[0.75rem] overflow-hidden bg-ink-1">
          {placeholder ? (
            <div className="aspect-[16/10] flex items-center justify-center border border-dashed border-line">
              <span className="font-mono text-xs text-text-lo tracking-wider">{alt}</span>
            </div>
          ) : (
            <img src={src} alt={alt} loading="lazy" className="w-full h-auto block" />
          )}
        </div>
      </div>
      {caption && (
        <figcaption className="font-mono text-xs text-text-lo text-center">{caption}</figcaption>
      )}
    </figure>
  )
}
