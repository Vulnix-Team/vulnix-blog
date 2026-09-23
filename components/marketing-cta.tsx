"use client";

import type { ComponentProps } from "react";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { BorderBeam, type BorderBeamColorVariant, type BorderBeamTheme } from "border-beam";

type BeamProps = {
  beamSize?: "sm" | "md" | "line";
  beamTheme?: BorderBeamTheme;
  beamColorVariant?: BorderBeamColorVariant;
  beamActive?: boolean;
  beamClassName?: string;
};

export const MARKETING_CTA_OUTLINE = {
  dark: "border-white/25 bg-white/[0.06] text-white hover:bg-white/10",
} as const;

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Direct standalone-repo port of the product CTA wrapper. BorderBeam is
 * mounted only on desktop, exactly as on vulnix.dev. */
export function MarketingCtaLink({
  prefetch = false,
  beamSize = "sm",
  beamTheme = "dark",
  beamColorVariant = "sunset",
  beamActive = true,
  beamClassName,
  className,
  children,
  ...linkProps
}: BeamProps & Omit<ComponentProps<typeof Link>, "className"> & { className?: string }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) {
    return <Link prefetch={prefetch} className={className} {...linkProps}>{children}</Link>;
  }

  return (
    <BorderBeam
      size={beamSize}
      theme={beamTheme}
      colorVariant={beamColorVariant}
      active={beamActive}
      className={`marketing-cta-beam ${beamClassName ?? ""}`}
    >
      <Link prefetch={prefetch} className={className} {...linkProps}>{children}</Link>
    </BorderBeam>
  );
}
