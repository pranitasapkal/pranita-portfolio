/**
 * Grain texture overlay — renders the .grain div defined in base.css.
 * pointer-events: none; fixed; z-60; mix-blend-mode: overlay; opacity: 0.045.
 */
export function GrainOverlay() {
  return <div className="grain" aria-hidden="true" />
}
