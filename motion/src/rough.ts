// Hand-drawn lines without SVG filters, from the demo film's kit
// (product apps/motion/src/film/kit.tsx). Every sketched line is subdivided
// and nudged off its true path by a smooth, seeded wobble: the paper-world
// look as plain vectors, which headless Chrome renders fast.

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export type Pt = [number, number];

/** A wobbly polyline (or closed polygon) through `points`. `amp` is the wobble
 * in pixels; open lines overshoot their ends slightly, like a pen stroke. */
export function roughPath(points: Pt[], seed: number, amp = 2.4, closed = false): string {
  // One continuous subpath: SVG restarts a dash pattern at every "M", so a
  // multi-segment line split into subpaths would draw on as dots, and every
  // segment would draw at once instead of end to end.
  const pts = closed ? [...points, points[0]] : points;
  const last = pts.length - 2;
  let d = "";
  for (let i = 0; i <= last; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const len = Math.hypot(bx - ax, by - ay);
    if (len < 0.5) continue;
    const nx = -(by - ay) / len;
    const ny = (bx - ax) / len;
    const steps = Math.max(2, Math.ceil(len / 48));
    const h1 = hash(seed * 13 + i * 7.3);
    const h2 = hash(seed * 29 + i * 3.1);
    // Open lines overshoot only at their two real ends, like a pen stroke.
    const over = closed ? 0 : amp * 1.2;
    for (let j = d === "" ? 0 : 1; j <= steps; j++) {
      const u = j / steps;
      const ext = ((i === 0 && j === 0 ? -over : 0) + (i === last && j === steps ? over : 0)) / len;
      const x = ax + (bx - ax) * (u + ext);
      const y = ay + (by - ay) * (u + ext);
      const wobble = amp * (Math.sin((u * 2.2 + h1) * Math.PI * 2) * 0.7 + (h2 - 0.5) * 0.6) * Math.sin(u * Math.PI);
      d += `${d === "" ? "M" : "L"} ${(x + nx * wobble).toFixed(1)} ${(y + ny * wobble).toFixed(1)} `;
    }
  }
  return closed ? `${d}Z` : d;
}

/** Axis-aligned rectangle as a closed rough path. */
export const roughRect = (x: number, y: number, w: number, h: number, seed: number, amp = 2.4) =>
  roughPath(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    seed,
    amp,
    true,
  );

/** A hand-drawn circle (closed rough path). */
export const roughCircle = (cx: number, cy: number, r: number, seed: number, amp = 2) => {
  const n = Math.max(16, Math.round(r / 5));
  const pts: Pt[] = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  return roughPath(pts, seed, amp, true);
};
