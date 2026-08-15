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
 * Either branch may return a cleanup function; GSAP runs it when the branch
 * stops matching or the matchMedia is reverted. That is the only correct place
 * to tear down non-GSAP side effects (event listeners, timers) registered by a
 * branch — doing it in a bare useEffect leaks them across a motion-pref change.
 *
 * @param motionFn   Runs when motion is allowed.
 * @param reducedFn  Optional. Runs under prefers-reduced-motion: reduce.
 *                   If omitted the matchMedia still registers the query
 *                   (so GSAP properly handles the branch) but does nothing.
 */
type MotionBranch = (context: gsap.Context) => void | (() => void)

export function withReducedMotion(
  motionFn: MotionBranch,
  reducedFn?: MotionBranch,
): gsap.MatchMedia {
  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', (ctx) => motionFn(ctx))

  mm.add('(prefers-reduced-motion: reduce)', (ctx) => reducedFn?.(ctx))

  return mm
}
