/**
 * Board — full-width designed board (deck slide / UI screenshot / diagram) for the
 * editorial case layout. Rounded card on a light or dark mat, scroll-reveal (fade +
 * rise) inside gsap.matchMedia with a reduced-motion branch. Falls back to a dashed
 * "asset pending" frame when placeholder=true or the image 404s. Added per ADR-001.
 */
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../../lib/gsap'

interface BoardProps {
  src: string
  alt: string
  caption?: string
  tone?: 'light' | 'dark'
  placeholder?: boolean
}

export function Board({ src, alt, caption, tone = 'light', placeholder }: BoardProps) {
  const ref = useRef<HTMLElement>(null)
  const [errored, setErrored] = useState(false)
  const pending = placeholder || errored

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'cubic-bezier(0.65,0,0.35,1)',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(el, { opacity: 1, y: 0 })
      })
    },
    { scope: ref },
  )

  const mat = tone === 'dark' ? 'bg-ink-2' : 'bg-paper'

  return (
    <figure ref={ref} className="flex flex-col gap-3">
      <div className={`w-full overflow-hidden rounded-xl border border-line ${mat}`}>
        {pending ? (
          <div
            className="aspect-[16/9] w-full flex flex-col items-center justify-center gap-3 px-8"
            aria-label={alt}
          >
            <span className="font-mono text-xs tracking-widest uppercase text-ink-0/40">
              board pending
            </span>
            <span className="font-body text-sm text-ink-0/70 text-center max-w-[46ch] leading-relaxed">
              {alt}
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
        <figcaption className="font-body text-sm text-text-lo leading-relaxed max-w-[70ch]">
          {caption.split(/\*\*(.+?)\*\*/g).map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="font-display font-black text-text-hi">
                {part}
              </strong>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </figcaption>
      )}
    </figure>
  )
}
