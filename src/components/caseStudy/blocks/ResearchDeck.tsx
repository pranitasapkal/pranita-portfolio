/**
 * ResearchDeck — field-research photographs as a draggable card deck (ADR-006).
 *
 * The interaction is deliberately the same as the home hero's `DragCard`, so the
 * two read as one site: a small stack with fixed offsets, drag the top card and
 * fling it past a threshold to send it to the back, plus Peek (fans the deck)
 * and Shuffle (advances one). Reused rather than re-invented — a second flick
 * gesture with different physics on the same page would just look like a bug.
 *
 * A card with no `src` renders a labelled placeholder frame instead of an image,
 * so this section reads finished before Pranita's sort-centre photographs land.
 * Dropping the file in and adding `src` is the only change needed later.
 *
 * Reduced motion / coarse pointer: dragging is off and the deck renders as a
 * static fanned stack; Shuffle still works as an instant, discrete change.
 */
import { useRef, useState, useCallback, useId } from 'react'
import { gsap } from '../../../lib/gsap'
import { useHasFinePointer, usePrefersReducedMotion } from '../../../lib/useMediaQuery'
import { useReveal } from './useReveal'

interface ResearchDeckProps {
  title?: string
  note?: string
  items: { src?: string; alt: string; caption: string; place?: string }[]
}

/** Offsets for the cards behind the top one — index 0 is the top card. */
const STACK = [
  { x: 0, y: 0, r: 0 },
  { x: 12, y: 9, r: 2.5 },
  { x: -9, y: 16, r: -2 },
  { x: 5, y: 23, r: 1.5 },
  { x: -4, y: 29, r: -1 },
]

const FLING_THRESHOLD = 90

