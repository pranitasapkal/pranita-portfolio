/**
 * ChallengeSolution — two forms (ADR-002, extended by ADR-004).
 *
 * Legacy: a two-column "The challenge / The solution" band (CLH-03 still uses it).
 * Pair form: a named problem — optionally with the user's own words — then the fix, then one
 * sentence saying what actually changed. The effect line is the point of the block; a
 * problem/solution pair that can't name its effect is describing work, not results.
 */
import { useReveal } from './useReveal'

interface ChallengeSolutionProps {
  challenge?: string
  solution?: string
  index?: string
  problem?: { title: string; body: string; quote?: string }
  fix?: { title: string; body: string }
  effect?: string
  image?: { src: string; alt: string }
}

export function ChallengeSolution({
  challenge,
  solution,
  index,
  problem,
  fix,
  effect,
  image,
}: ChallengeSolutionProps) {
  const ref = useReveal<HTMLDivElement>()

  // ── Pair form ──────────────────────────────────────────────────────────────
  if (problem || fix) {
    return (
      <div ref={ref} className="flex flex-col gap-6 border-t border-line pt-8">
        {index && (
          <p className="font-mono text-[10px] text-signal tracking-[0.25em] uppercase">{index}</p>
        )}

        <div className="grid md:grid-cols-2 gap-8 md:gap-14">
          {problem && (
            <div className="flex flex-col gap-3">
              <h3 className="font-display font-black text-xl md:text-2xl text-text-hi tracking-tight">
                {problem.title}
              </h3>
              <p className="font-body text-sm md:text-base text-text-lo leading-relaxed">
                {problem.body}
              </p>
              {problem.quote && (
                <blockquote className="font-serif italic text-base md:text-lg text-text-hi border-l-2 border-line pl-4 mt-1">
                  {problem.quote}
                </blockquote>
              )}
            </div>
          )}

          {fix && (
            <div className="flex flex-col gap-3">
              <h3 className="font-display font-black text-xl md:text-2xl text-signal tracking-tight">
                {fix.title}
              </h3>
              <p className="font-body text-sm md:text-base text-text-lo leading-relaxed">
                {fix.body}
              </p>
            </div>
          )}
        </div>

        {image && (
          <div className="rounded-2xl overflow-hidden border border-line bg-ink-1">
            <img src={image.src} alt={image.alt} loading="lazy" className="w-full h-auto block" />
          </div>
        )}

        {effect && (
          <p className="font-body text-base md:text-lg text-text-hi leading-relaxed max-w-3xl">
            {effect}
          </p>
        )}
      </div>
    )
  }

  // ── Legacy form ────────────────────────────────────────────────────────────
  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-8 md:gap-14 py-4">
      <div className="flex flex-col gap-3">
        <h3 className="font-display font-black text-xl md:text-2xl text-text-hi tracking-tight">
          The challenge
        </h3>
        <p className="font-body text-sm md:text-base text-text-lo leading-relaxed">{challenge}</p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-display font-black text-xl md:text-2xl text-signal tracking-tight">
          The solution
        </h3>
        <p className="font-body text-sm md:text-base text-text-lo leading-relaxed">{solution}</p>
      </div>
    </div>
  )
}
