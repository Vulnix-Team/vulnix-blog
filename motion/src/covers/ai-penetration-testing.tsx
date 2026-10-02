import { CREAM, EMBER, FONT_MONO, INK } from "../brand";
import { Dot } from "../dot";
import { FLOOR, Shadow, Stage } from "./stage";

// Cover for "What Is AI Penetration Testing?". The article's line: an AI
// pentest doesn't report that a lock looks weak, it opens it and keeps the
// proof. A big padlock with its shackle just popped open, the key still
// turned in it, a PROVEN tag swinging off the shackle, and Dot beside it,
// pleased.

const LOCK = { x: 1180, y: 600, w: 420, h: FLOOR - 600 };
const LEG_L = LOCK.x + 92;
const LEG_R = LOCK.x + LOCK.w - 92;
const SHACKLE_W = 46;
// The shackle is lifted, then swung open on its right leg, which stays in the
// body; the left leg comes free.
const LIFT = 60;
const SWING = 26;
const PIVOT: [number, number] = [LEG_R, LOCK.y];
const rad = (deg: number) => (deg * Math.PI) / 180;
/** Where a point on the shackle ends up after the lift and the swing. */
function swung([x, y]: [number, number]): [number, number] {
  const [dx, dy] = [x - PIVOT[0], y - LIFT - PIVOT[1]];
  const a = rad(SWING);
  return [PIVOT[0] + dx * Math.cos(a) - dy * Math.sin(a), PIVOT[1] + dx * Math.sin(a) + dy * Math.cos(a)];
}
const DOT = { x: 820, size: 250 };

function Shackle() {
  const top = LOCK.y - 330;
  const r = (LEG_R - LEG_L) / 2;
  const d = `M ${LEG_L} ${LOCK.y - 20} L ${LEG_L} ${top + r} A ${r} ${r} 0 0 1 ${LEG_R} ${top + r} L ${LEG_R} ${LOCK.y + 120}`;
  // The tag hangs off the right side of the open shackle, clear of the lock.
  const [hx, hy] = swung([LEG_R + SHACKLE_W / 2 - 4, top + r + 20]);
  return (
    <g>
      <g transform={`rotate(${SWING} ${PIVOT[0]} ${PIVOT[1]}) translate(0 ${-LIFT})`}>
        <path d={d} fill="none" stroke={INK} strokeWidth={SHACKLE_W} strokeLinecap="round" />
      </g>
      <path d={`M ${hx} ${hy} Q ${hx + 70} ${hy + 40} ${hx + 96} ${hy + 112}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <g transform={`translate(${hx + 120} ${hy + 168}) rotate(12)`}>
        <rect x={-130} y={-50} width={260} height={100} rx={18} fill={EMBER} />
        <circle cx={-102} cy={0} r={10} fill={CREAM} />
        <text x={14} y={19} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={600} fontSize={50} fill={CREAM}>
          PROVEN
        </text>
      </g>
    </g>
  );
}

function Body() {
  const cx = LOCK.x + LOCK.w / 2;
  const cy = LOCK.y + LOCK.h * 0.48;
  return (
    <g>
      <rect x={LOCK.x} y={LOCK.y} width={LOCK.w} height={LOCK.h} rx={44} fill={INK} />
      {/* The empty hole the left leg of the shackle came out of */}
      <rect x={LEG_L - SHACKLE_W / 2 - 6} y={LOCK.y - 8} width={SHACKLE_W + 12} height={34} rx={10} fill="#2a2a2a" />
      {/* Keyhole, lit, with the key turned a quarter in it */}
      <circle cx={cx} cy={cy - 30} r={46} fill={EMBER} />
      <path d={`M ${cx - 26} ${cy - 10} L ${cx + 26} ${cy - 10} L ${cx + 40} ${cy + 96} L ${cx - 40} ${cy + 96} Z`} fill={EMBER} />
      <g transform={`rotate(90 ${cx} ${cy - 30})`}>
        <rect x={cx - 22} y={cy - 150} width={44} height={128} rx={18} fill={CREAM} />
        <circle cx={cx} cy={cy - 118} r={11} fill={INK} />
      </g>
    </g>
  );
}

export function AiPenetrationTestingCover() {
  return (
    <Stage tone="cream">
      <Shadow x={LOCK.x + LOCK.w / 2} width={LOCK.w + 60} />
      <Body />
      <Shackle />
      {/* The pop: where the left leg just left the body */}
      {[-160, -130, -100].map((a) => {
        const [x, y] = [LEG_L, LOCK.y - 6];
        return (
          <line
            key={a}
            x1={x + Math.cos(rad(a)) * 50}
            y1={y + Math.sin(rad(a)) * 50}
            x2={x + Math.cos(rad(a)) * 100}
            y2={y + Math.sin(rad(a)) * 100}
            stroke={INK}
            strokeOpacity={0.4}
            strokeWidth={10}
            strokeLinecap="round"
          />
        );
      })}
      <Shadow x={DOT.x} width={210} />
      <Dot x={DOT.x} y={FLOOR - DOT.size / 2} size={DOT.size} mood="wink" look={[1, -0.5]} rotate={-4} />
    </Stage>
  );
}