export function ResearchDeck({ title, note, items }: ResearchDeckProps) {
  const ref = useReveal<HTMLDivElement>()
  const [order, setOrder] = useState(() => items.map((_, i) => i))
  const hostRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ startX: 0, startY: 0, dragging: false })
  const liveId = useId()

  const finePointer = useHasFinePointer()
  const reduced = usePrefersReducedMotion()
  const interactive = finePointer && !reduced

  const cycle = useCallback(() => setOrder((o) => [...o.slice(1), o[0]]), [])

  const settle = useCallback(
    (el: HTMLElement) => {
      cycle()
      gsap.set(el, { x: 0, y: 0, rotate: 0, opacity: 1 })
      gsap.from(el, { scale: 0.94, duration: 0.3, ease: 'power3.out' })
    },
    [cycle],
  )

  const shuffle = useCallback(() => {
    const el = topRef.current
    if (!interactive || !el) {
      cycle()
      return
    }
    gsap.to(el, {
      x: 150, y: -28, rotate: 9, opacity: 0,
      duration: 0.28, ease: 'power3.out',
      onComplete: () => settle(el),
    })
  }, [interactive, cycle, settle])

  const peek = useCallback(() => {
    const host = hostRef.current
    if (!host || !interactive) return
    const cards = host.querySelectorAll<HTMLElement>('[data-deck-card]')
    gsap.to(cards, {
      x: (i) => STACK[Math.min(i, STACK.length - 1)].x + i * 30,
      rotate: (i) => STACK[Math.min(i, STACK.length - 1)].r + i * 3,
      duration: 0.35, ease: 'power3.out', stagger: 0.02,
      onComplete: () => {
        gsap.to(cards, {
          x: (i) => STACK[Math.min(i, STACK.length - 1)].x,
          rotate: (i) => STACK[Math.min(i, STACK.length - 1)].r,
          delay: 0.55, duration: 0.4, ease: 'power3.out',
        })
      },
    })
  }, [interactive])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive || !topRef.current) return
      topRef.current.setPointerCapture(e.pointerId)
      drag.current = { startX: e.clientX, startY: e.clientY, dragging: true }
    },
    [interactive],
  )

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = topRef.current
    if (!drag.current.dragging || !el) return
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    gsap.set(el, { x: dx, y: dy, rotate: dx / 18 })
  }, [])

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = topRef.current
      if (!drag.current.dragging || !el) return
      drag.current.dragging = false
      const dx = e.clientX - drag.current.startX
      const dy = e.clientY - drag.current.startY
      if (Math.hypot(dx, dy) > FLING_THRESHOLD) {
        gsap.to(el, {
          x: dx * 2.4, y: dy * 2.4, rotate: dx / 8, opacity: 0,
          duration: 0.3, ease: 'power3.out',
          onComplete: () => settle(el),
        })
      } else {
        gsap.to(el, { x: 0, y: 0, rotate: 0, duration: 0.45, ease: 'elastic.out(1, 0.6)' })
      }
    },
    [settle],
  )

  if (!items.length) return null
  const topIdx = order[0]

  return (
    <div ref={ref} className="flex flex-col gap-6">
      {title && (
        <h3 className="font-display font-black text-xl md:text-2xl text-text-hi tracking-tight">
          {title}
        </h3>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-10">
        <div
          ref={hostRef}
          role="group"
          aria-roledescription="card deck"
          aria-label={`${items.length} field-research photographs. Use Shuffle to advance.`}
          /* mb clears the back cards' stack offsets (up to +29px) and their drop
             shadows, which otherwise bleed into whatever block follows. */
          className="relative shrink-0 w-[280px] h-[350px] md:w-[320px] md:h-[400px] mb-14"
        >
          {/* Painted back-to-front so order[0] sits on top. */}
          {[...order].reverse().map((idx, rev) => {
            const pos = order.length - 1 - rev
            const card = items[idx]
            const off = STACK[Math.min(pos, STACK.length - 1)]
            const isTop = pos === 0
            return (
              <figure
                key={idx}
                data-deck-card
                ref={isTop ? topRef : undefined}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? onPointerMove : undefined}
                onPointerUp={isTop ? onPointerUp : undefined}
                onPointerCancel={isTop ? onPointerUp : undefined}
                aria-hidden={!isTop}
                className={[
                  'absolute inset-0 m-0 rounded-2xl overflow-hidden flex flex-col',
                  'bg-ink-1 border border-line shadow-[0_18px_50px_rgba(29,29,31,0.14)]',
                  isTop && interactive ? 'cursor-grab active:cursor-grabbing touch-none' : '',
                ].join(' ')}
                style={{
                  transform: `translate(${off.x}px, ${off.y}px) rotate(${off.r}deg)`,
                  zIndex: 10 - pos,
                }}
              >
                <div className="relative flex-1 min-h-0 bg-ink-2">
                  {card.src ? (
                    <img
                      src={card.src}
                      alt={card.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    /* Placeholder frame — deliberately says what is coming rather
                       than showing a grey box with no explanation. */
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
                      aria-label={card.alt}
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-[10px] tracking-[0.25em] uppercase text-signal"
                      >
                        photo pending
                      </span>
                      <span className="font-serif text-lg leading-snug text-text-lo">
                        {card.alt}
                      </span>
                    </div>
                  )}
                </div>

                <figcaption className="px-4 py-3 border-t border-line flex items-baseline justify-between gap-3">
                  <span className="font-body text-[13px] leading-snug text-text-hi">
                    {card.caption}
                  </span>
                  {card.place && (
                    <span className="font-mono text-[10px] tracking-wider uppercase text-text-lo shrink-0">
                      {card.place}
                    </span>
                  )}
                </figcaption>
              </figure>
            )
          })}
        </div>

        <div className="flex flex-col gap-5 min-w-0">
          {note && (
            <p className="font-body text-text-lo leading-relaxed max-w-[46ch]">{note}</p>
          )}

          <div className="flex items-center gap-3">
            {interactive && (
              <button
                type="button"
                onClick={peek}
                className="rounded-full border border-line px-4 py-1.5 font-mono text-xs tracking-wider text-text-lo hover:text-text-hi hover:border-text-lo transition-colors duration-200"
              >
                Peek
              </button>
            )}
            <button
              type="button"
              onClick={shuffle}
              aria-controls={liveId}
              className="rounded-full bg-signal text-ink-0 px-4 py-1.5 font-mono text-xs tracking-wider hover:opacity-90 transition-opacity duration-200"
            >
              Shuffle
            </button>
            <span className="font-mono text-[11px] text-text-lo tabular-nums">
              {topIdx + 1} / {items.length}
            </span>
          </div>

          {/* Announces the front card to screen readers as the deck cycles, since
              the visual stack order carries that information for everyone else. */}
          <p id={liveId} aria-live="polite" className="sr-only">
            {items[topIdx].caption}
            {items[topIdx].place ? `, ${items[topIdx].place}` : ''}
          </p>

          {interactive && (
            <p aria-hidden="true" className="font-mono text-[11px] text-text-lo/70">
              drag a card to flick through
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
