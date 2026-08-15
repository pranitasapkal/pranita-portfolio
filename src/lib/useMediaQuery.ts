/**
 * Reactive media-query hooks.
 *
 * Components used to read `window.matchMedia(...).matches` once — in a `useState`
 * initializer, a `useRef`, or a bare const — which is correct on first paint and
 * wrong forever after. Resize a desktop window down past a breakpoint, or toggle
 * Reduce Motion in the OS mid-session, and nothing re-evaluated.
 *
 * useSyncExternalStore is the right primitive here: it subscribes to the
 * MediaQueryList itself, so a change re-renders the component instead of
 * requiring an effect + state pair at every call site.
 *
 * Deliberate exception: `Loader` still reads the preference once. It only ever
 * runs on first load, and a user who enables Reduce Motion mid-session should
 * not be handed a loader animation as a result.
 */
import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onStoreChange)
      return () => mql.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => serverFallback)
}

/** True when the visitor has asked for reduced motion. */
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** True on devices with no hover capability — touch, essentially. */
export const useIsTouch = () => useMediaQuery('(hover: none)')

/** True for a precise pointer (mouse/trackpad), i.e. hover effects are worth running. */
export const useHasFinePointer = () => useMediaQuery('(pointer: fine)')
