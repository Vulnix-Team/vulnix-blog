import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";

import { INK, loadBrandFonts } from "../brand";

// The shared ground for article covers: the website's use-case stage (one
// flat colour, crisp shapes) with Dot acting out the article's idea.
//
// 2:1 master. Everything that matters sits between x 450 and 1950, so the
// 5:4 crop on vulnix.dev and the 1200x630 link preview both keep it.
export const COVER_W = 2400;
export const COVER_H = 1200;
export const FLOOR = 980;

export type Pt = [number, number];

/** Stage colours from the product's use-case tabs (marketing-site.md). */
export const STAGE = {
  sage: { ground: "#c5d3c9", floor: "#b2c3b7" },
  oat: { ground: "#e6dcc8", floor: "#d6c9af" },
  peach: { ground: "#ffc6a8", floor: "#f5b08c" },
} as const;

export function Stage({ tone, children }: { tone: keyof typeof STAGE; children: ReactNode }) {
  loadBrandFonts();
  const { ground, floor } = STAGE[tone];
  return (
    <AbsoluteFill style={{ backgroundColor: ground }}>
      <svg width={COVER_W} height={COVER_H} viewBox={`0 0 ${COVER_W} ${COVER_H}`}>
        <rect x={0} y={FLOOR} width={COVER_W} height={COVER_H - FLOOR} fill={floor} />
        {children}
      </svg>
    </AbsoluteFill>
  );
}

/** Dot's contact shadow on the floor, under x. */
export function Shadow({ x, width = 240 }: { x: number; width?: number }) {
  return <ellipse cx={x} cy={FLOOR + 14} rx={width / 2} ry={18} fill={INK} opacity={0.14} />;
}
