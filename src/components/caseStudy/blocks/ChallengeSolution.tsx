/**
 * ChallengeSolution — two-column "The challenge / The solution" band (ADR-002).
 * Reference: Ashish Ranjan's Meesho Mall case.
 */
import { useReveal } from './useReveal'

interface ChallengeSolutionProps {
  challenge: string
  solution: string
}

export function ChallengeSolution({ challenge, solution }: ChallengeSolutionProps) {
  const ref = useReveal<HTMLDivElement>()
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
