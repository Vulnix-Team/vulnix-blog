"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function isLowPowerDevice(): boolean {
  const override = new URLSearchParams(window.location.search).get("lite");
  if (override === "1") return true;
  if (override === "0") return false;

  const navigatorWithHints = navigator as NavigatorWithHints;
  return Boolean(
    (navigatorWithHints.hardwareConcurrency && navigatorWithHints.hardwareConcurrency <= 4) ||
      (navigatorWithHints.deviceMemory && navigatorWithHints.deviceMemory <= 4) ||
      navigatorWithHints.connection?.saveData,
  );
}

/** Matches the product header's performance fallback for weak devices. */
export function useLowPowerMode(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia(REDUCED_MOTION_QUERY);
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches || isLowPowerDevice(),
    () => false,
  );
}
