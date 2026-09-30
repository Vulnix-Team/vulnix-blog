import { CREAM, EMBER, FONT_MONO, INK } from "../brand";
import { Dot } from "../dot";
import { FLOOR, Shadow, Stage, type Pt } from "./stage";

// Cover for "How to Validate a Security Fix". The fix check from the demo
// film: Dot has replayed the exploit at the patched wall and bounced off it -
// 403 - with the old crack sealed in Ember. Drawn as the website's use-case
// stage: one flat colour, crisp shapes.

const WALL = { x: 1330, y: 150, w: 360 };
const BRICK_H = 94;
const BRICK_W = 180;
const SEAM: Pt[] = [
  [1498, WALL.y + 14],
  [1468, 300],
  [1516, 430],
  [1474, 572],
  [1522, 712],
  [1484, 850],
  [1510, FLOOR - 4],
];
const HIT: Pt = [WALL.x, 548];
const DOT = { x: 850, y: 500, size: 270 };

/** Brick joints as line segments, clipped to the wall. */
function brickJoints() {
  const lines: [Pt, Pt][] = [];
  for (let y = WALL.y + BRICK_H, row = 1; y < FLOOR; y += BRICK_H, row++) {
    lines.push([[WALL.x, y], [WALL.x + WALL.w, y]]);
  }
  for (let y = WALL.y, row = 0; y < FLOOR; y += BRICK_H, row++) {
    const offset = row % 2 ? BRICK_W / 2 : 0;
    for (let x = WALL.x + offset + BRICK_W; x < WALL.x + WALL.w; x += BRICK_W) {
      lines.push([[x, y], [x, Math.min(y + BRICK_H, FLOOR)]]);
    }
  }
  return lines;
}

const seamD = `M ${SEAM.map(([x, y]) => `${x} ${y}`).join(" L ")}`;
const burst = [-50, -25, 0, 25, 50].map((a) => {
  const r = (a * Math.PI) / 180;
  const dx = -Math.cos(r);
  const dy = Math.sin(r);
  return [
    [HIT[0] + dx * 40, HIT[1] + dy * 40],
    [HIT[0] + dx * 96, HIT[1] + dy * 96],
  ] as [Pt, Pt];
});
// The bounce back: from the wall up and over to where Dot hangs in the air.
const TRAIL = `M ${HIT[0] - 20} ${HIT[1]} Q ${(HIT[0] + DOT.x) / 2} ${HIT[1] - 260} ${DOT.x + 150} ${DOT.y - 40}`;

function Tag({ fill, text }: { fill: string; text: string }) {
  return (
    <g transform="translate(1120 300) rotate(-6)">
      <rect x={-150} y={-62} width={300} height={124} rx={20} fill={fill} />
      <text x={0} y={24} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={600} fontSize={72} fill={text}>
        403
      </text>
    </g>
  );
}

export function ValidateFixCover() {
  return (
    <Stage tone="sage">
      {/* The patched wall */}
      <rect x={WALL.x} y={WALL.y} width={WALL.w} height={FLOOR - WALL.y} rx={18} fill={INK} />
      {brickJoints().map(([a, b], i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#2b2b29" strokeWidth={6} />
      ))}
      {/* The crack, sealed in Ember */}
      <path d={seamD} fill="none" stroke={EMBER} strokeWidth={18} strokeLinejoin="round" strokeLinecap="butt" />
      <path d={seamD} fill="none" stroke="#ffc2a6" strokeWidth={5} strokeLinejoin="round" transform="translate(-4 -2)" />
      {/* Where the replayed exploit hit */}
      {burst.map(([a, b], i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      ))}
      <path d={TRAIL} fill="none" stroke={INK} strokeOpacity={0.35} strokeWidth={8} strokeDasharray="2 26" strokeLinecap="round" />
      <Tag fill={INK} text={CREAM} />
      <Shadow x={DOT.x} />
      <Dot x={DOT.x} y={DOT.y} size={DOT.size} mood="happy" look={[1, -0.2]} rotate={-12} />
    </Stage>
  );
}
