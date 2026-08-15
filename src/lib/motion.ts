/**
 * Motion system constants — closed vocabulary.
 * Master ease: cubic-bezier(0.65,0,0.35,1)
 * Every animation must live in gsap.matchMedia() via withReducedMotion().
 */
import { gsap } from './gsap'

/** GSAP-compatible ease string matching --ease-network CSS token. */
export const EASE = 'cubic-bezier(0.65,0,0.35,1)' as const

/** Duration constants in seconds (GSAP units). CSS token values divided by 1000. */
export const DURATIONS = {
  micro: 0.2,
  reveal: 0.6,
  crossfade: 0.65,
  camera: 1.2,
} as const

/**
 * Wraps gsap.matchMedia so components always register both branches:
 * a motion branch and a reduced-motion fallback that renders the end state.
 *
 * @param motionFn   Runs when motion is allowed. Return value is ignored.
 * @param reducedFn  Optional. Runs under prefers-reduced-motion: reduce.
 *                   If omitted the matchMedia still registers the query
 *                   (so GSAP properly handles the branch) but does nothing.
 */
export function withReducedMotion(
  motionFn: (context: gsap.Context) => void,
  reducedFn?: (context: gsap.Context) => void,
): gsap.MatchMedia {
  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', (ctx) => {
    motionFn(ctx)
  })

  mm.add('(prefers-reduced-motion: reduce)', (ctx) => {
    if (reducedFn) reducedFn(ctx)
  })

  return mm
}
