/**
 * ProblemCards — the reference's problem format (ADR-007): a central
 * illustration with numbered quote-cards around it. Each card is a question in
 * the persona's own voice plus one terse context line, closed by a full-width
 * punchline. Decoded from debodyutibiswas.framer.website/whylo (2026-08-16):
 * gray index → serif quote → gray context fragment.
 *
 * Desktop: cards flank the illustration (sequential split, left then right) so
 * the reading order matches the DOM. Mobile: illustration first, cards stacked.
 * The illustration is optional — a labelled placeholder frame holds the slot so
 * the section reads complete before the image file arrives.
 */
import { useReveal } from './useReveal'

interface ProblemCardsProps {
  illustration?: string
  illustrationAlt: string
  composite?: boolean
  punchline?: string
  items: { quote: string; context: string }[]
}

function Card({ quote, context, index }: { quote: string; context: string; index: number }) {
  return (
    <div role="listitem" className="flex flex-col gap-2">
      <span className="font-mono text-sm text-white/70 tabular-nums" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}.
      </span>
      <p className="font-display font-medium text-lg md:text-xl text-white leading-snug tracking-tight text-pretty">
        &ldquo;{quote}&rdquo;
      </p>
      {/* white/85 on pop-blue ≈ 6.9:1 — the mock's dimmer gray would fail AA */}
      <p className="font-sans text-[13px] text-white/85 leading-relaxed">{context}</p>
    </div>
  )
}

export function ProblemCards({
  illustration,
  illustrationAlt,
  composite,
  punchline,
  items,
}: ProblemCardsProps) {
  const ref = useReveal<HTMLDivElement>()
  const splitAt = Math.ceil(items.length / 2)
  const left = items.slice(0, splitAt)
  const right = items.slice(splitAt)

  if (composite && illustration) {
    // The finished composition carries the questions; alt enumerates them so a
    // screen reader on desktop loses nothing. Small screens swap to live cards.
    const compositeAlt = `${illustrationAlt}. Around him, his questions: ${items
      .map((i) => `“${i.quote}”`)
      .join(' · ')}`
    return (
      <div ref={ref} className="flex flex-col gap-8">
        <figure className="m-0 hidden lg:block">
          <img
            src={illustration}
            alt={compositeAlt}
            loading="lazy"
            className="w-full h-auto block rounded-3xl"
          />
        </figure>
        <div
          role="list"
          aria-label="The problems, in their own words"
          className="lg:hidden flex flex-col gap-10 rounded-3xl bg-pop-blue p-8"
        >
          {items.map((item, i) => (
            <Card key={item.quote} quote={item.quote} context={item.context} index={i} />
          ))}
        </div>
        {punchline && (
          <p className="font-display font-medium text-lg md:text-xl text-text-hi text-center leading-snug tracking-tight max-w-[40ch] mx-auto">
            {punchline}
          </p>
        )}
      </div>
    )
  }

  return (
    // The mock's composition (Manav, 2026-08-16): blue panel, the persona's
    // questions floating around the central illustration, live text not baked
    // pixels. Panel color = pop-blue; white on it computes 7.72:1.
    <div
      ref={ref}
      className="flex flex-col gap-10 rounded-3xl bg-pop-blue p-8 md:p-10 overflow-hidden"
    >
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_minmax(200px,250px)_1fr] gap-10 lg:gap-x-8 items-center">
        {/* Illustration — center column on desktop, first on mobile */}
        <div className="w-full max-w-sm lg:max-w-none lg:col-start-2 lg:row-start-1 self-center order-first lg:order-none">
          {illustration ? (
            <img
              src={illustration}
              alt={illustrationAlt}
              loading="lazy"
              className="w-full h-auto block rounded-2xl"
            />
          ) : (
            <div className="aspect-square flex items-center justify-center rounded-2xl border border-dashed border-white/40 p-6">
              <span className="font-mono text-xs text-white/85 tracking-wider text-center">
                {illustrationAlt}
              </span>
            </div>
          )}
        </div>

        <div role="list" className="contents" aria-label="The problems, in their own words">
          <div className="contents lg:flex lg:flex-col lg:gap-12 lg:col-start-1 lg:row-start-1">
            {left.map((item, i) => (
              <Card key={item.quote} quote={item.quote} context={item.context} index={i} />
            ))}
          </div>
          <div className="contents lg:flex lg:flex-col lg:gap-12 lg:col-start-3 lg:row-start-1">
            {right.map((item, i) => (
              <Card
                key={item.quote}
                quote={item.quote}
                context={item.context}
                index={splitAt + i}
              />
            ))}
          </div>
        </div>
      </div>

      {punchline && (
        <p className="font-display font-medium text-lg md:text-xl text-white text-center leading-snug tracking-tight max-w-[40ch] mx-auto">
          {punchline}
        </p>
      )}
    </div>
  )
}
