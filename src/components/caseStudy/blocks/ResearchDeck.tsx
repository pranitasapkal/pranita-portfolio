/**
 * ResearchDeck — field-research photographs as a draggable card deck (ADR-006).
 *
 * The interaction is deliberately the same as the home hero's `DragCard`, so the
 * two read as one site: a small stack with fixed offsets, drag the top card and
 * fling it past a threshold to send it to the back. The deck advances on its
 * own (Manav, 2026-08-16 — buttons removed): a 3s cycle that pauses on hover
 * and while dragging, and never runs under reduced motion or off-screen tabs.
 *
 * A card with no `src` renders a labelled placeholder frame instead of an image,
 * so this section reads finished before Pranita's sort-centre photographs land.
 * Dropping the file in and adding `src` is the only change needed later.
 *
 * Reduced motion / coarse pointer: dragging is off and the deck renders as a
 * static fanned stack; Shuffle still works as an instant, discrete change.
 */
import { useRef, useState, useCallback, useEffect, useId } from 'react'
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

  /* Continuous self-shuffle. Paused while hovered or dragging (WCAG 2.2.2 —
     hover is the pause control), skipped when the tab is hidden, and never
     started under reduced motion — those users get the static fanned stack. */
  const paused = useRef(false)
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      if (paused.current || drag.current.dragging || document.hidden) return
      shuffle()
    }, 3000)
    return () => window.clearInterval(id)
  }, [reduced, shuffle])

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
          aria-label={`${items.length} field-research photographs, cycling automatically. Hover to pause.`}
          onMouseEnter={() => { paused.current = true }}
          onMouseLeave={() => { paused.current = false }}
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

          <span className="font-mono text-[11px] text-text-lo tabular-nums">
            {topIdx + 1} / {items.length}
          </span>

          {/* Names the front card for screen readers; deliberately NOT aria-live —
              a self-advancing deck would announce every three seconds. */}
          <p id={liveId} className="sr-only">
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
