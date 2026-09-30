import { useSyncExternalStore } from "react";

// useSyncExternalStore (not useState+useEffect) so reading matchMedia never
// triggers react-hooks/set-state-in-effect - React runs the server snapshot
// (false) during hydration, then re-syncs to the real client value right
// after, which is the one case React explicitly exempts from the hydration-
// mismatch warning.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
